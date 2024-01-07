document.addEventListener("DOMContentLoaded", function () {
    document.body.style.display = 'block';
});

function openDishSummary(dish) {
    const overlayContent = document.getElementById("overlay");
    const viewCart = document.getElementById("view-cart-button");

    // Open the overlay
    overlayContent.style.display = "block";
    viewCart.style.display = "none";
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
                <img class="overlay-image" src="https://dinescan.s3.ap-southeast-2.amazonaws.com/${ dish.dish_photo }">
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
    const cartSize = getCartSize();
        if(cartSize > 0){
            const viewCart = document.getElementById("view-cart-button");
            viewCart.style.display = "flex";
        }
    document.body.style.overflow = "auto";
}

// Add these variables at the beginning of your JavaScript code
let cart = {}; // Object to store dish IDs and quantities
let cartName = {};
let cartPrice = {};
let cartVeg = {};
let totalPrice = 0;

let cartButton;

function addToCart(event, dish) {
    event.stopPropagation(); // Prevents the click event from triggering the parent's click event
    // Get the dish ID
    const dishId = dish.dish_id;
    const dishName = dish.dish_name;
    const dishPrice = parseInt(dish.price, 10);
    const dishVeg = dish.vegetarian;

    // If the dish is not in the cart, add it with a quantity of 1
    if (!cart[dishId]) {
        cart[dishId] = 1;
        cartName[dishId] = dishName;
        cartPrice[dishId] = dishPrice;
        cartVeg[dishId] = dishVeg;
        totalPrice+=cartPrice[dishId];
        document.getElementById("price-input").value = totalPrice;  
        document.getElementById("cart-input").value = JSON.stringify(cart);

    } else {
        // If the dish is already in the cart, increment the quantity
        cart[dishId]++;
    }

    const itemCountElement = document.getElementById("item-count");
    if (itemCountElement) {
        const cartSize = getCartSize();
        itemCountElement.textContent = cartSize === 1 ? `${cartSize} item added` : `${cartSize} items added`;
        if(cartSize === 1){
            const viewCart = document.getElementById("view-cart-button");
            viewCart.style.display = "flex";
        }
    }

    // Replace the "Add" button with the counter elements
    const button = event.target;
    const counterSection = document.createElement('div');
    counterSection.classList.add('counter-section');
    counterSection.innerHTML = `
        <button class="counter-button" onclick="decrementQuantity(event, ${dishId})">–</button>
        <span class="quantity">${cart[dishId]}</span>
        <button class="counter-button" onclick="incrementQuantity(event, ${dishId})">+</button>
    `;

    counterSection.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    cartButton = button;

    button.replaceWith(counterSection);

    // Add a delay before adding the "active" class to give the transition effect
    setTimeout(function () {
        counterSection.classList.add('active');
    }, 10);
}

function getCartSize() {
    return Object.keys(cart).length;
}

function incrementQuantity(event, dishId) {
    event.stopPropagation();
    // Increment the quantity in the cart
    cart[dishId]++;
    totalPrice+=cartPrice[dishId];
    document.getElementById("price-input").value = totalPrice;
    document.getElementById("cart-input").value = JSON.stringify(cart);

    // Get the quantity element and update its content
    const quantityElement = event.target.parentElement.querySelector('.quantity');
    if (quantityElement) {
        quantityElement.textContent = cart[dishId].toString();
    }

}

function decrementQuantity(event, dishId) {
    event.stopPropagation();
    // Decrement the quantity in the cart, ensuring it doesn't go below 1
    cart[dishId]--;
    totalPrice-=cartPrice[dishId];
    document.getElementById("price-input").value = totalPrice;
    document.getElementById("cart-input").value = JSON.stringify(cart);
    // Get the quantity element and update its content
    if (cart[dishId] === 0) {
        removeDishFromCart(dishId);
        revertToAddButton(event, dishId);
    } else {
        // Get the quantity element and update its content
        const quantityElement = event.target.parentElement.querySelector('.quantity');
        if (quantityElement) {
            quantityElement.textContent = cart[dishId].toString();
        }
    }
}

function revertToAddButton(event, dishId) {
    const counterSection = event.target.parentElement;
    counterSection.replaceWith(cartButton);
}

function removeDishFromCart(dishId) {
    delete cart[dishId];
    delete cartName[dishId];
    delete cartPrice[dishId];
    delete cartVeg[dishId];
    const itemCountElement = document.getElementById("item-count");
    document.getElementById("cart-input").value = JSON.stringify(cart);

    if (itemCountElement) {
        const cartSize = getCartSize();
        itemCountElement.textContent = cartSize === 1 ? `${cartSize} item added` : `${cartSize} items added`;
        if(cartSize === 0){
            const viewCart = document.getElementById("view-cart-button");
            viewCart.style.display = "none";
        }
    }

    // Optionally, you can add logic to update your cart or perform other actions here
}


function openOrderSummary(dishes) {
    const orderSummaryOverlay = document.getElementById("order-summary-overlay");
    const viewCart = document.getElementById("view-cart-button");

    // Open the overlay
    orderSummaryOverlay.style.display = "block";
    viewCart.style.display = "none";

    // Add a delay before adding the "active" class for the transition effect
    setTimeout(function() {
        orderSummaryOverlay.classList.add("active");
    }, 0);

    // Disable scrolling
    document.body.style.overflow = "hidden";
    
    // Update the order summary content here (if needed)
    const orderSummaryList = document.getElementById("order-summary-list");
    const totalAmount = document.getElementById("total-amount");
    orderSummaryList.innerHTML = "";
    totalAmount.textContent = `${totalPrice}`;

    for (const dishId in cart) {
        const listItem = document.createElement("li");
        // Create span for the icon (vegetarian or non-vegetarian)
        const listVeg = document.createElement("span");
        listVeg.textContent = cartVeg[dishId] ? 'fiber_manual_record' : 'change_history';
        listVeg.classList.add('material-symbols-outlined', cartVeg[dishId] ? 'vegetarian' : 'non-vegetarian');
        
        // Create span for the text content
        const listText = document.createElement("span");
        listText.textContent = `  ${cartName[dishId]} x ${cart[dishId]} – Rs. ${cartPrice[dishId] * cart[dishId]}`;
        
        // Append both spans to the listItem
        listItem.appendChild(listVeg);
        listItem.appendChild(listText);
        
        // Append the listItem to the orderSummaryList
        orderSummaryList.appendChild(listItem);
        
    }

}

function closeOrderSummary() {
    const orderSummaryOverlay = document.getElementById("order-summary-overlay");
    const viewCart = document.getElementById("view-cart-button");

    viewCart.style.display = "flex";

    // Add a delay before removing the "active" class
    setTimeout(function() {
        orderSummaryOverlay.classList.remove("active");
    }, 0);

    // Hide the overlay after the transition is complete
    setTimeout(function() {
        orderSummaryOverlay.style.display = "none";
    }, 500); // Adjust the timeout based on your transition duration

    // Enable scrolling
    document.body.style.overflow = "auto";
}

function toggleCategory(category) {
    const content = document.getElementById(`${category}`);
    const contentButton = document.getElementById(`${category}-text`);

    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        content.style.maxHeight = '10000px'; // Adjust the max-height as per your content
        content.style.opacity = '1';
        contentButton.textContent = 'arrow_drop_up'

    } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        contentButton.textContent = 'arrow_drop_down'

    }
}