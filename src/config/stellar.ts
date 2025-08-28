// Stellar Configuration Placeholders
export const STELLAR_CONFIG = {
  // Network configuration - will be set via environment variable
  NETWORK: process.env.STELLAR_NETWORK || 'testnet', // 'testnet' | 'mainnet'
  
  // Horizon server URLs
  HORIZON_URL: {
    testnet: 'https://horizon-testnet.stellar.org',
    mainnet: 'https://horizon.stellar.org'
  },
  
  // Asset configurations
  NATIVE_ASSET: 'XLM',
  
  // Default asset for iLede wallet
  ILEDE_ASSET: {
    code: 'iLede',
    issuer: 'PLACEHOLDER_ISSUER_ADDRESS', // To be configured
  },
  
  // Transaction configurations
  TRANSACTION: {
    TIMEOUT: 180, // seconds
    BASE_FEE: 100, // stroops
  },
  
  // Wallet configurations
  WALLET: {
    STARTING_BALANCE: '2.5', // Minimum balance to create account
  }
} as const;

// Anchor Service Configuration Placeholders
export const ANCHOR_CONFIG = {
  // Base URL for anchor services - will be set via environment variable  
  BASE_URL: process.env.ANCHOR_BASE_URL || 'https://anchor.example.com',
  
  // Service endpoints
  ENDPOINTS: {
    INFO: '/info',
    DEPOSIT: '/sep24/transactions/deposit/interactive',
    WITHDRAW: '/sep24/transactions/withdraw/interactive',
    TRANSACTION: '/sep24/transaction',
    TRANSACTIONS: '/sep24/transactions',
  },
  
  // Supported assets for anchor operations
  SUPPORTED_ASSETS: [
    {
      code: 'USD',
      issuer: 'PLACEHOLDER_USD_ISSUER', // To be configured
    },
    {
      code: 'EUR', 
      issuer: 'PLACEHOLDER_EUR_ISSUER', // To be configured
    }
  ],
  
  // KYC requirements
  KYC: {
    REQUIRED_FIELDS: ['email', 'phone', 'first_name', 'last_name'],
    OPTIONAL_FIELDS: ['address', 'date_of_birth'],
  }
} as const;

// Environment-specific configurations
export const getNetworkConfig = () => {
  const network = STELLAR_CONFIG.NETWORK;
  return {
    networkPassphrase: network === 'mainnet' 
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015',
    horizonUrl: STELLAR_CONFIG.HORIZON_URL[network as keyof typeof STELLAR_CONFIG.HORIZON_URL],
  };
};