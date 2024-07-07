document.addEventListener('DOMContentLoaded', function() {
    const generatePasswordCheckbox = document.getElementById('generate-password');
    const uploadPasswordInput = document.getElementById('upload-password');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file');
    const fileUploadText = dropZone.querySelector('.file-upload-text');

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

    // Open file dialog when drop zone is clicked
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

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
});