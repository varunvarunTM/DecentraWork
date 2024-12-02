import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { Briefcase } from 'lucide-react';
import { ProposalList } from './ProposalList';

interface Job {
  id: number;
  client: string;
  title: string;
  description: string;
  budget: string;
  deadline: number;
  status: number;
  selectedFreelancer: string;
}

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const contract = await getContract();
      const jobCount = await contract.jobCounter();
      
      const jobPromises = [];
      for (let i = 1; i <= jobCount.toNumber(); i++) {
        jobPromises.push(contract.jobs(i));
      }
      
      const jobResults = await Promise.all(jobPromises);
      const formattedJobs = jobResults.map(job => ({
        id: job.id.toNumber(),
        client: job.client,
        title: job.title,
        description: job.description,
        budget: ethers.utils.formatEther(job.budget),
        deadline: job.deadline.toNumber(),
        status: job.status,
        selectedFreelancer: job.selectedFreelancer
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading jobs...</div>;
  }

  return (
    <div className="grid gap-6 p-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">{job.title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{job.description}</p>
          <div className="flex justify-between items-center text-sm mb-4">
            <span className="text-blue-600 font-medium">{job.budget} ETH</span>
            <span className="text-gray-500">
              Deadline: {new Date(job.deadline * 1000).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedJobId === job.id ? 'Hide Proposals' : 'View Proposals'}
            </button>
          </div>
          {selectedJobId === job.id && (
            <div className="mt-4 pt-4 border-t">
              <ProposalList jobId={job.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}