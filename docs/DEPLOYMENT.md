# 🚀 BC_CCS Blockchain Deployment Guide

## 📋 Overview

Panduan lengkap untuk deployment blockchain service ke production environment.

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────┐
│   Polygon Amoy Testnet              │
│   DocumentRegistry Smart Contract   │
│   Chain ID: 80002                   │
└─────────────────────────────────────┘
           ▲
           │ ethers.js
           │
┌─────────────────────────────────────┐
│   BC_CCS Blockchain Service         │
│   Node.js + Express                 │
│   Port: 4000                        │
└─────────────────────────────────────┘
      ▲              ▲
      │ HTTP         │ HTTP
      │              │
┌──────────────┐  ┌──────────────┐
│  BE_CCS      │  │  FE_CCS      │
│  Laravel API │  │  React App   │
└──────────────┘  └──────────────┘
```

## 🔧 Pre-Deployment Checklist

- [ ] Smart contract compiled dan tested
- [ ] Environment variables configured
- [ ] Private key secured
- [ ] Testnet funds available
- [ ] Dependencies installed
- [ ] Logs configured
- [ ] Monitoring setup
- [ ] Backup strategy ready

## 📦 Deployment Steps

### Step 1: Prepare Environment

```bash
# Navigate to BC_CCS
cd BC_CCS

# Install dependencies
npm install --production

# Verify installation
npm list
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
```

**Production .env:**
```env
# Network
POLYGON_AMOY_URL=https://rpc-amoy.polygon.technology
POLYGON_MAINNET_URL=https://polygon-rpc.com

# Deployment
PRIVATE_KEY=your_production_private_key
NETWORK=polygonAmoy

# Service
PORT=4000
NODE_ENV=production
LOG_LEVEL=info

# IPFS
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_GATEWAY_URL=https://gateway.ipfs.io

# Security
JWT_SECRET=your_production_jwt_secret
API_KEY=your_production_api_key
RATE_LIMIT=100
```

### Step 3: Compile Smart Contract

```bash
# Compile contract
npx hardhat compile

# Verify compilation
ls -la artifacts/contracts/
```

### Step 4: Deploy Smart Contract

```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network polygonAmoy

# Output:
# Deploying DocumentRegistry...
# DocumentRegistry deployed to: 0x...
```

### Step 5: Verify Deployment

```bash
# Run verification script
node scripts/verify-build.js

# Expected output:
# ✅ Contract deployed successfully
# ✅ Contract verified on blockchain
# ✅ All functions accessible
```

### Step 6: Update Deployment Addresses

```bash
# Update docs/DEPLOYMENT_ADDRESSES.md
cat > docs/DEPLOYMENT_ADDRESSES.md << EOF
# Deployment Addresses

## Smart Contract Addresses

\`\`\`env
CONTRACT_ADDRESS=0x...
DEPLOYMENT_BLOCK=12345
DEPLOYMENT_DATE=2026-05-19
NETWORK=Polygon Amoy
CHAIN_ID=80002
\`\`\`

## Deployment Info

- **Contract**: DocumentRegistry
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **Deployed**: 2026-05-19
- **Status**: ✅ Active

## Verification

- [Polygonscan](https://amoy.polygonscan.com/address/0x...)
EOF
```

### Step 7: Start Blockchain Service

```bash
# Development
npm run dev

# Production
npm start

# Or using PM2
pm2 start server.js --name "ccs-blockchain"
pm2 save
pm2 startup
```

### Step 8: Verify Service

```bash
# Check health endpoint
curl http://localhost:4000/api/blockchain/health

# Expected response:
# {
#   "status": "ok",
#   "network": "Polygon Amoy",
#   "chainId": 80002,
#   "contractAddress": "0x...",
#   "timestamp": "2026-05-19T10:30:00Z"
# }
```

## 🔄 Integration Deployment

### Update BE_CCS

```bash
# Edit BE_CCS/.env
BLOCKCHAIN_SERVICE_URL=http://localhost:4000

# Restart Laravel
php artisan config:cache
php artisan route:cache
```

### Update FE_CCS

```bash
# Edit FE_CCS/.env.production
VITE_BLOCKCHAIN_SERVICE_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=0x...
VITE_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Build frontend
npm run build
```

## 🔒 Security Hardening

### 1. Private Key Management

```bash
# Use environment variables (NOT in code)
export PRIVATE_KEY="0x..."

# Or use .env file (add to .gitignore)
echo "PRIVATE_KEY=0x..." >> .env
echo ".env" >> .gitignore
```

### 2. API Security

```javascript
// server.js - Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### 3. Input Validation

```javascript
// Validate all inputs
const { body, validationResult } = require('express-validator');

app.post('/api/blockchain/store-document', [
  body('document_type').isString().trim(),
  body('document_hash').isHexadecimal(),
  body('metadata').isJSON()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

## 📊 Monitoring & Logging

### Setup Logging

```javascript
// server.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, `blockchain-${new Date().toISOString().split('T')[0]}.log`);

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}
```

### Monitor Service

```bash
# Check service status
pm2 status

# View logs
pm2 logs ccs-blockchain

# Monitor in real-time
pm2 monit
```

### Health Checks

```bash
# Create health check script
cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

HEALTH_URL="http://localhost:4000/api/blockchain/health"
RESPONSE=$(curl -s $HEALTH_URL)

if echo $RESPONSE | grep -q "ok"; then
  echo "✅ Blockchain service is healthy"
  exit 0
else
  echo "❌ Blockchain service is down"
  exit 1
fi
EOF

chmod +x scripts/health-check.sh

# Run periodically with cron
# */5 * * * * /path/to/BC_CCS/scripts/health-check.sh
```

## 🔄 Backup & Recovery

### Backup Strategy

```bash
# Backup smart contract artifacts
tar -czf backup/artifacts-$(date +%Y%m%d).tar.gz artifacts/

# Backup configuration
cp .env backup/.env.backup-$(date +%Y%m%d)

# Backup deployment info
cp docs/DEPLOYMENT_ADDRESSES.md backup/DEPLOYMENT_ADDRESSES-$(date +%Y%m%d).md
```

### Recovery Process

```bash
# Restore from backup
tar -xzf backup/artifacts-20260519.tar.gz

# Restore configuration
cp backup/.env.backup-20260519 .env

# Redeploy if needed
npx hardhat run scripts/deploy.js --network polygonAmoy
```

## 🚨 Troubleshooting

### Issue: Service won't start

```bash
# Check port availability
lsof -i :4000

# Check logs
pm2 logs ccs-blockchain

# Restart service
pm2 restart ccs-blockchain
```

### Issue: Contract deployment failed

```bash
# Check gas price
npx hardhat run scripts/check-gas.js --network polygonAmoy

# Check balance
npx hardhat run scripts/check-balance.js --network polygonAmoy

# Retry deployment
npx hardhat run scripts/deploy.js --network polygonAmoy --gas 5000000
```

### Issue: Network connection error

```bash
# Test RPC connection
curl https://rpc-amoy.polygon.technology

# Check network status
npx hardhat network-info --network polygonAmoy

# Verify environment
echo $POLYGON_AMOY_URL
```

## 📈 Performance Optimization

### Caching

```javascript
// Cache contract ABI
const contractABI = require('./artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json').abi;
const contractCache = new Map();

app.get('/api/blockchain/abi', (req, res) => {
  res.json(contractABI);
});
```

### Connection Pooling

```javascript
// Reuse provider connection
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_URL);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  provider
);
```

### Batch Operations

```javascript
// Batch multiple requests
app.post('/api/blockchain/batch', async (req, res) => {
  const { operations } = req.body;
  const results = await Promise.all(
    operations.map(op => processOperation(op))
  );
  res.json(results);
});
```

## 📚 Post-Deployment

### Verification

- [ ] Service running on port 4000
- [ ] Health endpoint responding
- [ ] Contract deployed and verified
- [ ] BE_CCS integration working
- [ ] FE_CCS integration working
- [ ] Logging configured
- [ ] Monitoring active
- [ ] Backup completed

### Documentation

- [ ] Update DEPLOYMENT_ADDRESSES.md
- [ ] Document any custom configurations
- [ ] Create runbook for operations
- [ ] Update team documentation

### Monitoring

- [ ] Setup alerts for service down
- [ ] Setup alerts for high gas prices
- [ ] Setup alerts for failed transactions
- [ ] Monitor transaction success rate

## 🔗 Related Documentation

- [SETUP.md](./SETUP.md) - Setup guide
- [README.md](./README.md) - Overview
- [DEPLOYMENT_ADDRESSES.md](./DEPLOYMENT_ADDRESSES.md) - Deployment addresses

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
