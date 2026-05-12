// Backend Validation Utilities
// Used for input validation across the blockchain system

export const validateContractAddress = (address) => {
  if (!address) return false;
  if (address === '0x0000000000000000000000000000000000000000') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateChainId = (chainId) => {
  if (!chainId) return false;
  const id = typeof chainId === 'bigint' ? chainId : BigInt(chainId);
  return id > 0;
};

export const validateRpcUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validatePrivateKey = (key) => {
  if (!key) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(key) || /^[a-fA-F0-9]{64}$/.test(key);
};

export const validateGasLimit = (gasLimit) => {
  const limit = typeof gasLimit === 'string' ? parseInt(gasLimit) : gasLimit;
  return !isNaN(limit) && limit > 0 && limit <= 10000000; // Max 10M gas
};

export const validateGasPrice = (gasPrice) => {
  try {
    const price = BigInt(gasPrice);
    return price > 0 && price <= BigInt('1000000000000'); // Max 1000 gwei
  } catch {
    return false;
  }
};

export const validateDocumentHash = (hash) => {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

export const validateDocumentType = (type) => {
  if (!type) return false;
  return typeof type === 'string' && type.length > 0 && type.length <= 100;
};

export const validateMetadata = (metadata) => {
  if (!metadata) return true; // Optional
  try {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

export const validateTransactionHash = (hash) => {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

export const validateBlockNumber = (blockNumber) => {
  const block = typeof blockNumber === 'string' ? parseInt(blockNumber) : blockNumber;
  return !isNaN(block) && block >= 0;
};

export const validateTimestamp = (timestamp) => {
  try {
    const ts = BigInt(timestamp);
    const now = BigInt(Math.floor(Date.now() / 1000));
    const yearAgo = now - BigInt(365 * 24 * 60 * 60);
    const yearFromNow = now + BigInt(365 * 24 * 60 * 60);
    return ts >= yearAgo && ts <= yearFromNow;
  } catch {
    return false;
  }
};

export const validatePort = (port) => {
  const p = typeof port === 'string' ? parseInt(port) : port;
  return !isNaN(p) && p > 0 && p <= 65535;
};

export const validateLogLevel = (level) => {
  const validLevels = ['error', 'warn', 'info', 'debug'];
  return validLevels.includes(level);
};
