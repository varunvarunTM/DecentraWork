import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Proposal {
  freelancer: string;
  proposedPayment: string;
  proposalDetails: string;
  isAccepted: boolean;
}

export function ProposalList({ jobId }: { jobId: number }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProposal, setNewProposal] = useState({
    payment: '',
    details: ''
  });

  useEffect(() => {
    loadProposals();
  }, [jobId]);

  async function loadProposals() {
    try {
      const contract = await getContract();
      // Get all proposals for this job
      let index = 0;
      const proposalList = [];
      
      while (true) {
        try {
          const proposal = await contract.jobProposals(jobId, index);
          proposalList.push({
            freelancer: proposal.freelancer,
            proposedPayment: ethers.utils.formatEther(proposal.proposedPayment),
            proposalDetails: proposal.proposalDetails,
            isAccepted: proposal.isAccepted
          });
          index++;
        } catch (error) {
          break;
        }
      }
      
      setProposals(proposalList);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function submitProposal(e: React.FormEvent) {
    e.preventDefault();
    try {
      const contract = await getContract(true);
      const paymentInWei = ethers.utils.parseEther(newProposal.payment);
      
      const tx = await contract.submitProposal(jobId, paymentInWei, newProposal.details);
      
      await toast.promise(tx.wait(), {
        loading: 'Submitting proposal...',
        success: 'Proposal submitted successfully!',
        error: 'Error submitting proposal'
      });
      
      setNewProposal({ payment: '', details: '' });
      loadProposals();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error('Failed to submit proposal');
    }
  }

  async function acceptProposal(freelancerAddress: string) {
    try {
      const contract = await getContract(true);
      const tx = await contract.acceptProposal(jobId, freelancerAddress);
      
      await toast.promise(tx.wait(), {
        loading: 'Accepting proposal...',
        success: 'Proposal accepted successfully!',
        error: 'Error accepting proposal'
      });
      
      loadProposals();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast.error('Failed to accept proposal');
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading proposals...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submitProposal} className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-4">Submit a Proposal</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Proposed Payment (ETH)</label>
            <input
              type="number"
              step="0.001"
              value={newProposal.payment}
              onChange={(e) => setNewProposal(prev => ({ ...prev, payment: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Proposal Details</label>
            <textarea
              value={newProposal.details}
              onChange={(e) => setNewProposal(prev => ({ ...prev, details: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Proposal
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {proposals.map((proposal, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Proposal from {proposal.freelancer.slice(0, 6)}...</span>
            </div>
            <p className="text-gray-600 mb-3">{proposal.proposalDetails}</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">{proposal.proposedPayment} ETH</span>
              {!proposal.isAccepted && (
                <button
                  onClick={() => acceptProposal(proposal.freelancer)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Accept Proposal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}