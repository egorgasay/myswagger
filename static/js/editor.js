angular.module('app', ['ui.ace'])
    .controller('ctrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

        var themes = [
            "chrome",
            "clouds",
            "crimson_editor",
            "dawn",
            "dreamweaver",
            "eclipse",
            "github",
            "solarized_light",
            "textmate",
            "tomorrow",
            "xcode",
            "kuroir",
            "katzenmilch",
            "ambiance",
            "chaos",
            "clouds_midnight",
            "cobalt",
            "idle_fingers",
            "kr_theme",
            "merbivore",
            "merbivore_soft",
            "mono_industrial",
            "monokai",
            "pastel_on_dark",
            "solarized_dark",
            "terminal",
            "tomorrow_night",
            "tomorrow_night_blue",
            "tomorrow_night_bright",
            "tomorrow_night_eighties",
            "twilight",
            "vibrant_ink"
        ];
        $scope.currentTheme = 14;

        var modes = [
            'json',
            'yaml',
        ];

        $scope.value = '';

        $scope.aceLoaded = function(_editor) {
            _editor.setFontSize(14);

            // Listen for changes in the mode selector
            var modeSelector = document.getElementById('mode-selector');
            modeSelector.addEventListener('change', function() {
                $scope.editor.mode = this.value;
                $scope.$apply(); // Apply the changes to the scope
            });
        }


        // ADAPTIVE FONT SIZE
        // $scope.aceLoaded = function(_editor) {
        //     function setAdaptiveFontSize() {
        //         const windowWidth = window.innerWidth;
        //         let fontSize;
        //         if (windowWidth < 768) {
        //             fontSize = 18;
        //         } else if (windowWidth < 1024) {
        //             fontSize = 15;
        //         } else {
        //             fontSize = 14;
        //         }
        //         _editor.setFontSize(fontSize);
        //     }
        //     setAdaptiveFontSize();
        //     window.addEventListener('resize', setAdaptiveFontSize);
        // }

        $scope.aceChanged = function(_editor) {}

        var editor = function() {
            this.theme = themes[$scope.currentTheme];
            this.mode = 'yaml';
            this.opacity = 100;
            this.useWrapMode = true;
            this.gutter = true;
            this.splitMode = false;
            this.themeCycle = false;
        };

        $scope.editor = new editor();


        var themeCycle = function() {
                $timeout(function() {
                    if ($scope.editor.themeCycle) {
                        $scope.currentTheme = $scope.currentTheme + 1;
                        if ($scope.currentTheme < themes.length) {
                            $scope.editor.theme = themes[$scope.currentTheme];
                        } else {
                            $scope.currentTheme = 0;
                            $scope.editor.theme = themes[$scope.currentTheme];
                        }
                    }
                    themeCycle();
                }, 500);
            }
            // themeCycle();

    }]);

function saveFile() {
    const editorContent = angular.element(document.querySelector('[ng-controller="ctrl"]')).scope().value;

    fetch('/save-new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: editorContent }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.filename) {
                window.location.href = data.filename;
            } else {
                console.error('Error: No filename received');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}