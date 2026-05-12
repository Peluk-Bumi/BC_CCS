// Backend Security Guard - Environment Validation and Security Checks
// Protects against security violations and ensures proper environment setup

class BackendSecurityGuard {
  static validateEnvironment() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    // ✅ Check for required environment variables
    const required = [
      'BLOCKCHAIN_RPC_URL',
      'BLOCKCHAIN_CONTRACT_ADDRESS',
      'PRIVATE_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
    
    // ✅ PRODUCTION: Ensure private key exists
    if (nodeEnv === 'production' && !process.env.PRIVATE_KEY) {
      throw new Error(
        'Production environment requires PRIVATE_KEY for blockchain operations.'
      );
    }
    
    // ✅ DEVELOPMENT: Warn about missing private key
    if (nodeEnv === 'development' && !process.env.PRIVATE_KEY) {
      console.warn('⚠️ Development: PRIVATE_KEY not set. Read-only mode only.');
    }
    
    // ✅ Check for potential security issues
    this.checkSecurityPatterns();
  }
  
  static checkSecurityPatterns() {
    // Check for development patterns in production
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    if (nodeEnv === 'production') {
      const devOnlyPatterns = [
        /test/i,
        /dev/i,
        /localhost/i,
        /127\.0\.0\.1/i,
        /0\.0\.0\.0/i
      ];
      
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || process.env.RPC_URL;
      const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
      
      if (devOnlyPatterns.some(pattern => pattern.test(rpcUrl))) {
        console.error('🚨 PRODUCTION SECURITY WARNING: Development RPC URL detected in production');
        throw new Error('Development RPC URL cannot be used in production');
      }
      
      if (devOnlyPatterns.some(pattern => pattern.test(contractAddress))) {
        console.error('🚨 PRODUCTION SECURITY WARNING: Development contract address detected in production');
        throw new Error('Development contract address cannot be used in production');
      }
    }
    
    // Check for exposed sensitive patterns in logs
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i
    ];
    
    Object.keys(process.env).forEach(key => {
      const value = process.env[key];
      if (sensitivePatterns.some(pattern => pattern.test(key)) && value) {
        // Don't log the actual value, just warn about the key
        if (key !== 'PRIVATE_KEY') { // Private key is expected
          console.warn(`⚠️ Sensitive environment variable detected: ${key}`);
        }
      }
    });
  }
  
  static validateBlockchainConfig(config) {
    // Validate RPC URL
    if (!config.rpcUrl || !this.isValidRpcUrl(config.rpcUrl)) {
      throw new Error(
        `Invalid RPC URL: ${config.rpcUrl}\n` +
        'RPC URL must be a valid HTTP/HTTPS endpoint'
      );
    }
    
    // Validate contract address
    if (!config.contractAddress || !this.isValidContractAddress(config.contractAddress)) {
      throw new Error(
        `Invalid contract address: ${config.contractAddress}\n` +
        'Contract address must be a valid Ethereum address (0x + 40 hex characters)'
      );
    }
    
    // Validate chain ID
    if (!config.chainId || config.chainId <= 0) {
      throw new Error(
        `Invalid chain ID: ${config.chainId}\n` +
        'Chain ID must be a positive integer'
      );
    }
    
    // Validate private key
    if (!config.privateKey || !this.isValidPrivateKey(config.privateKey)) {
      throw new Error(
        'Invalid private key format. Private key must be 64 hex characters (with or without 0x prefix).'
      );
    }
    
    // Validate fallback RPC URLs
    if (config.fallbackRpcUrls && config.fallbackRpcUrls.length > 0) {
      const invalidFallbacks = config.fallbackRpcUrls.filter(url => !this.isValidRpcUrl(url));
      if (invalidFallbacks.length > 0) {
        throw new Error(
          `Invalid fallback RPC URLs: ${invalidFallbacks.join(', ')}\n` +
          'All fallback RPC URLs must be valid HTTP/HTTPS endpoints'
        );
      }
    }
    
    // Validate port
    if (!this.isValidPort(config.port)) {
      throw new Error(
        `Invalid port: ${config.port}\n` +
        'Port must be between 1 and 65535'
      );
    }
    
    // Validate log level
    if (!this.isValidLogLevel(config.logLevel)) {
      throw new Error(
        `Invalid log level: ${config.logLevel}\n` +
        'Valid log levels: error, warn, info, debug'
      );
    }
  }
  
  static isValidRpcUrl(url) {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
  
  static isValidContractAddress(address) {
    if (!address) return false;
    if (address === '0x0000000000000000000000000000000000000000') return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  static isValidPrivateKey(key) {
    if (!key) return false;
    return /^0x[a-fA-F0-9]{64}$/.test(key) || /^[a-fA-F0-9]{64}$/.test(key);
  }
  
  static isValidPort(port) {
    const p = typeof port === 'string' ? parseInt(port) : port;
    return !isNaN(p) && p > 0 && p <= 65535;
  }
  
  static isValidLogLevel(level) {
    const validLevels = ['error', 'warn', 'info', 'debug'];
    return validLevels.includes(level);
  }
  
  static sanitizeConfig(config) {
    // Return sanitized config for logging (remove sensitive data)
    return {
      ...config,
      rpcUrl: config.rpcUrl ? config.rpcUrl.replace(/\/\/.*@/, '//***@') : config.rpcUrl,
      fallbackRpcUrls: config.fallbackRpcUrls?.map(url => 
        url.replace(/\/\/.*@/, '//***@')
      ),
      privateKey: '***REDACTED***'
    };
  }
}

export default BackendSecurityGuard;
