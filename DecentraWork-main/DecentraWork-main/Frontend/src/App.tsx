import React, { useState } from 'react';
import { CreateJob } from './components/CreateJob';
import { JobList } from './components/JobList';
import { Toaster } from 'react-hot-toast';
import { Briefcase, Plus } from 'lucide-react';

function App() {
  const [view, setView] = useState<'jobs' | 'create'>('jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Freelance Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('jobs')}
                className={`px-4 py-2 rounded-md ${
                  view === 'jobs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Jobs
              </button>
              <button
                onClick={() => setView('create')}
                className={`px-4 py-2 rounded-md ${
                  view === 'create' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Job
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'jobs' ? <JobList /> : <CreateJob />}
      </main>
    </div>
  );
}

export default App;