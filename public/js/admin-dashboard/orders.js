
function openUpdateForm(orderId, tableNum, orderStatus) {
    const updateForm = document.getElementById('update-form');
    const userHeading = document.getElementById('update-form-header');
    const menuDiv = document.getElementById('menu-division');
    const contentDiv = document.getElementById('content-division');
    const formAction = document.getElementById('updateStatusForm');
    userHeading.textContent = `Update Order Status : Table number ${tableNum}`;
  
    // Use backticks (`) to create a template literal
    formAction.action = `/api/update-order-status/${orderId}`;
    console.log(formAction.action);
  
    // Populate the form fields with the existing data
    document.getElementById('update-orderStatus').value = orderStatus;
  
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