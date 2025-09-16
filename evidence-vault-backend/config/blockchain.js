const CryptoJS = require('crypto-js');
const crypto = require('crypto');

// Simple blockchain implementation for evidence hashing
class SimpleBlockchain {
  constructor() {
    this.chain = [];
    this.currentEvidence = [];
    this.difficulty = 2;
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      data: "Genesis Block",
      previousHash: "0",
      hash: this.calculateHash(0, "0", Date.now(), "Genesis Block")
    };
    this.chain.push(genesisBlock);
  }

  calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();
  }

  addBlock(data) {
    const index = this.chain.length;
    const previousHash = this.chain[this.chain.length - 1].hash;
    const timestamp = Date.now();
    const hash = this.calculateHash(index, previousHash, timestamp, data);

    const newBlock = {
      index,
      timestamp,
      data,
      previousHash,
      hash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  // Create a hash for evidence data
  createEvidenceHash(evidenceData) {
    const dataString = JSON.stringify(evidenceData);
    return CryptoJS.SHA256(dataString).toString();
  }

  // Verify evidence integrity
  verifyEvidence(evidenceData, originalHash) {
    const currentHash = this.createEvidenceHash(evidenceData);
    return currentHash === originalHash;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block hash is correct
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.data
      )) {
        return false;
      }

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Create a singleton instance
const blockchain = new SimpleBlockchain();

module.exports = blockchain;