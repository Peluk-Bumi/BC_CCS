# 🔧 BC_CCS Blockchain Setup Guide

## 📋 Prerequisites

- **Node.js**: 18.0.0 atau lebih tinggi
- **npm**: 8.0.0 atau lebih tinggi
- **Git**: Untuk version control
- **Polygon Amoy Testnet**: Akses ke testnet
- **MetaMask**: Untuk wallet management (optional)

## 🚀 Installation Steps

### 1. Clone Repository

```bash
cd BC_CCS
npm install
```

### 2. Environment Configuration

```bash
# Copy template environment
cp .env.example .env

# Edit .env dengan editor favorit Anda
nano .env  # atau gunakan editor lain
```

### 3. Environment Variables

```env
# Blockchain Network
POLYGON_AMOY_URL=https://rpc-amoy.polygon.technology
POLYGON_MAINNET_URL=https://polygon-rpc.com

# Private Key (untuk deployment)
PRIVATE_KEY=your_private_key_here

# IPFS Configuration
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_GATEWAY_URL=https://gateway.ipfs.io

# Service Configuration
PORT=4000
NODE_ENV=development
LOG_LEVEL=debug

# Security
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Compile Smart Contract

```bash
npx hardhat compile
```

## 🔐 Private Key Setup

### Generate Private Key

#### Option 1: Using MetaMask
1. Open MetaMask
2. Click account menu → Settings → Security & Privacy
3. Click "Reveal Secret Recovery Phrase"
4. Use a tool to derive private key from seed phrase

#### Option 2: Using Hardhat
```bash
npx hardhat run scripts/generate-key.js
```

#### Option 3: Using ethers.js
```javascript
const ethers = require('ethers');
const wallet = ethers.Wallet.createRandom();
console.log('Private Key:', wallet.privateKey);
console.log('Address:', wallet.address);
```

### ⚠️ Security Warning

**JANGAN PERNAH:**
- Commit private key ke repository
- Share private key dengan siapapun
- Gunakan private key di public network tanpa protection
- Simpan private key di plain text file

**SELALU:**
- Gunakan environment variables
- Gunakan .env file (jangan commit)
- Rotate private key secara berkala
- Gunakan hardware wallet untuk production

## 🌐 Network Configuration

### Polygon Amoy Testnet

```javascript
// hardhat.config.js
networks: {
  polygonAmoy: {
    url: process.env.POLYGON_AMOY_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 80002,
    gasPrice: "auto"
  }
}
```

### Polygon Mainnet

```javascript
networks: {
  polygon: {
    url: process.env.POLYGON_MAINNET_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 137,
    gasPrice: "auto"
  }
}
```

## 💰 Get Testnet Funds

### Polygon Amoy Faucet

1. Buka https://faucet.polygon.technology/
2. Pilih "Polygon Amoy"
3. Masukkan wallet address
4. Klaim MATIC tokens

### Alternative Faucets
- https://www.alchemy.com/faucets/polygon-amoy
- https://faucet.quicknode.com/polygon/amoy

## 📦 Smart Contract Deployment

### 1. Compile Contract

```bash
npx hardhat compile
```

**Output:**
```
Compiling 1 file with 0.8.19
Compilation successful
```

### 2. Deploy to Testnet

```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

**Output:**
```
Deploying DocumentRegistry...
DocumentRegistry deployed to: 0x5C5F6CE61647600bB8c04F59c0F2B493EBE78DDF
```

### 3. Verify Deployment

```bash
node scripts/verify-build.js
```

### 4. Save Deployment Address

Update `docs/DEPLOYMENT_ADDRESSES.md` dengan address yang baru.

## 🔗 Blockchain Service

### Start Development Server

```bash
npm run dev
```

**Output:**
```
Blockchain service running on port 4000
Connected to Polygon Amoy
Ready to accept requests
```

### Start Production Server

```bash
npm start
```

### Service Endpoints

```
POST   /api/blockchain/store-document
GET    /api/blockchain/document/:id
GET    /api/blockchain/verify/:txHash
GET    /api/blockchain/health
```

## 🧪 Testing Setup

### Run Diagnostic

```bash
php testing/diagnostic-blockchain.php
```

### Verify Blockchain Status

```bash
php testing/verify_blockchain_status.php
```

## 📊 Monitoring

### Check Service Status

```bash
curl http://localhost:4000/api/blockchain/health
```

### View Logs

```bash
# Development
tail -f logs/blockchain.log

# Production
journalctl -u ccs-blockchain -f
```

## 🔄 Integration with BE_CCS

### Update BE_CCS Configuration

```env
# BE_CCS/.env
BLOCKCHAIN_SERVICE_URL=http://localhost:4000
```

### Update BE_CCS Routes

```php
// BE_CCS/routes/api.php
Route::prefix('blockchain')->group(function () {
    Route::post('/store-document', [BlockchainController::class, 'storeDocument']);
    Route::get('/document/{id}', [BlockchainController::class, 'getDocument']);
    Route::get('/verify/{txHash}', [BlockchainController::class, 'verifyTransaction']);
});
```

## 🔄 Integration with FE_CCS

### Update FE_CCS Configuration

```env
# FE_CCS/.env
VITE_BLOCKCHAIN_SERVICE_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=0x5C5F6CE61647600bB8c04F59c0F2B493EBE78DDF
VITE_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

### Web3 Connection

```javascript
// FE_CCS/src/features/blockchain/services/blockchainService.js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_POLYGON_AMOY_RPC_URL
);

const contract = new ethers.Contract(
  import.meta.env.VITE_CONTRACT_ADDRESS,
  ABI,
  provider
);
```

## 🚨 Troubleshooting

### Issue: "Cannot find module 'ethers'"

```bash
npm install ethers@6.15.0
```

### Issue: "Invalid private key"

```bash
# Verify private key format
node -e "console.log(process.env.PRIVATE_KEY)"

# Should output: 0x followed by 64 hex characters
```

### Issue: "Network error"

```bash
# Test RPC connection
curl https://rpc-amoy.polygon.technology

# Check network status
npx hardhat network-info --network polygonAmoy
```

### Issue: "Insufficient funds"

```bash
# Get testnet funds from faucet
# https://faucet.polygon.technology/

# Check balance
npx hardhat run scripts/check-balance.js --network polygonAmoy
```

### Issue: "Contract deployment failed"

```bash
# Check gas price
npx hardhat run scripts/check-gas.js --network polygonAmoy

# Retry with higher gas limit
npx hardhat run scripts/deploy.js --network polygonAmoy --gas 5000000
```

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Polygon Documentation](https://polygon.technology/developers)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] .env file configured
- [ ] Private key set correctly
- [ ] Dependencies installed (`npm install`)
- [ ] Smart contract compiled (`npx hardhat compile`)
- [ ] Testnet funds obtained
- [ ] Deployment successful
- [ ] Service running on port 4000
- [ ] BE_CCS integration configured
- [ ] FE_CCS integration configured

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0
