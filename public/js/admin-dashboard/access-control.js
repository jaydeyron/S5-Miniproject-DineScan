function confirmRemove(firstName, lastName, userId, role) {
  var confirmation = confirm("Are you sure you want to remove the user '" + firstName + ' ' + lastName + "'?");
  if (confirmation) {
    fetch(`/api/remove-user/${userId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        window.location.href = `/${role}-dashboard/access-control`;
      } else if (response.status === 500) {
        // Handle the case where there was a server error
        alert('Internal Server Error. Please try again later.');
      } else {
        // Handle other response statuses if needed
        console.error('Error removing user:', response.statusText);
      }
    })
    .catch(error => {
      // Handle network errors
      console.error('Error removing user:', error);
    });
  } else {
    
  }
}

function openAddForm() {
    const userHeading = document.getElementById('add-form-header');
    const formAction = document.getElementById('addUserForm');
    const addForm = document.getElementById('add-form');
    const menuDiv = document.getElementById('menu-division');
    const contentDiv = document.getElementById('content-division');

    formAction.action = `/api/add-user`;
    console.log(formAction.action);

    userHeading.textContent = `Add New User :`;
    addForm.style.display = 'flex';
    menuDiv.style.filter = 'blur(5px)';
    contentDiv.style.filter = 'blur(5px)';
}

function closeAddForm() {
    const addForm = document.getElementById('add-form');
    const menuDiv = document.getElementById('menu-division');
    const contentDiv = document.getElementById('content-division');
    addForm.style.display = 'none';
    menuDiv.style.filter = 'none';
    contentDiv.style.filter = 'none';
  }

function openUpdateForm(userId, firstName, lastName, role, username, password) {
    const updateForm = document.getElementById('update-form');
    const userHeading = document.getElementById('update-form-header');
    const menuDiv = document.getElementById('menu-division');
    const contentDiv = document.getElementById('content-division');
    const formAction = document.getElementById('updateUserForm');
    userHeading.textContent = `Update User : ${firstName}`;
  
    // Use backticks (`) to create a template literal
    formAction.action = `/api/update-user/${userId}`;
    console.log(formAction.action);
  
    // Populate the form fields with the existing data
    document.getElementById('update-firstName').value = firstName;
    document.getElementById('update-lastName').value = lastName;
    document.getElementById('update-role').value = role;
    document.getElementById('update-username').value = username;
    document.getElementById('update-password').value = password;
  
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