import React, { useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const contractABI: any[] = [
  // Your contract ABI here
  // ...
];

const PetitionComponent: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const initializeContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contract);

      // Check if the user has already voted
      const userHasVoted = await contract.hasVoted();
      setHasVoted(userHasVoted);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const handleVote = async () => {
    try {
      // Initialize contract if not already initialized
      await initializeContract();

      // Check if the user has already voted
      if (hasVoted) {
        alert('You have already voted.');
        return;
      }

      // Request MetaMask access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Vote on the petition
      await contract?.vote();
      alert('Vote cast successfully!');
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting. Please try again.');
    }
  };

  return (
    <div>
      <h1>Vote on Petition</h1>
      <button onClick={handleVote}>Vote</button>
      {hasVoted && <p>You have already voted.</p>}
    </div>
  );
};

export default PetitionComponent;

