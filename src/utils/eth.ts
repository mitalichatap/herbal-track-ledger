// Utility functions for Ethereum interaction

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectToWallet() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return window.ethereum;
}

export function scaleCoordinates(lat: number, lon: number): { lat: number; lon: number } {
  return {
    lat: Math.round(lat * 1e6),
    lon: Math.round(lon * 1e6)
  };
}

export function unscaleCoordinates(lat: number, lon: number): { lat: number; lon: number } {
  return {
    lat: lat / 1e6,
    lon: lon / 1e6
  };
}

export function scaleMoisture(moisturePercent: number): number {
  return Math.round(moisturePercent * 100);
}

export function unscaleMoisture(scaledMoisture: number): number {
  return scaledMoisture / 100;
}