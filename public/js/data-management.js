function confirmRemove(dishName, dishId) {
    var confirmation = confirm("Are you sure you want to remove the dish '" + dishName + "'?");
    if (confirmation) {
        fetch(`/api/remove-dish/${dishId}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              alert(data.message);
            })
            .catch(error => {
              console.error('Error removing dish:', error);
            })
            .finally(() => {
              setTimeout(() => {
                location.reload();
              }, 200);
            });          
    } else {
      // Handle the case where the user canceled the action
    }
  }
  
// Add this JavaScript code to your existing script or in a new script file
const updateDishModal = document.getElementById('updateDishModal');

function openUpdateDishModal() {
  updateDishModal.style.display = 'block';
}

function closeUpdateDishModal() {
  updateDishModal.style.display = 'none';
}

function submitUpdateDishForm(dishId) {
  const dishName = document.getElementById('dishName').value;
  const price = document.getElementById('price').value;
  const vegetarian = document.getElementById('vegetarian').value;
  const available = document.getElementById('available').value;

  // Perform the update logic here using fetch or other methods
  console.log(`Updating dish ${dishId} with new details: ${dishName}, ${price}, ${vegetarian}, ${available}`);

  // Close the modal after updating
  closeUpdateDishModal();
}
