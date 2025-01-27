// Function to toggle dropdown menu visibility
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

// Event listener for dropdown button
document.querySelector('.dropbtn').addEventListener('click', toggleDropdown);

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
            }
        }
    }
});

// Function to handle file uploads
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('http://localhost:8080', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Show success or error message
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading file.');
    });
}

// Event listener for file upload button
document.getElementById('uploadButton').addEventListener('click', uploadFile);
