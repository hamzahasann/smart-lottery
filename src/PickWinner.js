import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import constants from './constants';

function PickWinner() {
  const [owner, setOwner] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');
  const [isOwnerConnected, setIsOwnerConnected] = useState(false);
  const [winner, setWinner] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install Metamask to use this application');
        return;
      }

      try {
        // 1. Create a BrowserProvider in Ethers v6
        const provider = new ethers.BrowserProvider(window.ethereum);

        // 2. Request accounts (this prompts Metamask if not already connected)
        await provider.send('eth_requestAccounts', []);

        // 3. Get the signer (async in v6)
        const signer = await provider.getSigner();

        // 4. Get the signer’s address
        const address = await signer.getAddress();
        setCurrentAccount(address);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setCurrentAccount(accounts[0]);
        });
      } catch (err) {
        console.error('Error loading blockchain data:', err);
      }
    }

    async function loadContractData() {
      if (typeof window.ethereum === 'undefined') return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Ensure accounts are requested
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();

        // Create a contract instance with the signer as the runner
        const contractIns = new ethers.Contract(
          constants.contractAddress,
          constants.contractAbi,
          signer
        );

        // Call contract methods on the local variable before setting state
        const statusResult = await contractIns.isComplete();
        const winnerResult = await contractIns.getWinner();
        const ownerResult  = await contractIns.getManager();

        // Update component state
        setContractInstance(contractIns);
        setStatus(statusResult);
        setWinner(winnerResult);
        setOwner(ownerResult);

        // Check if the current account is the owner
        setIsOwnerConnected(ownerResult === currentAccount);
      } catch (error) {
        console.error('Error loading contract data:', error);
      }
    }

    loadBlockchainData();
    loadContractData();
  }, [currentAccount]);

  const pickWinner = async () => {
    // Ensure we have a valid contract instance
    if (!contractInstance) return;

    try {
      // Send the pickWinner transaction
      const tx = await contractInstance.pickWinner();
      // Wait for it to be mined
      await tx.wait();
      console.log('Winner picked!');
    } catch (err) {
      console.error('Error picking winner:', err);
    }
  };

  return (
    <div className='container'>
      <h1>Result Page</h1>
      <div className='button-container'>
        {status ? (
          <p>Lottery Winner is: {winner}</p>
        ) : isOwnerConnected ? (
          <button className='enter-button' onClick={pickWinner}>
            Pick Winner
          </button>
        ) : (
          <p>You are not the owner</p>
        )}
      </div>
    </div>
  );
}

export default PickWinner;
