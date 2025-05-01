import { useState } from 'react';
import { ethers } from 'ethers';
import { getMessageBoardContract } from '../utils/contractInstance';

const PostMessage = () => {
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert('Please install MetaMask to post a message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the Web3 provider from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();  // Get the user's MetaMask account
      const contract = getMessageBoardContract(signer);

      // Check the user's MetaMask address
      console.log('Signer address:', await signer.getAddress());

      // Create a transaction for posting a message to the contract
      const tx = await contract.postMessage(messageContent);  // Calling the smart contract function
      console.log('Transaction sent:', tx);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      alert('Message posted successfully!');
      setMessageContent('');  // Clear input after posting
    } catch (error) {
      console.error('Error posting message:', error);
      setError('Failed to post message. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Enter your message"
        required
      />
      <button type="submit" disabled={loading}>Post Message</button>
      
      {loading && <p>Sending message...</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default PostMessage;
