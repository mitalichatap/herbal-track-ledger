import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock Web3 for demonstration - in production, would use actual Web3 library
interface Web3Type {
  eth: {
    getAccounts: () => Promise<string[]>;
    Contract: any;
  };
}

interface BlockchainContextType {
  web3: Web3Type | null;
  account: string | null;
  contract: any;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const BlockchainContext = createContext<BlockchainContextType>({
  web3: null,
  account: null,
  contract: null,
  connectWallet: async () => {},
  isConnected: false
});

export const useBlockchain = () => useContext(BlockchainContext);

// Smart Contract ABI for HerbTraceability contract
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "batchId", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "who", "type": "address"}
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "batchId", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "BatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "batchId", "type": "string"}
    ],
    "name": "BatchRecalled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "batchId", "type": "string"},
      {"indexed": true, "internalType": "uint256", "name": "index", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "eventId", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "eventType", "type": "string"},
      {"indexed": false, "internalType": "address", "name": "actor", "type": "address"}
    ],
    "name": "EventAdded",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"},
      {"internalType": "string", "name": "eventId", "type": "string"},
      {"internalType": "string", "name": "eventType", "type": "string"},
      {"internalType": "string", "name": "metaCID", "type": "string"},
      {"internalType": "int256", "name": "lat", "type": "int256"},
      {"internalType": "int256", "name": "lon", "type": "int256"}
    ],
    "name": "addEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"},
      {"internalType": "string", "name": "eventId", "type": "string"},
      {"internalType": "string", "name": "testType", "type": "string"},
      {"internalType": "uint256", "name": "numericValue", "type": "uint256"},
      {"internalType": "string", "name": "metaCID", "type": "string"},
      {"internalType": "int256", "name": "lat", "type": "int256"},
      {"internalType": "int256", "name": "lon", "type": "int256"}
    ],
    "name": "addQualityTest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "authorized",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "name": "batchEventCount",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"},
      {"internalType": "string", "name": "species", "type": "string"},
      {"internalType": "string", "name": "eventId", "type": "string"},
      {"internalType": "string", "name": "metaCID", "type": "string"},
      {"internalType": "int256", "name": "lat", "type": "int256"},
      {"internalType": "int256", "name": "lon", "type": "int256"}
    ],
    "name": "createBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "name": "geofences",
    "outputs": [
      {"internalType": "int256", "name": "minLat", "type": "int256"},
      {"internalType": "int256", "name": "maxLat", "type": "int256"},
      {"internalType": "int256", "name": "minLon", "type": "int256"},
      {"internalType": "int256", "name": "maxLon", "type": "int256"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"}
    ],
    "name": "getBatchSummary",
    "outputs": [
      {"internalType": "string", "name": "species", "type": "string"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "bytes32", "name": "rootHash", "type": "bytes32"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "bool", "name": "recalled", "type": "bool"},
      {"internalType": "uint256", "name": "eventsCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "getEvent",
    "outputs": [
      {"internalType": "string", "name": "eventId", "type": "string"},
      {"internalType": "string", "name": "eventType", "type": "string"},
      {"internalType": "address", "name": "actor", "type": "address"},
      {"internalType": "string", "name": "metaCID", "type": "string"},
      {"internalType": "int256", "name": "lat", "type": "int256"},
      {"internalType": "int256", "name": "lon", "type": "int256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "qualityPass", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"},
      {"internalType": "address", "name": "who", "type": "address"}
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "name": "moistureThreshold",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "batchId", "type": "string"}
    ],
    "name": "recallBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "species", "type": "string"},
      {"internalType": "int256", "name": "minLat", "type": "int256"},
      {"internalType": "int256", "name": "maxLat", "type": "int256"},
      {"internalType": "int256", "name": "minLon", "type": "int256"},
      {"internalType": "int256", "name": "maxLon", "type": "int256"}
    ],
    "name": "setGeoFence",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "species", "type": "string"},
      {"internalType": "uint256", "name": "scaledValue", "type": "uint256"}
    ],
    "name": "setMoistureThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3Type | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Real Web3 connection
        const web3Instance = new (window as any).Web3((window as any).ethereum);
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);

        // Initialize contract (replace with actual deployed contract address)
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
        );
        setContract(contractInstance);
      } else {
        // Fallback to mock for development
        const mockWeb3 = {
          eth: {
            getAccounts: async () => ['0x1234567890123456789012345678901234567890'],
            Contract: class MockContract {
              constructor(abi: any, address: string) {}
              methods = {
                createBatch: (...args: any[]) => ({
                  send: async (options: any) => {
                    console.log('Creating batch:', args);
                    return { transactionHash: '0xmockhash' };
                  }
                }),
                addEvent: (...args: any[]) => ({
                  send: async (options: any) => {
                    console.log('Adding event:', args);
                    return { transactionHash: '0xmockhash' };
                  }
                }),
                addQualityTest: (...args: any[]) => ({
                  send: async (options: any) => {
                    console.log('Adding quality test:', args);
                    return { transactionHash: '0xmockhash' };
                  }
                }),
                getBatchSummary: (batchId: string) => ({
                  call: async () => {
                    console.log('Getting batch summary for:', batchId);
                    return ['Ashwagandha', '0x1234567890123456789012345678901234567890', '0xhash', 1648771200, false, 3];
                  }
                }),
                getEvent: (batchId: string, index: number) => ({
                  call: async () => {
                    console.log('Getting event:', batchId, index);
                    return ['EVT-001', 'Collection', '0x1234567890123456789012345678901234567890', 'meta-cid', 26912400, 75787300, 1648771200, true];
                  }
                })
              }
            }
          }
        };

        const accounts = await mockWeb3.eth.getAccounts();
        setWeb3(mockWeb3);
        setAccount(accounts[0]);
        setIsConnected(true);

        const contractInstance = new mockWeb3.eth.Contract(
          contractABI,
          '0x1234567890123456789012345678901234567890'
        );
        setContract(contractInstance);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <BlockchainContext.Provider value={{
      web3,
      account,
      contract,
      connectWallet,
      isConnected
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainProvider;