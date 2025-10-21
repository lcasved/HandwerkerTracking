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

// Mock database for handwerker orders
const orders = {
  'AUFTRAG001': {
    id: 'Auftrag001',
    customerName: 'Max Mustermann',
    product: 'Badsanierung',
    status: 'In Bearbeitung',
    orderDate: '2025-10-10',
    estimatedDelivery: '2025-10-28',
    currentLocation: 'Lüneburg, Musterstraße 12',
    trackingHistory: [
      { date: '2025-10-10 09:00', status: 'Auftrag angenommen', location: 'Büro Uelzen' },
      { date: '2025-10-11 14:30', status: 'Materialbestellung', location: 'Büro Uelzen' },
      { date: '2025-10-15 08:00', status: 'Material eingetroffen', location: 'Lager Lüneburg' },
      { date: '2025-10-16 07:30', status: 'Abbrucharbeiten begonnen', location: 'Lüneburg, Musterstraße 12' },
      { date: '2025-10-18 08:00', status: 'Rohrleitungen verlegt', location: 'Lüneburg, Musterstraße 12' },
      { date: '2025-10-20 09:00', status: 'Fliesenarbeiten in Arbeit', location: 'Lüneburg, Musterstraße 12' }
    ]
  },
  'AUFTRAG002': {
    id: 'Auftrag002',
    customerName: 'Anna Schmidt',
    product: 'Kücheneinbau',
    status: 'Abgeschlossen',
    orderDate: '2025-10-05',
    estimatedDelivery: '2025-10-15',
    currentLocation: 'Hamburg, Elbstraße 45',
    trackingHistory: [
      { date: '2025-10-05 10:00', status: 'Auftrag angenommen', location: 'Büro Hamburg' },
      { date: '2025-10-06 15:00', status: 'Küche bestellt', location: 'Büro Hamburg' },
      { date: '2025-10-10 09:00', status: 'Küche geliefert', location: 'Lager Hamburg' },
      { date: '2025-10-12 08:00', status: 'Montage begonnen', location: 'Hamburg, Elbstraße 45' },
      { date: '2025-10-13 10:00', status: 'Elektrik angeschlossen', location: 'Hamburg, Elbstraße 45' },
      { date: '2025-10-14 16:30', status: 'Arbeiten abgeschlossen', location: 'Hamburg, Elbstraße 45' },
      { date: '2025-10-15 09:00', status: 'Abnahme erfolgt', location: 'Hamburg, Elbstraße 45' }
    ]
  },
  'AUFTRAG003': {
    id: 'Auftrag003',
    customerName: 'Thomas Weber',
    product: 'Treppenrenovierung',
    status: 'Angenommen',
    orderDate: '2025-10-16',
    estimatedDelivery: '2025-10-30',
    currentLocation: 'Büro Uelzen',
    trackingHistory: [
      { date: '2025-10-16 13:20', status: 'Auftrag angenommen', location: 'Büro Uelzen' },
      { date: '2025-10-17 08:00', status: 'Vor-Ort-Besichtigung', location: 'Uelzen, Bahnhofstraße 8' },
      { date: '2025-10-18 10:00', status: 'Angebot erstellt', location: 'Büro Uelzen' },
      { date: '2025-10-19 14:00', status: 'Auftrag bestätigt', location: 'Büro Uelzen' }
    ]
  },
  'AUFTRAG004': {
    id: 'Auftrag004',
    customerName: 'Jonas Felz',
    product: 'Fliesenverlegung',
    status: 'Storniert',
    orderDate: '2025-09-16',
    estimatedDelivery: '2025-09-25',
    currentLocation: 'Büro Uelzen',
    trackingHistory: [
      { date: '2025-09-16 13:20', status: 'Auftrag angenommen', location: 'Büro Uelzen' },
      { date: '2025-09-17 08:00', status: 'Materialbestellung', location: 'Büro Uelzen' },
      { date: '2025-09-18 15:30', status: 'Storniert durch Kunde', location: 'Büro Uelzen' }
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
        message: 'Auftragsnummer nicht gefunden. Bitte überprüfen Sie die Nummer und versuchen Sie es erneut.'
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
      message: 'Auftragsnummer nicht gefunden.'
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
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`� Verfolgen Sie Ihre Aufträge unter http://localhost:${PORT}/track`);
  console.log('\nBeispiel-Auftragsnummern:');
  console.log('  - AUFTRAG001 (In Bearbeitung - Badsanierung)');
  console.log('  - AUFTRAG002 (Abgeschlossen - Kücheneinbau)');
  console.log('  - AUFTRAG003 (Angenommen - Treppenrenovierung)');
  console.log('  - AUFTRAG004 (Storniert - Fliesenverlegung)');
});
