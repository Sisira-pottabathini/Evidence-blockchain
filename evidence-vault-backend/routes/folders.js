const express = require('express');
const { createFolder, getFolders, unlockFolder, getFolder } = require('../controllers/folderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createFolder);
router.get('/', getFolders);
router.post('/:id/unlock', unlockFolder);
router.get('/:id', getFolder);

module.exports = router;