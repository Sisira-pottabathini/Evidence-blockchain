const Evidence = require('../models/Evidence');
const Folder = require('../models/Folder');
const { generateEvidenceHash, addToBlockchain } = require('../utils/blockchainUtil');
const { encrypt } = require('../utils/encryption');

// Add evidence to folder
const addEvidence = async (req, res) => {
  try {
    const { name, description, secretKey } = req.body;
    const folderId = req.params.id;
    const userId = req.user._id;
    
    // Check if folder exists and belongs to user
    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Process uploaded files
    const files = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      type: file.mimetype,
      size: file.size
    }));

    if (files.length === 0) {
      return res.status(400).json({ message: 'At least one file is required' });
    }

    // Prepare evidence data for blockchain
    const evidenceData = {
      name,
      description,
      secretKey,
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      folder: folderId,
      user: userId,
      timestamp: Date.now()
    };

    // Generate hash and add to blockchain
    const evidenceHash = generateEvidenceHash(evidenceData);
    const blockchainHash = addToBlockchain(evidenceData);

    // Create evidence record
    const evidence = await Evidence.create({
      name,
      description,
      secretKey,
      files,
      folder: folderId,
      user: userId,
      blockchainHash
    });

    // Update folder evidence count
    await Folder.findByIdAndUpdate(folderId, { $inc: { evidenceCount: 1 } });

    res.status(201).json({
      _id: evidence._id,
      name: evidence.name,
      description: evidence.description,
      files: evidence.files,
      createdAt: evidence.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get evidence details
const getEvidence = async (req, res) => {
  try {
    const evidenceId = req.params.id;
    const userId = req.user._id;
    const { secretKey } = req.body;

    const evidence = await Evidence.findOne({ _id: evidenceId, user: userId });
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    // Verify secret key
    if (evidence.secretKey !== secretKey) {
      return res.status(401).json({ message: 'Invalid secret key' });
    }

    res.json({
      _id: evidence._id,
      name: evidence.name,
      description: evidence.description,
      files: evidence.files,
      createdAt: evidence.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify evidence integrity
const verifyEvidence = async (req, res) => {
  try {
    const evidenceId = req.params.id;
    const userId = req.user._id;

    const evidence = await Evidence.findOne({ _id: evidenceId, user: userId });
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    // Prepare current evidence data
    const currentEvidenceData = {
      name: evidence.name,
      description: evidence.description,
      secretKey: evidence.secretKey,
      files: evidence.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      folder: evidence.folder.toString(),
      user: evidence.user.toString(),
      timestamp: evidence.createdAt.getTime()
    };

    // Verify integrity
    const { verifyEvidenceIntegrity } = require('../utils/blockchainUtil');
    const isIntegrityValid = verifyEvidenceIntegrity(currentEvidenceData, evidence.blockchainHash);

    res.json({
      isIntegrityValid,
      verifiedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEvidence,
  getEvidence,
  verifyEvidence
};