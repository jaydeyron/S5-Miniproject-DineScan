// Select the HTML element where you want to display the data
const dataContainer = document.getElementById('menu-container');

// Make a fetch request to your server's API endpoint
fetch('/menu')
  .then(response => response.json())
  .then(data => {
    // Process the data and update the HTML content
    dataContainer.innerHTML = renderData(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Function to render the data as HTML (customize as needed)
function renderData(data) {
  // Create HTML content based on the data
  // For example, build a list of items
  const items = data.map(item => `<li>${item.dish_name}: $${item.price}</li>`).join('');

  // Return the HTML
  return `<ul>${items}</ul>`;
}
