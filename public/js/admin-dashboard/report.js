document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#dateRangePicker", {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [new Date(), new Date()],
        enable: [
            function(date) {
                return date <= new Date();
            }
        ],
    });
});
