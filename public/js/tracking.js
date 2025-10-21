
// DOM Elements
const trackingForm = document.getElementById('trackingForm');
const trackingNumberInput = document.getElementById('trackingNumber');
const trackBtn = document.getElementById('trackBtn');
const btnText = trackBtn.querySelector('.btn-text');
const btnLoader = trackBtn.querySelector('.btn-loader');
const errorMessage = document.getElementById('errorMessage');
const trackingResults = document.getElementById('trackingResults');
const searchAgainBtn = document.getElementById('searchAgain');

// Form Submit Handler
trackingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const trackingNumber = trackingNumberInput.value.trim();
    
    if (!trackingNumber) {
        showError('Bitte geben Sie eine Auftragsnummer ein.');
        return;
    }
    
    await trackOrder(trackingNumber);
});

// Search Again Handler
searchAgainBtn.addEventListener('click', () => {
    // Hide results
    trackingResults.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Clear and focus input
    trackingNumberInput.value = '';
    trackingNumberInput.focus();
    
    // Scroll to form
    document.querySelector('.tracking-form').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Track Order Function using AJAX
async function trackOrder(trackingNumber) {
    // Show loading state
    setLoading(true);
    hideError();
    hideResults();
    
    try {
        // AJAX Request using Fetch API
        const response = await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trackingNumber })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.data);
        } else {
            showError(data.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    } finally {
        setLoading(false);
    }
}

// Display Results Function
function displayResults(order) {
    // Populate order info
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('customerName').textContent = order.customerName;
    document.getElementById('product').textContent = order.product;
    document.getElementById('orderDate').textContent = formatDate(order.orderDate);
    document.getElementById('estimatedDelivery').textContent = formatDate(order.estimatedDelivery);
    
    // Set status badge
    const statusBadge = document.getElementById('statusBadge');
    const timelinebar = document.querySelector('tracking-timeline');
    statusBadge.textContent = order.status;
    statusBadge.className = 'status-badge';
    
    // Add appropriate color class based on status (Handwerker-specific)
    switch(order.status.toLowerCase()) {
        case 'delivered':
        case 'abgeschlossen':
        case 'fertiggestellt':
        case 'completed':
            statusBadge.style.background = '#d1fae5';
            statusBadge.style.color = '#065f46';
            break;
        case 'in transit':
        case 'in bearbeitung':
        case 'in arbeit':
        case 'wird bearbeitet':
        case 'out for delivery':
            statusBadge.style.background = '#dbeafe';
            statusBadge.style.color = '#1e40af';
            break;
        case 'processing':
        case 'angenommen':
        case 'geplant':
        case 'vorbereitung':
        case 'shipped':
            statusBadge.style.background = '#fef3c7';
            statusBadge.style.color = '#92400e';
            break;
        case 'cancelled':
        case 'storniert':
        case 'abgebrochen':
            statusBadge.style.background = '#ef444489';
            statusBadge.style.color = '#ff0000';
            break;
        case 'pausiert':
        case 'wartend':
        case 'auf material':
            statusBadge.style.background = '#fef9c3';
            statusBadge.style.color = '#854d0e';
            break;
        default:
            statusBadge.style.background = '#f1f5f9';
            statusBadge.style.color = '#475569';
    }
    
    document.getElementById('currentLocation').textContent = order.currentLocation;
    
    // Build timeline
    buildTimeline(order.trackingHistory);

    displayMap(order.currentLocation);
    document.getElementById('locationoftheorder').textContent = `📍 Aktueller Arbeitsort: ${order.currentLocation}`;
    
    // Show results
    trackingResults.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        trackingResults.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function displayMap(locationName) {
    const mapContainer = document.getElementById('mapContainer');
    const mapFrame = document.getElementById('mapFrame');
    
    if (!locationName) {
        mapContainer.style.display = 'none';
        return;
    }
    
    // Encode the location name for URL
    const encodedLocation = encodeURIComponent(locationName);
    
    // Create Google Maps embed URL using place name
    const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&hl=de&z=12&output=embed`;
    
    mapFrame.innerHTML = `<iframe src="${mapUrl}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    mapContainer.style.display = 'block';
}



// Build Timeline Function
function buildTimeline(history) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    // Reverse to show newest first
    const reversedHistory = [...history].reverse();
    
    reversedHistory.forEach((event, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // Mark completed items (Handwerker-specific statuses)
        const completedStatuses = ['delivered', 'abgeschlossen', 'fertiggestellt', 'completed'];
        if (index < reversedHistory.length - 1 || completedStatuses.includes(event.status.toLowerCase())) {
            timelineItem.classList.add('completed');
        }
        
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-date">${formatDateTime(event.date)}</div>
                <div class="timeline-status">${event.status}</div>
                <div class="timeline-location">📍 ${event.location}</div>
            </div>
        `;
        const cancelledStatuses = ['cancelled', 'storniert', 'abgebrochen'];
        if(cancelledStatuses.includes(event.status.toLowerCase())){
            timelineItem.querySelector('.timeline-content').style.backgroundColor = '#991b1b';
            timelineItem.querySelector('.timeline-content').style.color = '#ffffff';
        }
        timeline.appendChild(timelineItem);
    });
    
    // Add pending work indicator for incomplete jobs
    const completedStatuses = ['delivered', 'abgeschlossen', 'fertiggestellt', 'completed'];
    const lastStatus = history[history.length - 1]?.status.toLowerCase() || '';
    
    if(timeline.classList.contains("completed") == false && !completedStatuses.includes(lastStatus)){
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-content uncompleted">
                <div class="timeline-date">Fertigstellungsdatum noch nicht bestätigt</div>
                <div class="timeline-status">⏳ Weitere Arbeitsschritte ausstehend</div>
            </div>
        `;
        timeline.appendChild(item);
    }
}

// Helper Functions
function setLoading(isLoading) {
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        trackBtn.disabled = true;
        trackBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        trackBtn.disabled = false;
        trackBtn.style.opacity = '1';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideResults() {
    trackingResults.style.display = 'none';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
}

function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('de-DE', options);
}

// Auto-focus on input when page loads
window.addEventListener('load', () => {
    trackingNumberInput.focus();
});

// Allow Enter key to submit
trackingNumberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        trackingForm.dispatchEvent(new Event('submit'));
    }
});
