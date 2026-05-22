import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getExplorerAddressUrl(address) {
  return `https://polygonscan.com/address/${address}`;
}

async function main() {
  console.log('🚀 Starting Polygon mainnet deployment...\n');

  const {
    PRIVATE_KEY,
    POLYGON_MAINNET_URL,
    VITE_POLYGON_MAINNET_RPC_URL,
    CONTRACT_ADDRESS,
    BLOCKCHAIN_CONTRACT_ADDRESS,
    BLOCKCHAIN_MAINNET_RPC_URL,
  } = process.env;

  const rpcUrl = POLYGON_MAINNET_URL
    || VITE_POLYGON_MAINNET_RPC_URL
    || BLOCKCHAIN_MAINNET_RPC_URL;

  if (!PRIVATE_KEY || !rpcUrl) {
    console.error('❌ Missing PRIVATE_KEY or Polygon mainnet RPC URL in .env');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const network = await provider.getNetwork();
  console.log('🌐 Connected network:', network.name, `(${network.chainId})`);

  if (network.chainId !== 137n) {
    console.error('❌ This deploy script only allows Polygon mainnet (chainId 137).');
    process.exit(1);
  }

  console.log('📝 Deploying activity registry with account:', wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'MATIC\n');

  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'DocumentRegistry.sol', 'DocumentRegistry.json');
  const contractJSON = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const factory = new ethers.ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);

  console.log('⏳ Deploying activity registry contract on Polygon mainnet...');
  const contract = await factory.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log('\n✅ Activity registry deployed successfully!');
  console.log('📍 Contract address:', address);
  console.log('\n🔗 View on explorer:');
  console.log(`   ${getExplorerAddressUrl(address)}\n`);

  console.log('🧪 Testing contract...');
  const count = await contract.getActivityCount();
  console.log('✅ Initial activity count:', count.toString());

  console.log('\n📝 Update your env files with this address:');
  console.log(`   BLOCKCHAIN_CONTRACT_ADDRESS=${address}`);
  console.log(`   CONTRACT_ADDRESS=${address}`);
  if (CONTRACT_ADDRESS || BLOCKCHAIN_CONTRACT_ADDRESS) {
    console.log('\n⚠️ Existing contract address values were detected in .env; update them manually if needed.');
  }

  const outputPath = path.join(__dirname, '..', 'DEPLOY_ADDRESS.txt');
  fs.writeFileSync(outputPath, `CONTRACT_ADDRESS=${address}\nBLOCKCHAIN_CONTRACT_ADDRESS=${address}\n`);
  console.log(`💾 Address saved to: ${outputPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  });