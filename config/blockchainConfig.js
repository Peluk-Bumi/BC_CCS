// Backend Blockchain Configuration
// Centralized blockchain configuration with validation and security

import dotenv from 'dotenv';
import { validateContractAddress, validateRpcUrl, validatePrivateKey } from '../utils/validation.js';

dotenv.config();

class BackendBlockchainConfig {
  constructor() {
    this.validateEnvironment();
    this.config = this.loadConfig();
  }

  validateEnvironment() {
    const required = [
      'BLOCKCHAIN_RPC_URL',
      'BLOCKCHAIN_CONTRACT_ADDRESS',
      'PRIVATE_KEY'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `❌ Missing required backend environment variables: ${missing.join(', ')}\n` +
        `Please set these environment variables in your .env file.`
      );
    }

    // Security validation
    this.validateSecurity();
  }

  validateSecurity() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    // Check for private key format
    const privateKey = process.env.PRIVATE_KEY;
    if (!validatePrivateKey(privateKey)) {
      throw new Error('Invalid private key format. Private key must be 64 hex characters (with or without 0x prefix).');
    }

    // Warn about development in production
    if (nodeEnv === 'production' && privateKey.includes('test') || privateKey.includes('dev')) {
      console.warn('⚠️ WARNING: Using development private key in production environment');
    }
  }

  loadConfig() {
    return {
      // Core blockchain settings
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || process.env.RPC_URL,
      chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '11155111'),
      contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS,
      explorerUrl: process.env.BLOCKCHAIN_EXPLORER_URL || 'https://sepolia.etherscan.io',
      networkLabel: process.env.BLOCKCHAIN_NETWORK_LABEL || 'Sepolia Testnet',
      
      // RPC configuration
      fallbackRpcUrls: this.getFallbackRpcUrls(),
      
      // Gas configuration
      gasLimit: parseInt(process.env.BLOCKCHAIN_GAS_LIMIT || '300000'),
      maxGasPrice: BigInt(process.env.BLOCKCHAIN_MAX_GAS_PRICE || '50000000000'),
      
      // Server configuration
      port: parseInt(process.env.PORT || '4000'),
      nodeEnv: process.env.NODE_ENV || 'development',
      logLevel: process.env.LOG_LEVEL || 'info',
      
      // Security
      privateKey: process.env.PRIVATE_KEY
    };
  }

  getFallbackRpcUrls() {
    const fallbacks = process.env.BLOCKCHAIN_FALLBACK_RPC_URLS;
    if (!fallbacks) return [];
    
    const urls = fallbacks.split(',').map(url => url.trim());
    
    // Validate each fallback RPC URL
    const invalidUrls = urls.filter(url => !validateRpcUrl(url));
    if (invalidUrls.length > 0) {
      throw new Error(
        `Invalid fallback RPC URLs: ${invalidUrls.join(', ')}\n` +
        `All RPC URLs must be valid HTTP/HTTPS endpoints.`
      );
    }
    
    return urls;
  }

  // Check for legacy variables and show warnings
  checkLegacyVariables() {
    const legacyMappings = {
      'RPC_URL': 'BLOCKCHAIN_RPC_URL',
      'CONTRACT_ADDRESS': 'BLOCKCHAIN_CONTRACT_ADDRESS'
    };
    
    const usedLegacy = Object.keys(legacyMappings).filter(key => 
      process.env[key] && !process.env[legacyMappings[key]]
    );
    
    if (usedLegacy.length > 0) {
      console.group('🚨 DEPRECATION WARNING - Backend Environment Variables');
      console.warn('The following environment variables are deprecated and will be removed in v2.0:');
      usedLegacy.forEach(key => {
        console.warn(`  ❌ ${key} → ✅ ${legacyMappings[key]}`);
      });
      console.warn('Please update your .env file to use the new BLOCKCHAIN_* naming.');
      console.groupEnd();
    }
  }

  // Get sanitized config for logging (removes sensitive data)
  getSanitizedConfig() {
    return {
      ...this.config,
      rpcUrl: this.config.rpcUrl ? this.config.rpcUrl.replace(/\/\/.*@/, '//***@') : this.config.rpcUrl,
      fallbackRpcUrls: this.config.fallbackRpcUrls?.map(url => 
        url.replace(/\/\/.*@/, '//***@')
      ),
      privateKey: '***REDACTED***'
    };
  }
}

// Create singleton instance
export const backendConfig = new BackendBlockchainConfig();
export default backendConfig.config;
