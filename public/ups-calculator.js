// Mock rates data
const mockRates = [
    {
        id: "1",
        carrier: "UPS",
        service: "UPS® Ground Saver",
        description: "Est. Delivery: Mon 11/4 by 7:00 PM",
        price: 7.94,
        logo: "🤎"
    },
    {
        id: "2", 
        carrier: "UPS",
        service: "UPS® Ground",
        description: "Est. Delivery: Mon 11/4 by 7:00 PM",
        price: 7.99,
        logo: "🤎"
    },
    {
        id: "3",
        carrier: "UPS",
        service: "UPS 3 Day Select®",
        description: "Est. Delivery: Fri 11/1 by 7:00 PM", 
        price: 10.39,
        logo: "🤎"
    },
    {
        id: "4",
        carrier: "UPS",
        service: "UPS 2nd Day Air®",
        description: "Est. Delivery: Thu 10/31 by 7:00 PM",
        price: 13.91,
        logo: "🤎"
    },
    {
        id: "5",
        carrier: "UPS",
        service: "UPS 2nd Day Air A.M.®",
        description: "Est. Delivery: Thu 10/31 by 12:00 PM",
        price: 19.83,
        logo: "🤎"
    },
    {
        id: "6",
        carrier: "UPS",
        service: "UPS Next Day Air Saver®",
        description: "Est. Delivery: Wed 10/30 by 3:00 PM",
        price: 37.97,
        logo: "🤎"
    },
    {
        id: "7",
        carrier: "UPS", 
        service: "UPS Next Day Air®",
        description: "Est. Delivery: Wed 10/30 by 12:00 PM",
        price: 44.51,
        logo: "🤎"
    },
    {
        id: "8",
        carrier: "UPS",
        service: "UPS Next Day Air Early®",
        description: "Est. Delivery: Wed 10/30 by 8:00 AM", 
        price: 74.51,
        logo: "🤎"
    }
];

// DOM elements
const browseRatesBtn = document.getElementById('browseRatesBtn');
const noRates = document.getElementById('noRates');
const ratesList = document.getElementById('ratesList');
const ratesTitle = document.getElementById('ratesTitle');
const viewBySelect = document.getElementById('viewBy');

// Form elements
const shipFromZip = document.getElementById('shipFromZip');
const shipToCountry = document.getElementById('shipToCountry');
const shipToZip = document.getElementById('shipToZip');
const residential = document.getElementById('residential');
const weight = document.getElementById('weight');
const length = document.getElementById('length');
const width = document.getElementById('width');
const height = document.getElementById('height');
const packageSelect = document.getElementById('package');
const confirmation = document.getElementById('confirmation');
const serviceClass = document.getElementById('serviceClass');

// State
let currentRates = [];
let isCalculating = false;

// Event listeners
browseRatesBtn.addEventListener('click', handleCalculateRates);
viewBySelect.addEventListener('change', handleViewByChange);

// Calculate rates function
function handleCalculateRates() {
    if (isCalculating) return;
    
    isCalculating = true;
    browseRatesBtn.textContent = 'Loading...';
    browseRatesBtn.disabled = true;
    browseRatesBtn.classList.add('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        currentRates = [...mockRates];
        displayRates(currentRates);
        updateRatesTitle();
        
        isCalculating = false;
        browseRatesBtn.textContent = 'Browse Rates';
        browseRatesBtn.disabled = false;
        browseRatesBtn.classList.remove('loading');
    }, 1000);
}

// Display rates function
function displayRates(rates) {
    if (rates.length === 0) {
        noRates.style.display = 'block';
        ratesList.style.display = 'none';
        return;
    }
    
    noRates.style.display = 'none';
    ratesList.style.display = 'block';
    
    ratesList.innerHTML = '';
    
    rates.forEach(rate => {
        const rateItem = document.createElement('div');
        rateItem.className = 'rate-item';
        
        rateItem.innerHTML = `
            <div class="rate-logo">
                <span>${rate.logo}</span>
            </div>
            <div class="rate-details">
                <div class="rate-service">${rate.service}</div>
                <div class="rate-description">${rate.description}</div>
            </div>
            <div class="rate-price">
                <div class="rate-price-amount">$${rate.price.toFixed(2)}</div>
            </div>
        `;
        
        ratesList.appendChild(rateItem);
    });
}

// Update rates title
function updateRatesTitle() {
    if (currentRates.length > 0) {
        ratesTitle.textContent = `Rates 5 out of 5 carriers available`;
    } else {
        ratesTitle.textContent = 'Rates';
    }
}

// Handle view by change
function handleViewByChange() {
    const viewBy = viewBySelect.value;
    
    if (currentRates.length === 0) return;
    
    let sortedRates = [...currentRates];
    
    if (viewBy === 'Price') {
        sortedRates.sort((a, b) => a.price - b.price);
    } else {
        // Sort by carriers (already in carrier order)
        sortedRates = [...mockRates];
    }
    
    displayRates(sortedRates);
}

// Form validation
function validateForm() {
    const requiredFields = [shipFromZip, shipToZip, weight, length, width, height];
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    
    return true;
}

// Input event listeners for real-time validation
[shipFromZip, shipToZip, weight, length, width, height].forEach(input => {
    input.addEventListener('input', () => {
        const isValid = validateForm();
        browseRatesBtn.disabled = !isValid && !isCalculating;
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    noRates.style.display = 'block';
    ratesList.style.display = 'none';
    
    // Initial validation
    const isValid = validateForm();
    browseRatesBtn.disabled = !isValid;
});

// Export for potential external use
window.UPSCalculator = {
    calculateRates: handleCalculateRates,
    getCurrentRates: () => currentRates,
    setMockRates: (rates) => {
        mockRates.length = 0;
        mockRates.push(...rates);
    }
};