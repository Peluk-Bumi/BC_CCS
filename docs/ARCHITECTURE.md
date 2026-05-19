# 🏗️ BC_CCS Architecture

**Blockchain Service Architecture for Peluk Bumi Environmental Monitoring System**

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    BE_CCS (Backend)                              │
│              (Laravel Application)                               │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP REST API
                     │ (port 4000)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BC_CCS (Blockchain Service)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Express.js Server                                        │  │
│  │ - API Routes                                             │  │
│  │ - Request Handlers                                       │  │
│  │ - Error Management                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Blockchain Integration Layer                             │  │
│  │ - Web3.js / Ethers.js                                    │  │
│  │ - Smart Contract Interaction                             │  │
│  │ - Transaction Management                                 │  │
│  │ - Gas Optimization                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Security Layer                                           │  │
│  │ - Private Key Management                                 │  │
│  │ - Transaction Signing                                    │  │
│  │ - Access Control                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Polygon Amoy Network (EVM)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Smart Contract: DocumentRegistry                         │  │
│  │ - Store document hashes                                  │  │
│  │ - Verify authenticity                                    │  │
│  │ - Track ownership                                        │  │
│  │ - Emit events                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. Data Broadcasting Flow
```
BE_CCS (Create/Update Data)
    ↓
Queue Job: BroadcastPerencanaanToBlockchain
    ↓
HTTP POST to BC_CCS /api/broadcast
    ↓
BC_CCS Receives Request
    ↓
Validate Data
    ↓
Prepare Transaction
    ↓
Sign Transaction (Private Key)
    ↓
Send to Polygon Amoy
    ↓
Smart Contract Execution
    ↓
Transaction Confirmation
    ↓
Return Transaction Hash
    ↓
BE_CCS Updates Status
```

### 2. Verification Flow
```
BE_CCS Request Verification
    ↓
HTTP GET to BC_CCS /api/verify/{hash}
    ↓
BC_CCS Queries Blockchain
    ↓
Retrieve Transaction Details
    ↓
Verify Smart Contract State
    ↓
Return Verification Result
    ↓
BE_CCS Stores Verification
```

### 3. Error Handling Flow
```
Transaction Fails
    ↓
BC_CCS Captures Error
    ↓
Log Error Details
    ↓
Return Error Response
    ↓
BE_CCS Receives Error
    ↓
Queue Retry Job
    ↓
Retry with Exponential Backoff
```

---

## 📦 Core Components

### 1. Express.js Server
**File:** `server.js`

**Responsibilities:**
- HTTP server management
- Route handling
- Request/response processing
- Error handling
- CORS configuration

**Port:** 4000

---

### 2. Smart Contract (DocumentRegistry)
**File:** `contracts/DocumentRegistry.sol`

**Solidity Version:** 0.8.19

**Functions:**
```solidity
// Store document hash
function registerDocument(
    bytes32 documentHash,
    string memory documentType,
    string memory metadata
) public returns (uint256)

// Verify document
function verifyDocument(bytes32 documentHash) public view returns (bool)

// Get document details
function getDocument(bytes32 documentHash) public view returns (Document)

// Track ownership
function getDocumentOwner(bytes32 documentHash) public view returns (address)
```

**Events:**
```solidity
event DocumentRegistered(
    bytes32 indexed documentHash,
    address indexed owner,
    uint256 timestamp
)

event DocumentVerified(
    bytes32 indexed documentHash,
    address indexed verifier,
    uint256 timestamp
)
```

---

### 3. Blockchain Configuration
**File:** `config/blockchainConfig.js`

**Configuration:**
```javascript
{
  rpcUrl: "https://polygon-rpc.com",
  chainId: 80002,
  contractAddress: "0x...",
  gasLimit: 300000,
  gasPrice: "auto"
}
```

---

### 4. Security Guard
**File:** `guards/securityGuard.js`

**Responsibilities:**
- Private key management
- Transaction signing
- Access control
- Rate limiting
- Request validation

---

### 5. Validation Utilities
**File:** `utils/validation.js`

**Functions:**
- Validate document hash format
- Validate metadata structure
- Validate transaction parameters
- Validate blockchain responses

---

## 🔌 API Endpoints

### 1. Broadcast Endpoint
```
POST /api/broadcast

Request Body:
{
  "documentHash": "0x...",
  "documentType": "perencanaan",
  "metadata": {
    "projectId": 123,
    "title": "Project Title",
    "location": "Location",
    "timestamp": 1234567890
  }
}

Response:
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "timestamp": 1234567890
}
```

### 2. Verify Endpoint
```
GET /api/verify/:documentHash

Response:
{
  "verified": true,
  "documentHash": "0x...",
  "owner": "0x...",
  "timestamp": 1234567890,
  "blockNumber": 12345
}
```

### 3. Status Endpoint
```
GET /api/status/:transactionHash

Response:
{
  "status": "confirmed",
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "confirmations": 10,
  "gasUsed": 150000
}
```

### 4. Health Endpoint
```
GET /api/health

Response:
{
  "status": "ok",
  "blockchain": "connected",
  "contractAddress": "0x...",
  "chainId": 80002,
  "timestamp": 1234567890
}
```

---

## 🗄️ Data Structures

### Document Registry Entry
```javascript
{
  documentHash: bytes32,
  owner: address,
  documentType: string,
  metadata: object,
  timestamp: uint256,
  verified: boolean,
  verificationCount: uint256
}
```

### Transaction Log
```javascript
{
  transactionHash: string,
  documentHash: string,
  status: "pending" | "confirmed" | "failed",
  blockNumber: number,
  gasUsed: number,
  timestamp: number,
  errorMessage: string (optional)
}
```

---

## 🔐 Security Architecture

### Private Key Management
- Stored in environment variables
- Never logged or exposed
- Used only for transaction signing
- Rotated regularly

### Transaction Signing
- All transactions signed with private key
- Signature verification on blockchain
- Nonce management for transaction ordering
- Gas price optimization

### Access Control
- API key validation
- Request rate limiting
- IP whitelisting (optional)
- CORS configuration

### Error Handling
- Graceful error responses
- No sensitive data in error messages
- Detailed logging for debugging
- Retry mechanisms

---

## 🔄 Integration with BE_CCS

### Queue Job: BroadcastPerencanaanToBlockchain
**File:** `app/Jobs/BroadcastPerencanaanToBlockchain.php`

**Process:**
1. Receive perencanaan data
2. Generate document hash
3. Call BC_CCS broadcast endpoint
4. Store transaction hash
5. Update status in database
6. Handle errors with retry

### Retry Mechanism
**File:** `app/Jobs/RetryBlockchainBroadcast.php`

**Strategy:**
- Exponential backoff
- Maximum 3 retries
- Configurable delay
- Error logging

---

## 📊 Deployment Architecture

### Development Environment
```
Local Machine
├── BC_CCS Server (Node.js, port 4000)
├── Hardhat (Local blockchain)
├── Smart Contract (Deployed locally)
└── Environment Variables (.env)
```

### Production Environment
```
Production Server
├── BC_CCS Server (Node.js, port 4000)
├── Polygon Amoy RPC Connection
├── Smart Contract (Deployed on Polygon Amoy)
├── Environment Variables (Secure)
└── Supervisor (Process Management)
```

---

## 🚀 Smart Contract Deployment

### Deployment Script
**File:** `scripts/deploy.js`

**Process:**
1. Load private key from environment
2. Connect to Polygon Amoy RPC
3. Deploy DocumentRegistry contract
4. Verify contract on block explorer
5. Save contract address
6. Update configuration

### Verification
**File:** `scripts/verify-build.js`

**Checks:**
- Contract deployment status
- Contract functionality
- Event emission
- State management

---

## 📈 Performance Considerations

### Gas Optimization
- Efficient smart contract code
- Batch operations where possible
- Optimized data structures
- Minimal storage operations

### Transaction Management
- Nonce tracking
- Gas price estimation
- Transaction pooling
- Confirmation waiting

### Scalability
- Horizontal scaling with load balancer
- Multiple BC_CCS instances
- Caching layer for verification
- Batch processing for broadcasts

---

## 🔍 Monitoring & Observability

### Logging
- Transaction logs: `logs/transactions.log`
- Error logs: `logs/errors.log`
- Access logs: `logs/access.log`

### Metrics
- Transaction success rate
- Average gas usage
- Response time
- Error rate

### Health Checks
- Blockchain connectivity
- Smart contract status
- RPC endpoint availability
- Transaction confirmation time

---

## 🛠️ Development Tools

### Hardhat
- Local blockchain testing
- Smart contract compilation
- Contract deployment
- Testing framework

### Web3.js / Ethers.js
- Blockchain interaction
- Transaction signing
- Contract interaction
- Event listening

### Environment Configuration
- `.env` - Environment variables
- `.env.example` - Template
- `config/blockchainConfig.js` - Configuration

---

## 📚 Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SETUP.md](./SETUP.md) - Development setup
- [DEPLOYMENT_ADDRESSES.md](./DEPLOYMENT_ADDRESSES.md) - Contract addresses
- [README.md](./README.md) - Overview
- [SEVEN_LAYER_ALIGNMENT.md](./SEVEN_LAYER_ALIGNMENT.md) - 7-layer alignment

---

## 🔗 External Resources

- [Polygon Documentation](https://polygon.technology/developers)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0

