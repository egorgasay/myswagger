document.addEventListener('DOMContentLoaded', function() {
        const usePasswordCheckbox = document.getElementById('use-password');
        const passwordFields = document.getElementById('password-fields');
        const generatePasswordCheckbox = document.getElementById('generate-password');
        const uploadPasswordInput = document.getElementById('upload-password');
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file');
        const fileUploadText = dropZone.querySelector('.file-upload-text');
        usePasswordCheckbox.addEventListener('change', function() {
            passwordFields.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                uploadPasswordInput.value = '';
                generatePasswordCheckbox.checked = false;
            }
        });
        generatePasswordCheckbox.addEventListener('change', function() {
            uploadPasswordInput.disabled = this.checked;
            if (this.checked) {
                uploadPasswordInput.value = '';
            }
        });
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            dropZone.classList.add('highlight');
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            updateFileUploadText(files[0].name);
        }

        function updateFileUploadText(fileName) {
            fileUploadText.textContent = fileName;
        }
        // Handle file selection via the file input
        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                updateFileUploadText(this.files[0].name);
            }
        });
    }

);