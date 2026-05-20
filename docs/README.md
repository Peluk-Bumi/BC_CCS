# 🔗 BC_CCS - Blockchain Service Documentation

## 📋 Overview

BC_CCS adalah layanan blockchain terpusat untuk Peluk Bumi Environmental Monitoring System (EMS). Layanan ini menangani:

- **Smart Contract Management**: DocumentRegistry smart contract di Polygon Amoy
- **Document Storage**: Penyimpanan dokumen terdesentralisasi di blockchain
- **Transaction Management**: Pengelolaan transaksi blockchain
- **IPFS Integration**: Integrasi dengan IPFS untuk file storage

## 🏗️ Struktur Direktori

```
BC_CCS/
├── contracts/                  # Smart contracts
│   └── DocumentRegistry.sol    # Smart contract utama
├── scripts/                    # Deployment & utility scripts
│   ├── deploy.js              # Script deployment
│   ├── deploy-simple.js       # Script deployment sederhana
│   └── verify-build.js        # Script verifikasi build
├── config/                    # Konfigurasi
│   └── blockchainConfig.js    # Konfigurasi blockchain
├── guards/                    # Security guards
│   └── securityGuard.js       # Security validation
├── utils/                     # Utility functions
│   └── validation.js          # Validasi blockchain
├── testing/                   # Testing files
│   ├── diagnostic-blockchain.php
│   └── verify_blockchain_status.php
├── docs/                      # Dokumentasi
│   ├── README.md             # File ini
│   ├── SETUP.md              # Setup guide
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── DEPLOYMENT_ADDRESSES.md # Deployment addresses
├── artifacts/                # Build artifacts
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Dependencies
├── server.js                 # Blockchain service server
├── .env                      # Environment variables
└── .env.example              # Template environment
```

## 🛠️ Tech Stack

- **Solidity 0.8.19** - Smart contract language
- **Hardhat 3.4.3** - Smart contract development framework
- **Ethers.js 6.15.0** - Ethereum interaction library
- **Express.js 4.18.2** - Node.js web framework
- **IPFS HTTP Client 58.0.0** - IPFS integration
- **EVM testnet** — Polygon Amoy (default di `server.js`, chainId 80002)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- Polygon Amoy testnet access

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### Development

```bash
# Start blockchain service
npm run dev

# Deploy smart contract
npx hardhat run scripts/deploy.js --network polygonAmoy

# Verify deployment
node scripts/verify-build.js
```

### Production

```bash
# Start service
npm start

# Or use the provided scripts
./start-blockchain-production.sh  # Linux/Mac
start-service.bat                 # Windows
```

## 📝 Smart Contract

### DocumentRegistry

Smart contract untuk menyimpan dan mengelola dokumen di blockchain.

**Features:**
- Store documents dengan metadata
- Retrieve documents by ID
- Event logging untuk setiap transaksi
- Immutable record keeping

**Deployment Address:**
Lihat `docs/DEPLOYMENT_ADDRESSES.md`

## 🔐 Security

### Environment Variables

```env
PRIVATE_KEY=your_private_key
POLYGON_AMOY_URL=https://rpc-amoy.polygon.technology
IPFS_API_URL=https://ipfs.infura.io:5001
```

### Security Guards

- Input validation
- Transaction verification
- Rate limiting
- Error handling

## 📊 API Endpoints

### Store Document
```http
POST /api/blockchain/store-document
Content-Type: application/json

{
  "document_type": "perencanaan",
  "document_id": 1,
  "document_hash": "0x...",
  "metadata": "{...}"
}
```

### Get Document
```http
GET /api/blockchain/document/:docId
```

### Verify Transaction
```http
GET /api/blockchain/verify/:transactionHash
```

## 🧪 Testing

### Run Tests
```bash
# Diagnostic blockchain
php testing/diagnostic-blockchain.php

# Verify blockchain status
php testing/verify_blockchain_status.php
```

## 📚 Documentation

- **SETUP.md** - Setup dan konfigurasi blockchain
- **DEPLOYMENT.md** - Deployment guide
- **DEPLOYMENT_ADDRESSES.md** - Smart contract addresses
- **SEVEN_LAYER_ALIGNMENT.md** - Kesesuaian layer Contract / Consensus / Network (vs analisis 7 layer)

Root repo: [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)

## 🔄 Integration

### Backend Integration (BE_CCS)
- API endpoints untuk blockchain operations
- Queue jobs untuk async blockchain transactions
- Error handling dan retry logic

### Frontend Integration (FE_CCS)
- Web3 wallet connection
- Smart contract interaction
- Transaction monitoring

## 🚨 Troubleshooting

### Common Issues

#### Connection Error
```bash
# Check RPC URL
curl https://rpc-amoy.polygon.technology

# Verify network
npx hardhat network-info --network polygonAmoy
```

#### Deployment Failed
```bash
# Check gas price
npx hardhat run scripts/verify-build.js

# Retry deployment
npx hardhat run scripts/deploy.js --network polygonAmoy
```

#### Transaction Pending
```bash
# Check transaction status
php testing/verify_blockchain_status.php
```

## 📞 Support

Untuk bantuan lebih lanjut:
1. Lihat dokumentasi di folder `/docs`
2. Check logs di blockchain service
3. Run diagnostic tests di `/testing`

## 📄 License

MIT License - Lihat LICENSE file

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
