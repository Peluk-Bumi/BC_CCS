import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const AMOY_RPC_URL =
  process.env.POLYGON_AMOY_URL ||
  process.env.VITE_POLYGON_AMOY_RPC_URL ||
  process.env.VITE_POLYGON_RPC_URL ||
  "https://rpc-amoy.polygon.technology";
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_URL ||
  process.env.VITE_POLYGON_MAINNET_RPC_URL ||
  "https://polygon-rpc.com";

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  solidity: "0.8.19",
  networks: {
    polygonAmoy: {
      url: AMOY_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
