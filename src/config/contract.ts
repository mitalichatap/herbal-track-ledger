// Contract configuration
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';

// Instructions for deployment:
// 1. Deploy the HerbTraceability.sol contract to your preferred network (Sepolia for testing)
// 2. Copy the deployed contract address
// 3. Set REACT_APP_CONTRACT_ADDRESS environment variable or update CONTRACT_ADDRESS above
// 4. Update the network configuration in your MetaMask to match the deployment network

export const SUPPORTED_NETWORKS = {
  SEPOLIA: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Test Network',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  },
  LOCALHOST: {
    chainId: '0x539',
    chainName: 'Localhost 8545',
    rpcUrls: ['http://localhost:8545']
  }
};

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.SEPOLIA;