const Folder = require('../models/Folder');
const Evidence = require('../models/Evidence');
const bcrypt = require('bcryptjs');

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user._id;

    // Hash folder password
    const hashedPassword = await bcrypt.hash(password, 12);

    const folder = await Folder.create({
      name,
      password: hashedPassword,
      user: userId
    });

    res.status(201).json({
      _id: folder._id,
      name: folder.name,
      createdAt: folder.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all folders for a user
const getFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const folders = await Folder.find({ user: userId })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get evidence count for each folder
    const foldersWithCount = await Promise.all(
      folders.map(async (folder) => {
        const evidenceCount = await Evidence.countDocuments({ folder: folder._id });
        return {
          ...folder.toObject(),
          evidenceCount
        };
      })
    );

    res.json(foldersWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlock folder with password
const unlockFolder = async (req, res) => {
  try {
    const { password } = req.body;
    const folderId = req.params.id;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, folder.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid folder password' });
    }

    res.json({ message: 'Folder unlocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get folder details
const getFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, user: userId })
      .select('-password');
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const evidence = await Evidence.find({ folder: folderId })
      .select('-secretKey -blockchainHash');

    res.json({
      folder,
      evidence
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFolder,
  getFolders,
  unlockFolder,
  getFolder
};