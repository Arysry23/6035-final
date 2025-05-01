import { ethers } from 'ethers';
import MessageBoard from '../../contracts/ MessageBoard.json'; 

const contractAddress = MessageBoard.address;
const { abi } = MessageBoard;



export function getMessageBoardContract(providerOrSigner: ethers.providers.Provider | ethers.Signer) {
  return new ethers.Contract(contractAddress, abi, providerOrSigner);
}
