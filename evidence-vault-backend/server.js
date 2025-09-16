const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Initialize blockchain
const blockchain = require('./config/blockchain');
console.log('Blockchain initialized with', blockchain.chain.length, 'blocks');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/folders', require('./routes/folders'));
app.use('/api', require('./routes/evidence'));

// Blockchain status endpoint
app.get('/api/blockchain/status', (req, res) => {
  const { getBlockchainStatus } = require('./utils/blockchainUtil');
  const status = getBlockchainStatus();
  res.json(status);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});