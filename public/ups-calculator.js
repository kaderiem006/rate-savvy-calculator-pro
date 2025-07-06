
// UPS API Configuration
const UPS_CONFIG = {
    client_id: "Ppw36sPsrEMyNU3utABKrS2n94MpqvwQZ2lGhG4bowCQD15x",
    client_secret: "OtCKalHqqcfJ472LwZ4yUPAq1wgzZFk7VZSTkJcywfsjHrV6ZrgvWM3BTXWvGKlh",
    token_url: "https://wwwcie.ups.com/security/v1/oauth/token",
    rating_url: "https://wwwcie.ups.com/api/rating/v1/Rate"
};

// Global variables
let accessToken = null;
let tokenExpiry = null;

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

// Base64 encoding function
function base64Encode(str) {
    return btoa(str);
}

// Get UPS Access Token (Mock for demo - UPS API requires server-side calls)
async function getUPSAccessToken() {
    try {
        // Check if token is still valid
        if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
            return accessToken;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock token for demo purposes
        accessToken = "mock_access_token_" + Date.now();
        
        // Set token expiry (UPS tokens typically expire in 1 hour)
        tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 1);

        console.log('Mock UPS Authentication successful');
        return accessToken;
    } catch (error) {
        console.error('UPS Authentication error:', error);
        throw error;
    }
}

// Get UPS Rates (Mock data for demo - UPS API requires server-side calls)
async function getUPSRates(shipmentData) {
    try {
        const token = await getUPSAccessToken();

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock rate data based on shipment details
        const baseRate = 15.99;
        const weightMultiplier = shipmentData.weight * 0.5;
        const distanceMultiplier = Math.random() * 5; // Simulate distance-based pricing
        
        const mockRates = [
            {
                serviceCode: '03',
                totalCharges: (baseRate + weightMultiplier + distanceMultiplier).toFixed(2)
            },
            {
                serviceCode: '02',
                totalCharges: (baseRate * 1.5 + weightMultiplier + distanceMultiplier).toFixed(2)
            },
            {
                serviceCode: '01',
                totalCharges: (baseRate * 2.2 + weightMultiplier + distanceMultiplier).toFixed(2)
            },
            {
                serviceCode: '12',
                totalCharges: (baseRate * 1.3 + weightMultiplier + distanceMultiplier).toFixed(2)
            }
        ];

        // Create mock response structure
        const mockResponse = {
            RateResponse: {
                RatedShipment: mockRates.map((rate, index) => ({
                    Service: {
                        Code: rate.serviceCode
                    },
                    TotalCharges: {
                        MonetaryValue: rate.totalCharges
                    }
                }))
            }
        };

        console.log('Mock UPS Rate Response:', mockResponse);
        return parseUPSRateResponse(mockResponse);
    } catch (error) {
        console.error('UPS Rate request error:', error);
        throw error;
    }
}

// Parse UPS Rate Response
function parseUPSRateResponse(data) {
    const rates = [];

    if (data.RateResponse && data.RateResponse.RatedShipment) {
        const ratedShipments = Array.isArray(data.RateResponse.RatedShipment) 
            ? data.RateResponse.RatedShipment 
            : [data.RateResponse.RatedShipment];

        ratedShipments.forEach((shipment, index) => {
            const serviceCode = shipment.Service.Code;
            const serviceName = getUPSServiceName(serviceCode);
            const totalCharges = parseFloat(shipment.TotalCharges.MonetaryValue);

            rates.push({
                id: `ups-${index}`,
                carrier: "UPS",
                service: serviceName,
                description: `Service Code: ${serviceCode}`,
                price: totalCharges,
                logo: "🤎"
            });
        });
    }

    return rates;
}

// Get UPS Service Name by Code
function getUPSServiceName(serviceCode) {
    const serviceNames = {
        '01': 'UPS Next Day Air®',
        '02': 'UPS 2nd Day Air®',
        '03': 'UPS Ground',
        '07': 'UPS Worldwide Express℠',
        '08': 'UPS Worldwide Expedited℠',
        '11': 'UPS Standard',
        '12': 'UPS 3 Day Select®',
        '13': 'UPS Next Day Air Saver®',
        '14': 'UPS Next Day Air® Early',
        '54': 'UPS Worldwide Express Plus℠',
        '59': 'UPS 2nd Day Air A.M.®',
        '65': 'UPS Saver',
        '82': 'UPS Today Standard',
        '83': 'UPS Today Dedicated Courier',
        '84': 'UPS Today Intercity',
        '85': 'UPS Today Express',
        '86': 'UPS Today Express Saver'
    };

    return serviceNames[serviceCode] || `UPS Service ${serviceCode}`;
}

// Event listeners
browseRatesBtn.addEventListener('click', handleCalculateRates);
viewBySelect.addEventListener('change', handleViewByChange);

// Calculate rates function
async function handleCalculateRates() {
    if (isCalculating) return;
    
    // Validate form
    if (!validateForm()) {
        alert('Please fill in all required fields');
        return;
    }
    
    isCalculating = true;
    browseRatesBtn.textContent = 'Loading...';
    browseRatesBtn.disabled = true;
    browseRatesBtn.classList.add('loading');
    
    try {
        const shipmentData = {
            shipFromZip: shipFromZip.value.trim(),
            shipToZip: shipToZip.value.trim(),
            shipToCountry: shipToCountry.value,
            residential: residential.checked,
            weight: parseFloat(weight.value) || 1,
            length: parseFloat(length.value) || 10,
            width: parseFloat(width.value) || 6,
            height: parseFloat(height.value) || 3
        };

        console.log('Calculating rates for:', shipmentData);
        
        currentRates = await getUPSRates(shipmentData);
        displayRates(currentRates);
        updateRatesTitle();
        
    } catch (error) {
        console.error('Error calculating rates:', error);
        
        // Show error message
        noRates.style.display = 'block';
        ratesList.style.display = 'none';
        noRates.innerHTML = `
            <div class="no-rates-title">Error calculating rates</div>
            <div class="no-rates-subtitle">${error.message}</div>
        `;
    } finally {
        isCalculating = false;
        browseRatesBtn.textContent = 'Browse Rates';
        browseRatesBtn.disabled = false;
        browseRatesBtn.classList.remove('loading');
    }
}

// Display rates function
function displayRates(rates) {
    if (rates.length === 0) {
        noRates.style.display = 'block';
        ratesList.style.display = 'none';
        noRates.innerHTML = `
            <div class="no-rates-title">No rates available</div>
            <div class="no-rates-subtitle">No shipping rates found for the specified route</div>
        `;
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
        ratesTitle.textContent = `Rates - ${currentRates.length} service${currentRates.length !== 1 ? 's' : ''} available`;
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
    }
    // Carriers are already grouped by carrier
    
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
    console.log('UPS Rate Calculator initialized');
    
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
    getAccessToken: getUPSAccessToken
};
