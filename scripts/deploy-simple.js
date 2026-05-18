import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getExplorerAddressUrl(chainId, address) {
  if (chainId === 80002n) {
    return `https://amoy.polygonscan.com/address/${address}`;
  }

  if (chainId === 137n) {
    return `https://polygonscan.com/address/${address}`;
  }

  return `https://polygonscan.com/address/${address}`;
}

async function main() {
  console.log("🚀 Starting deployment...\n");

  const {
    PRIVATE_KEY,
    POLYGON_AMOY_URL,
    POLYGON_MAINNET_URL,
    VITE_POLYGON_AMOY_RPC_URL,
    VITE_POLYGON_RPC_URL,
    VITE_POLYGON_MAINNET_RPC_URL,
    TARGET_CHAIN
  } = process.env;

  const normalizedTarget = (TARGET_CHAIN || 'amoy').toLowerCase();
  const rpcUrl = normalizedTarget === 'polygon'
    ? (POLYGON_MAINNET_URL || VITE_POLYGON_MAINNET_RPC_URL)
    : (POLYGON_AMOY_URL || VITE_POLYGON_AMOY_RPC_URL || VITE_POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology');

  if (!PRIVATE_KEY || !rpcUrl) {
    console.error("❌ Missing PRIVATE_KEY or Polygon RPC URL in .env");
    process.exit(1);
  }

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const network = await provider.getNetwork();
  console.log("🌐 Connected network:", network.name, `(${network.chainId})`);
  
  console.log("📝 Deploying contracts with account:", wallet.address);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Read contract ABI and bytecode
  const contractPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'DocumentRegistry.sol', 'DocumentRegistry.json');
  const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
  
  const contractFactory = new ethers.ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  
  console.log("⏳ Deploying DocumentRegistry contract...");
  const contract = await contractFactory.deploy();
  
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  
  console.log("\n✅ DocumentRegistry deployed successfully!");
  console.log("📍 Contract address:", address);
  console.log("\n🔗 View on explorer:");
  console.log(`   ${getExplorerAddressUrl(network.chainId, address)}\n`);

  // Test contract
  console.log("🧪 Testing contract...");
  const count = await contract.getDocumentCount();
  console.log("✅ Initial document count:", count.toString());

  console.log("\n📝 Update your .env files with this address:");
  console.log(`   VITE_CONTRACT_ADDRESS=${address}\n`);

  // Save to file for easy reference
  const outputPath = path.join(__dirname, '..', 'DEPLOY_ADDRESS.txt');
  fs.writeFileSync(outputPath, `CONTRACT_ADDRESS=${address}\n`);
  console.log(`💾 Address saved to: ${outputPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  });
