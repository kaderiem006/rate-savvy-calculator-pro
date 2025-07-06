
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

// Get UPS Access Token
async function getUPSAccessToken() {
    try {
        // Check if token is still valid
        if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
            return accessToken;
        }

        const authString = UPS_CONFIG.client_id + ":" + UPS_CONFIG.client_secret;
        const authBase64 = base64Encode(authString);

        const response = await fetch(UPS_CONFIG.token_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authBase64
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Authentication failed: ${response.status}`);
        }

        const data = await response.json();
        accessToken = data.access_token;
        
        // Set token expiry (UPS tokens typically expire in 1 hour)
        tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 1);

        console.log('UPS Authentication successful');
        return accessToken;
    } catch (error) {
        console.error('UPS Authentication error:', error);
        throw error;
    }
}

// Get UPS Rates
async function getUPSRates(shipmentData) {
    try {
        const token = await getUPSAccessToken();

        const rateRequest = {
            RateRequest: {
                Request: {
                    RequestOption: "Shop",
                    TransactionReference: {
                        CustomerContext: "Rate Calculator"
                    }
                },
                Shipment: {
                    Shipper: {
                        Name: "Shipper",
                        Address: {
                            PostalCode: shipmentData.shipFromZip,
                            CountryCode: "US"
                        }
                    },
                    ShipTo: {
                        Name: "Ship To",
                        Address: {
                            PostalCode: shipmentData.shipToZip,
                            CountryCode: shipmentData.shipToCountry === "United States" ? "US" : "CA",
                            ResidentialAddressIndicator: shipmentData.residential ? "1" : ""
                        }
                    },
                    Package: [{
                        PackagingType: {
                            Code: "02",
                            Description: "Package"
                        },
                        Dimensions: {
                            UnitOfMeasurement: {
                                Code: "IN"
                            },
                            Length: shipmentData.length.toString(),
                            Width: shipmentData.width.toString(),
                            Height: shipmentData.height.toString()
                        },
                        PackageWeight: {
                            UnitOfMeasurement: {
                                Code: "LBS"
                            },
                            Weight: shipmentData.weight.toString()
                        }
                    }]
                }
            }
        };

        const response = await fetch(UPS_CONFIG.rating_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'transId': 'rate-calculator-' + new Date().getTime(),
                'transactionSrc': 'RateCalculator'
            },
            body: JSON.stringify(rateRequest)
        });

        if (!response.ok) {
            throw new Error(`Rate request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('UPS Rate Response:', data);

        return parseUPSRateResponse(data);
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
