const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  size: Number
});

const evidenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  secretKey: {
    type: String,
    required: true
  },
  files: [fileSchema],
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockchainHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evidence', evidenceSchema);