document.addEventListener("DOMContentLoaded", function() {
    // Get the canvas element for doughnut chart
var doughnutCtx = document.getElementById('donut').getContext('2d');

    // Extracted payment type labels and counts
    var doughnutLabelsDiv = document.getElementById('donut-label');
var doughnutCountsDiv = document.getElementById('donut-count');

// Retrieve the values from the data attributes
var paymentTypeLabels = JSON.parse(doughnutLabelsDiv.getAttribute('data-labels'));
var paymentTypeCounts = JSON.parse(doughnutCountsDiv.getAttribute('data-counts'));

// Create a new doughnut chart
var myDoughnutChart = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
        labels: paymentTypeLabels,
        datasets: [{
            data: paymentTypeCounts,
            backgroundColor: ['#1a5276', '#2874a6', '#3498db'] // Darker shades of blue
        }]
    },
    options: {
        cutout: '70%', // Adjust the size of the center hole (e.g., 80% for a smaller hole)
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false // Hide the legend for a cleaner look
        }
    }
});

var barCtx = document.getElementById('bar').getContext('2d');

var barLabelsDiv = document.getElementById('bar-label');
var barCountsDiv = document.getElementById('bar-count');

// Retrieve the values from the data attributes
var soldDishesLabels = JSON.parse(barLabelsDiv.getAttribute('data-labels'));
var soldDishesCounts = JSON.parse(barCountsDiv.getAttribute('data-counts'));

// Create a new bar chart
var myBarChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: soldDishesLabels,
        datasets: [{
            label: 'Sold Dishes',
            data: soldDishesCounts,
            backgroundColor: 'rgba(0, 70, 200, 0.7)'
        }]
    },
    options: {
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    }
});

var lineCtx = document.getElementById('line').getContext('2d');


var totalAmountLabelsDiv = document.getElementById('total-amount-label');
var totalAmountValuesDiv = document.getElementById('total-amount-value');

// Retrieve the values from the data attributes
var totalAmountLabels = JSON.parse(totalAmountLabelsDiv.getAttribute('data-labels'));
// Retrieve the values from the data attributes and parse as float
var totalAmountValues = JSON.parse(totalAmountValuesDiv.getAttribute('data-values')).map(item => parseFloat(item));


// Create a new line chart for total amount last 8 months
var myLineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: totalAmountLabels,
        datasets: [{
            label: 'Total Amount',
            data: totalAmountValues,
            borderColor: '#1a5276',
            borderWidth: 2,
            fill: false,
            tension: 0
        }]
    },
    options: {
        scales: {
            x: {
                type: 'category',
                labels: totalAmountLabels
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

});
