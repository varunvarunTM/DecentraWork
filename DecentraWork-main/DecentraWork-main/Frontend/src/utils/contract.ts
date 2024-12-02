import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = '0xfD34112A46355A0969F8383bE7C4f19c6546828d';
export const CHAIN_ID = 59141;

export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_freelancer",
				"type": "address"
			}
		],
		"name": "acceptProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_budget",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			}
		],
		"name": "createJob",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			}
		],
		"name": "JobCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "budget",
				"type": "uint256"
			}
		],
		"name": "JobCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			}
		],
		"name": "markJobCompleted",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReleased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			}
		],
		"name": "ProposalAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "proposedPayment",
				"type": "uint256"
			}
		],
		"name": "ProposalSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			}
		],
		"name": "releasePayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "reviewed",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "ReviewSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_proposedPayment",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_proposalDetails",
				"type": "string"
			}
		],
		"name": "submitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_reviewedUser",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "_rating",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_reviewText",
				"type": "string"
			}
		],
		"name": "submitReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserAverageRating",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jobCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobProposals",
		"outputs": [
			{
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "proposedPayment",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "proposalDetails",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAccepted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "budget",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "enum FreelanceMarketplace.JobStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "selectedFreelancer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userReviews",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export async function getContract(withSigner = false) {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Request account access
  await provider.send('eth_requestAccounts', []);
  
  // Check if we're on the correct network
  const network = await provider.getNetwork();
  if (network.chainId !== CHAIN_ID) {
    throw new Error('Please connect to Linea Sepolia network');
  }

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    withSigner ? provider.getSigner() : provider
  );

  return contract;
}