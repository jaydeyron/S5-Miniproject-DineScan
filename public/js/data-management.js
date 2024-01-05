function confirmRemove(dishName, dishId, role) {
  var confirmation = confirm("Are you sure you want to remove the dish '" + dishName + "'?");
  if (confirmation) {
    fetch(`/api/remove-dish/${dishId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // If the request was successful, show a success message
        window.location.href = `/${role}-dashboard/data-management`;
      } else if (response.status === 400) {
        // Handle the case where the dish was not found
        alert(`Dish '${dishName}' cannot be removed as it is used in previous orders.`);
      } else if (response.status === 500) {
        // Handle the case where there was a server error
        alert('Internal Server Error. Please try again later.');
      } else {
        // Handle other response statuses if needed
        console.error('Error removing dish:', response.statusText);
      }
    })
    .catch(error => {
      // Handle network errors
      console.error('Error removing dish:', error);
    });
  } else {
    
  }
}
  
// Add this JavaScript code to your existing script or in a new script file

function openUpdateForm(dishId, dishName, price, vegetarian, available, dishDescription, dishPhoto, calories, protein, fat, carb) {
  const updateForm = document.getElementById('update-form');
  const menuDiv = document.getElementById('menu-division');
  const contentDiv = document.getElementById('content-division');
  const dishHeading = document.getElementById('update-form-header');
  const formAction = document.getElementById('updateDishForm');
  dishHeading.textContent = `Update Dish: ${dishName}`;

  // Use backticks (`) to create a template literal
  formAction.action = `/api/update-dish/${dishId}`;
  console.log(formAction.action);

  // Populate the form fields with the existing data
  document.getElementById('update-dishName').value = dishName;
  document.getElementById('update-price').value = price;
  document.getElementById('update-vegetarian').value = vegetarian;
  document.getElementById('update-available').value = available;
  document.getElementById('update-dishDescription').value = dishDescription;
  document.getElementById('update-dishPhoto').value = dishPhoto;
  document.getElementById('update-calories').value = calories;
  document.getElementById('update-protein').value = protein;
  document.getElementById('update-fat').value = fat;
  document.getElementById('update-carb').value = carb;

  updateForm.style.display = 'flex';
  menuDiv.style.filter = 'blur(5px)';
  contentDiv.style.filter = 'blur(5px)';
}

function closeUpdateForm() {
  const updateForm = document.getElementById('update-form');
  const menuDiv = document.getElementById('menu-division');
  const contentDiv = document.getElementById('content-division');
    updateForm.style.display = 'none';
    menuDiv.style.filter = 'none';
    contentDiv.style.filter = 'none';
}

function openAddForm() {
  const addForm = document.getElementById('add-form');
  const menuDiv = document.getElementById('menu-division');
  const contentDiv = document.getElementById('content-division');
    const dishHeading = document.getElementById('add-form-header');
    const formAction = document.getElementById('addDishForm');

    formAction.action = `/api/add-dish`;
    console.log(formAction.action);

    dishHeading.textContent = `Add New Dish:`;
    addForm.style.display = 'flex';
    menuDiv.style.filter = 'blur(5px)';
    contentDiv.style.filter = 'blur(5px)';
    
    const addDropzone = document.getElementById('add-dropzone');
}

function closeAddForm() {
  const addForm = document.getElementById('add-form');
  const menuDiv = document.getElementById('menu-division');
  const contentDiv = document.getElementById('content-division');
  addForm.style.display = 'none';
  menuDiv.style.filter = 'none';
  contentDiv.style.filter = 'none';
}

// Initialize Dropzone for the add-form
Dropzone.autoDiscover = false;

        document.addEventListener("DOMContentLoaded", function () {
            const addDropzone = new Dropzone("#add-dropzone", {
                url: "/api/upload-dish-image", // Replace with the actual server endpoint for file uploads
                acceptedFiles: "image/*",
                paramName: "file",
                maxFiles: 1,
                clickable: "#add-dropzone",
                autoProcessQueue: true, // Enable automatic file processing
                init: function () {
                  // Your custom initialization code here
                  this.on("success", function (file, response) {
                      // This code runs after a successful upload
                      document.getElementById('add-dishPhoto').value = response.fileName;                  
                    });
              },
            });

            const updateDropzone = new Dropzone("#update-dropzone", {
              url: "/api/upload-dish-image", // Replace with the actual server endpoint for file uploads
              acceptedFiles: "image/*",
              paramName: "file",
              maxFiles: 1,
              clickable: "#update-dropzone",
              autoProcessQueue: true, // Enable automatic file processing
              init: function () {
                // Your custom initialization code here
                this.on("success", function (file, response) {
                    // This code runs after a successful upload
                    document.getElementById('update-dishPhoto').value = response.imagePath;       
                  });              
            },
          });
});