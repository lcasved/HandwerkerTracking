# 🔧 Handwerker Sendungsverfolgung (Order Tracking System)

A modern order tracking web application built with Express.js, EJS, and vanilla JavaScript with AJAX functionality.

## Features

- ✨ **Real-time Order Tracking** - Track orders using tracking numbers
- 📦 **Detailed Order Information** - View customer details, products, and delivery estimates
- 📍 **Tracking Timeline** - Complete history of order status updates
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- ⚡ **AJAX Integration** - Asynchronous data loading without page refresh
- 🔍 **Error Handling** - User-friendly error messages

## Technologies Used

- **Backend**: Node.js, Express.js
- **Templating**: EJS (Embedded JavaScript)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AJAX**: Fetch API
- **Styling**: Custom CSS with CSS Grid and Flexbox

## Installation

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Run the application:**
   ```powershell
   npm start
   ```

   Or for development with auto-restart:
   ```powershell
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
Handwerker_sendungsverfolgung/
├── index.js              # Main Express server
├── package.json          # Project dependencies
├── views/                # EJS templates
│   ├── index.ejs        # Home page
│   └── track.ejs        # Tracking page
├── public/              # Static files
│   ├── css/
│   │   └── style.css    # Styles
│   └── js/
│       └── tracking.js  # AJAX tracking logic
└── README.md            # This file
```

## Usage

### Test Tracking Numbers

Use these sample tracking numbers to test the application:

- **ORD001** - In Transit (from Munich to Berlin)
- **ORD002** - Delivered (Hamburg)
- **ORD003** - Processing (Frankfurt)

### How It Works

1. Navigate to the tracking page (`/track`)
2. Enter a tracking number (e.g., ORD001)
3. Click "Sendung suchen" (Search Shipment)
4. View detailed tracking information including:
   - Order details
   - Current status
   - Location
   - Complete tracking history

## API Endpoints

### POST /api/track
Track an order by tracking number.

**Request:**
```json
{
  "trackingNumber": "ORD001"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "ORD001",
    "customerName": "Max Mustermann",
    "product": "Handwerker Toolkit Premium",
    "status": "In Transit",
    "orderDate": "2025-10-10",
    "estimatedDelivery": "2025-10-20",
    "currentLocation": "Distribution Center Berlin",
    "trackingHistory": [...]
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Tracking number not found."
}
```

### GET /api/track/:trackingNumber
Alternative GET endpoint for tracking.

## Features in Detail

### AJAX Implementation
- Uses modern Fetch API for asynchronous requests
- Loading states with spinner animation
- Error handling with user-friendly messages
- Smooth transitions and animations

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Optimized for all screen sizes
- Touch-friendly interface

### User Experience
- Auto-focus on input field
- Clear error messages
- Loading indicators
- Smooth scrolling to results
- "Search Again" functionality

## Customization

### Adding New Orders
Edit the `orders` object in `index.js`:

```javascript
const orders = {
  'YOUR_ID': {
    id: 'YOUR_ID',
    customerName: 'Customer Name',
    product: 'Product Name',
    status: 'Status',
    // ... other fields
  }
};
```

### Styling
Modify `public/css/style.css` to customize:
- Color scheme (CSS variables in `:root`)
- Fonts
- Layout
- Animations

## License

This project is open source and available under the MIT License.

## Author

Created with ❤️ for Handwerker Sendungsverfolgung

---

**Note:** This is a demonstration project with mock data. In production, you would connect to a real database and tracking API.
