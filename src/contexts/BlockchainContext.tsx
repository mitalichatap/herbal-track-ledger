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

// Smart Contract ABI for Hyperledger Fabric integration
const contractABI = [
  {
    "inputs": [
      {"name": "_herbId", "type": "string"},
      {"name": "_location", "type": "string"},
      {"name": "_timestamp", "type": "uint256"},
      {"name": "_collectorId", "type": "string"},
      {"name": "_species", "type": "string"}
    ],
    "name": "recordHarvestEvent",
    "outputs": [],
    "type": "function"
  },
  {
    "inputs": [{"name": "_herbId", "type": "string"}],
    "name": "getHerbProvenance",
    "outputs": [{"name": "", "type": "string"}],
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
      // Mock wallet connection for demonstration
      const mockWeb3 = {
        eth: {
          getAccounts: async () => ['0x1234567890123456789012345678901234567890'],
          Contract: class MockContract {
            constructor(abi: any, address: string) {}
            methods = {
              recordHarvestEvent: (...args: any[]) => ({
                send: async (options: any) => {
                  console.log('Recording harvest event:', args);
                  return { transactionHash: '0xmockhash' };
                }
              }),
              getHerbProvenance: (herbId: string) => ({
                call: async () => {
                  console.log('Getting provenance for:', herbId);
                  return JSON.stringify({
                    herbId,
                    events: ['harvest', 'processing', 'quality_test']
                  });
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

      // Initialize contract
      const contractInstance = new mockWeb3.eth.Contract(
        contractABI,
        '0x1234567890123456789012345678901234567890'
      );
      setContract(contractInstance);
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