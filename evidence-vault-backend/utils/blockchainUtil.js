const blockchain = require('../config/blockchain');

// Generate evidence hash for blockchain
const generateEvidenceHash = (evidenceData) => {
  return blockchain.createEvidenceHash(evidenceData);
};

// Add evidence to blockchain
const addToBlockchain = (evidenceData) => {
  const block = blockchain.addBlock(evidenceData);
  return block.hash;
};

// Verify evidence integrity
const verifyEvidenceIntegrity = (evidenceData, originalHash) => {
  return blockchain.verifyEvidence(evidenceData, originalHash);
};

// Get blockchain status
const getBlockchainStatus = () => {
  return {
    length: blockchain.chain.length,
    isValid: blockchain.isChainValid()
  };
};

module.exports = {
  generateEvidenceHash,
  addToBlockchain,
  verifyEvidenceIntegrity,
  getBlockchainStatus
};