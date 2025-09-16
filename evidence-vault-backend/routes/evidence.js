const express = require('express');
const { addEvidence, getEvidence, verifyEvidence } = require('../controllers/evidenceController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(auth);

router.post('/:id/evidence', upload.array('files', 10), addEvidence);
router.post('/evidence/:id', getEvidence);
router.get('/evidence/:id/verify', verifyEvidence);

module.exports = router;