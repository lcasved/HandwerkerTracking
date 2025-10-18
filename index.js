const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mock database for orders
const orders = {
  'ORD001': {
    id: 'ORD001',
    customerName: 'Max Mustermann',
    product: 'Bad',
    status: 'In Transit',
    orderDate: '2025-10-10',
    estimatedDelivery: '2025-10-20',
    currentLocation: 'Distribution Center Lüneburg',
    trackingHistory: [
      { date: '2025-10-10 09:00', status: 'Order Placed', location: 'Uelzen' },
      { date: '2025-10-11 14:30', status: 'Processing', location: 'Warehouse Lüneburg' },
      { date: '2025-10-12 08:15', status: 'Shipped', location: 'Lüneburg Depot' },
      { date: '2025-10-15 11:00', status: 'In Transit', location: 'Distribution Center Lüneburg' }
    ]
  },
  'ORD002': {
    id: 'ORD002',
    customerName: 'Anna Schmidt',
    product: 'Küche',
    status: 'Delivered',
    orderDate: '2025-10-05',
    estimatedDelivery: '2025-10-12',
    currentLocation: 'Delivered',
    trackingHistory: [
      { date: '2025-10-05 10:00', status: 'Order Placed', location: 'Hamburg' },
      { date: '2025-10-06 15:00', status: 'Processing', location: 'Warehouse Hamburg' },
      { date: '2025-10-07 09:00', status: 'Shipped', location: 'Hamburg Depot' },
      { date: '2025-10-10 14:00', status: 'Out for Delivery', location: 'Hamburg' },
      { date: '2025-10-10 16:30', status: 'Delivered', location: 'Customer Address' }
    ]
  },
  'ORD003': {
    id: 'ORD003',
    customerName: 'Thomas Weber',
    product: 'Kellertreppe',
    status: 'Processing',
    orderDate: '2025-10-16',
    estimatedDelivery: '2025-10-25',
    currentLocation: 'Warehouse Uelzen',
    trackingHistory: [
      { date: '2025-10-16 13:20', status: 'Order Placed', location: 'Uelzen' },
      { date: '2025-10-17 08:00', status: 'Processing', location: 'Warehouse Uelzen' }
    ]
  },
  'ORD004': {
    id: 'ORD004',
    customerName: 'Jonas keller',
    product: 'Fliesen legen',
    status: 'Cancelled',
    orderDate: '2025-12-16',
    estimatedDelivery: '2025-12-25',
    currentLocation: 'Uelzen',
    trackingHistory: [
      { date: '2025-12-16 13:20', status: 'Order Placed', location: 'Uelzen' },
      { date: '2025-12-17 08:00', status: 'Processing', location: 'Warehouse Uelzen' },
      { date: '2025-12-18 08:00', status: 'Cancelled', location: 'Warehouse Uelzen' }
    ]
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/track', (req, res) => {
  res.render('track');
});

// API endpoint for tracking
app.post('/api/track', (req, res) => {
  const { trackingNumber } = req.body;
  
  // Simulate processing delay
  setTimeout(() => {
    const order = orders[trackingNumber.toUpperCase()];
    
    if (order) {
      res.json({
        success: true,
        data: order
      });
    } else {
      res.json({
        success: false,
        message: 'Tracking number not found. Please check and try again.'
      });
    }
  }, 500);
});

// GET API endpoint (for direct URL access)
app.get('/api/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const order = orders[trackingNumber.toUpperCase()];
  
  if (order) {
    res.json({
      success: true,
      data: order
    });
  } else {
    res.json({
      success: false,
      message: 'Tracking number not found.'
    });
  }
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/track', (req, res) => {
    const trackingNumber = req.query.trackingNumber || '';
    res.render('track', { prefilledTracking: trackingNumber });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Track your orders at http://localhost:${PORT}/track`);
  console.log('\nSample tracking numbers:');
  console.log('  - ORD001 (In Transit)');
  console.log('  - ORD002 (Delivered)');
  console.log('  - ORD003 (Processing)');
});
