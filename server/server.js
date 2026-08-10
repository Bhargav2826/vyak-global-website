require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vyakglobal';

// Log the URI safely (hiding the password) for debugging on Render
const safeUri = mongoUri.replace(/:([^:@]{3,})@/, ':****@');
console.log('Attempting to connect to MongoDB at:', safeUri);

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
.then(() => console.log('✅ Successfully connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error. Please check your MONGO_URI in Render Environment Variables and ensure your Atlas Network Access allows 0.0.0.0/0.');
  console.error('Error details:', err.message);
});


const path = require('path');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Serve frontend static files in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve React's index.html for non-API requests (enables React Router)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
