import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
    BLOCKCHAIN_RPC_URL,
    BLOCKCHAIN_CHAIN_ID,
    BLOCKCHAIN_CONTRACT_ADDRESS,
    BLOCKCHAIN_EXPLORER_URL,
    BLOCKCHAIN_NETWORK_LABEL,
    BLOCKCHAIN_FALLBACK_RPC_URLS,
    BLOCKCHAIN_GAS_LIMIT,
    BLOCKCHAIN_MAX_GAS_PRICE,
    PRIVATE_KEY,
    PORT = 4000
} = process.env;

// Support legacy variables during migration
const RPC_URL = BLOCKCHAIN_RPC_URL || process.env.RPC_URL;
const CONTRACT_ADDRESS = BLOCKCHAIN_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error('❌ Missing required blockchain environment variables');
    console.error('Required: BLOCKCHAIN_RPC_URL, PRIVATE_KEY, BLOCKCHAIN_CONTRACT_ADDRESS');
    console.error('Or legacy: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS');
    process.exit(1);
}

// Log deprecation warnings for legacy variables
if (process.env.RPC_URL && !BLOCKCHAIN_RPC_URL) {
    console.warn('⚠️ DEPRECATED: RPC_URL is deprecated. Use BLOCKCHAIN_RPC_URL instead.');
}
if (process.env.CONTRACT_ADDRESS && !BLOCKCHAIN_CONTRACT_ADDRESS) {
    console.warn('⚠️ DEPRECATED: CONTRACT_ADDRESS is deprecated. Use BLOCKCHAIN_CONTRACT_ADDRESS instead.');
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Log blockchain configuration
console.log('🔗 Blockchain Configuration:', {
    rpcUrl: RPC_URL.substring(0, 50) + '...',
    chainId: BLOCKCHAIN_CHAIN_ID || '80002',
    contractAddress: CONTRACT_ADDRESS,
    explorerUrl: BLOCKCHAIN_EXPLORER_URL || 'https://amoy.polygonscan.com',
    networkLabel: BLOCKCHAIN_NETWORK_LABEL || 'Polygon Amoy Testnet'
});

// ABI smart contract
const abi = JSON.parse(fs.readFileSync('./DocumentRegistry.abi.json', 'utf8'));

// Smart contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// ============================
// HEALTH CHECK
// ============================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        wallet: wallet.address,
        network: RPC_URL,
        contract: CONTRACT_ADDRESS,
    });
});

async function handleStoreActivity(req, res) {
    try {
        const {
            activityType,
            documentType,
            docHash,
            metadata,
            documentId,
        } = req.body;

        const resolvedActivityType = activityType || documentType;

        if (!resolvedActivityType || !docHash) {
            return res.status(400).json({
                success: false,
                error: "Missing: activityType, docHash",
            });
        }

        console.log("📨 Broadcasting activity transaction...");
        console.log("➡ DocHash:", docHash);

        const metadataPayload =
            typeof metadata === 'string'
                ? metadata
                : JSON.stringify(metadata || {});

        const storeMethod = typeof contract.storeActivity === 'function'
            ? contract.storeActivity.bind(contract)
            : contract.storeDocument.bind(contract);

        const tx = await storeMethod(
            resolvedActivityType,
            docHash,
            metadataPayload
        );

        console.log("🔥 TX HASH:", tx.hash);

        return res.json({
            success: true,
            message: "Transaction sent to blockchain",
            txHash: tx.hash,
            activityType: resolvedActivityType,
            documentType: resolvedActivityType,
            documentId,
            docHash,
            contractAddress: CONTRACT_ADDRESS,
            walletAddress: wallet.address,
            chainId: Number(BLOCKCHAIN_CHAIN_ID || 80002),
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error("❌ ERROR:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

// ============================
// STORE ACTIVITY (REAL CONTRACT CALL)
// ============================
app.post('/store-activity', handleStoreActivity);

// Backward compatible alias
app.post('/store-document', handleStoreActivity);

// ============================
// GET TRANSACTION DETAILS
// ============================
app.get('/transaction/:hash', async (req, res) => {
    try {
        const { hash } = req.params;

        const tx = await provider.getTransaction(hash);
        const receipt = await provider.getTransactionReceipt(hash);

        return res.json({
            success: true,
            txHash: hash,
            transaction: tx,
            receipt,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// ============================
// GET ACTIVITY FROM BLOCKCHAIN
// ============================
app.get('/document/:docId', async (req, res) => {
    try {
        const { docId } = req.params;

        console.log(`📖 Fetching activity #${docId} from blockchain...`);

        // ✅ Call smart contract function to get activity record
        const [docType, docHash, metadata, uploader, timestamp] = await contract.getDocument(docId);

        console.log(`✅ Activity found:`, {
            docId,
            docType,
            docHash,
            uploader,
            timestamp: new Date(Number(timestamp) * 1000).toISOString()
        });

        return res.json({
            success: true,
            docId: Number(docId),
            docType,
            docHash,
            metadata: metadata ? JSON.parse(metadata) : {},
            uploader,
            timestamp: Number(timestamp),
            timestampISO: new Date(Number(timestamp) * 1000).toISOString(),
            verified: true
        });

    } catch (err) {
        console.error(`❌ Error fetching activity:`, err.message);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// ============================
// GET ACTIVITY BY HASH (FROM BLOCKCHAIN) - Already implemented
// ============================
app.get('/document-by-hash/:docHash', async (req, res) => {
    try {
        const { docHash } = req.params;

        console.log(`🔍 Searching for docHash: ${docHash}`);

        // ✅ Get total document count
        const totalDocs = await contract.getDocumentCount();
        console.log(`📊 Total documents in blockchain: ${totalDocs}`);

        // ✅ Search through documents to find matching hash
        for (let i = 0; i < Number(totalDocs); i++) {
            try {
                const [docType, hash, metadata, uploader, timestamp] = await contract.getDocument(i);

                if (hash.toLowerCase() === docHash.toLowerCase()) {
                    console.log(`✅ Found document #${i} with matching hash!`);

                    return res.json({
                        success: true,
                        docId: i,
                        docType,
                        docHash: hash,
                        metadata: metadata ? JSON.parse(metadata) : {},
                        uploader,
                        timestamp: Number(timestamp),
                        timestampISO: new Date(Number(timestamp) * 1000).toISOString(),
                        verified: true
                    });
                }
            } catch (err) {
                // Continue searching
                continue;
            }
        }

        console.log(`❌ Document with hash ${docHash} not found in blockchain`);
        return res.status(404).json({
            success: false,
            error: "Document not found in blockchain",
            docHash
        });

    } catch (err) {
        console.error(`❌ Error searching for document:`, err.message);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// ============================
app.listen(PORT, () => {
    console.log(`🚀 Blockchain service running on port ${PORT}`);
});
