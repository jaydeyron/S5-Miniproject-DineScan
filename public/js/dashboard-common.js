document.addEventListener('DOMContentLoaded', function () {
    var dropdownContent = document.getElementById('dropdown-content');
    var contentDiv = document.getElementById('content-division');

    function toggleDropdown() {
        if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
            dropdownContent.style.display = 'block';
            contentDiv.style.overflow = 'hidden'; // Disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
            dropdownContent.style.display = 'none';
            contentDiv.style.overflow = 'auto'; // Enable scrolling
            document.body.style.overflow = '';
        }
    }

    // Add a click event listener to the document body
    document.body.addEventListener('click', function (event) {
        // Check if the clicked element is part of the dropdown or not
        if (!dropdownContent.contains(event.target)) {
            // If not, close the dropdown
            dropdownContent.style.display = 'none';
            contentDiv.style.overflow = 'auto'; // Enable scrolling
            document.body.style.overflow = '';
        }
    });

    // Prevent the click on the dropdown button from closing the dropdown
    document.getElementById('profile').addEventListener('click', function (event) {
        event.stopPropagation();
        toggleDropdown();
    });
});
