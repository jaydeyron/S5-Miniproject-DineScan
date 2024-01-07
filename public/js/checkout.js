function togglePaymentDetails() {
    var paymentMethod = document.getElementById("paymentMethod");
    var upiDetails = document.getElementById("upiDetails");
    var cardDetails = document.getElementById("cardDetails");

    if (paymentMethod.value === "Credit card" || paymentMethod.value === "Debit card") {
        upiDetails.style.display = "none";
        cardDetails.style.display = "flex";
    } else if(paymentMethod.value === "UPI") {
        upiDetails.style.display = "flex";
        cardDetails.style.display = "none";
    }
    else {
        upiDetails.style.display = "none";
        cardDetails.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Get the current date
    const currentDate = new Date();

    // Set the defaultDate to the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    flatpickr("#expiryDate", {
        mode: "single", // Use "single" mode for selecting a single day
        dateFormat: "m/Y", // Use custom format for month and year
        defaultDate: firstDayOfMonth,
        enable: [
            {
                from: firstDayOfMonth,
                to: new Date().fp_incr(3650), // Enable dates for the next 10 years (365 days * 10)
            }
        ],
    });
});