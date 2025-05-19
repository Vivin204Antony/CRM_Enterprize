const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Import routes
const customerRoutes = require('./routes/customers');
const dealRoutes = require('./routes/deals');

// Use routes
app.use('/api/customers', customerRoutes);
app.use('/api/deals', dealRoutes);

// Handle specific routes for direct page access
app.get('/leads', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'leads.html'));
});

app.get('/customers', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'customers.html'));
});

// Fallback to index.html for other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start server with error handling for EADDRINUSE
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use, trying alternative port ${PORT + 1}`);
        // Try alternative port
        const altPort = PORT + 1;
        app.listen(altPort, () => {
            console.log(`Server running on alternative port ${altPort}`);
        });
    } else {
        console.error('Server error:', err);
    }
}); 