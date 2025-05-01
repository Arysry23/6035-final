import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getMessageBoardContract } from '../utils/contractInstance';

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!window.ethereum) {
        console.error('MetaMask is not installed');
        setError('MetaMask is not installed');
        setLoading(false);
        return;
      }

      try {
        // Update to the correct Web3Provider constructor in ethers.js v6
        const provider = new ethers.providers.Web3Provider(window.ethereum);  // Correct way to use Web3Provider
        const contract = getMessageBoardContract(provider);

        // Fetch messages from contract
        const fetchedMessages = await contract.getMessages();
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages');
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p><strong>{message.sender}</strong>: {message.content} (At {new Date(message.timestamp * 1000).toLocaleString()})</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageBoard;
