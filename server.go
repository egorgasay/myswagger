package main

import (
	"encoding/base64"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func main() {
	router := gin.Default()

	// Serve files from the swagger directory
	router.Static("/swagger", "./swagger")
	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "./static")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "test-upload.html", nil)
	})

	router.POST("/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.String(http.StatusBadRequest, "Failed to get file: %v", err)
			return
		}

		password := c.PostForm("password")
		b64Password := base64.StdEncoding.EncodeToString([]byte(password))

		uuidObj, err := uuid.NewUUID()
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to generate UUID: %v", err)
			return
		}
		uuidStr := uuidObj.String()

		var authReq string
		if password != "" {
			authReq = "a/"
		}

		if err := c.SaveUploadedFile(file, "./swagger/"+authReq+uuidStr+b64Password+".yaml"); err != nil {
			c.String(http.StatusInternalServerError, "Failed to save file: %v", err)
			return
		}

		c.HTML(http.StatusOK, "upload-success.html", gin.H{
			"password": password,
			"filename": uuidStr,
			"link": "http://127.0.0.1:8080/view?filename=" + uuidStr,
		})
	})

	router.POST("/a/view", func(c *gin.Context) {
		filename := c.Query("filename")
		password := c.PostForm("password")
		b64Password := base64.StdEncoding.EncodeToString([]byte(password))

		filePath := filepath.Join("swagger", "a", filename+b64Password+".yaml")
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			c.HTML(http.StatusOK, "password-auth.html", gin.H{
				"filename": filename,
				"incorrect_password": true,
			})
			return
		}

		c.HTML(http.StatusOK, "test.html", gin.H{
			"filename": filePath,
		})
	})

	router.GET("/view", func(c *gin.Context) {
		filename := c.Query("filename")

		// Search for the file in the swagger directory
		filePath := filepath.Join("swagger", filename+".yaml")
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			// If not found, search in the swagger/a/ directory
			filePath = filepath.Join("swagger", "a", filename+"*.yaml")
			matches, err := filepath.Glob(filePath)
			if err != nil || len(matches) == 0 {
				c.String(http.StatusNotFound, "File not found")
				return
			}
			// File found in swagger/a/, redirect to password authentication page
			c.HTML(http.StatusOK, "password-auth.html", gin.H{
				"filename": filename,
			})
			return
		}

		c.HTML(http.StatusOK, "test.html", gin.H{
			"filename": filePath,
		})
	})

	router.GET("/editor", func(c *gin.Context) {
		c.HTML(http.StatusOK, "editor.html", gin.H{})
	})

	router.Run(":8080")
}
