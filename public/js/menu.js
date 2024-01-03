function openDishSummary(dish) {
    const overlayContent = document.getElementById("overlay");
    // Open the overlay
    overlayContent.style.display = "block";
    setTimeout(function() {
        overlayContent.classList.add("active");
    }, 0);
    // Disable scrolling
  document.body.style.overflow = "hidden";
    // Update overlay content
    overlayContent.innerHTML = `
    <div class="close-veg">
                <span class="material-symbols-outlined close" onclick="closeDishSummary()" style="padding-left: 22px;" >arrow_back</span>
                <span class="material-symbols-outlined ${ dish.vegetarian ? 'vegetarian' : 'non-vegetarian' } dish-veg" style="margin-right: 15px;" >
                    ${ dish.vegetarian ? 'fiber_manual_record' : 'change_history'}
                  </span>
            </div>
            <div class="overlay-content">
                <img class="overlay-image" src="/images/uploads/${ dish.dish_photo }">
                <span class="dish-summary-name">${ dish.dish_name }</span>
                <span style="font-size: 20px; font-weight: bold;">Nutritional value per 100g</span>
                <div class="stats">
                    <div class="stat-box">
                        <span class="stat-value">${dish.calories }</span>
                        <span class="stat-unit">kcal</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${dish.protein }g</span>
                        <span class="stat-unit">proteins</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${dish.fat }g</span>
                        <span class="stat-unit">fats</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${dish.carb }g</span>
                        <span class="stat-unit">carbs</span>
                    </div>
                </div>
                <div class="summary-content">
                    <span style="font-size: 20px; font-weight: bold;">Description</span>
                    <p class="dish-summary">${dish.dish_description }</p>
                </div>
            </div>
  `;
  }
  
// Helper function to close dish summary
function closeDishSummary() {
    const overlayContent = document.getElementById("overlay");
  
    // Add a delay before removing the "active" class
    setTimeout(function() {
        overlayContent.classList.remove("active");
    }, 0);
  
    // Hide the overlay after the transition is complete
    setTimeout(function() {
        overlayContent.style.display = "none";
    }, 500); // The transition duration is 0.5s, so set timeout accordingly
  
    // Enable scrolling
    document.body.style.overflow = "auto";
}
