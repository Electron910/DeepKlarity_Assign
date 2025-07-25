import React, { useState } from 'react';
import Layout from './components/Layout';
import ResumeUploader from './components/ResumeUploader';
import ResumeDetails from './components/ResumeDetails';
import PastResumesTable from './components/PastResumesTable';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis);
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="App">
      <Layout>
        <div className="tabs">
          <button 
            className={activeTab === 'upload' ? 'active' : ''}
            onClick={() => setActiveTab('upload')}
          >
            Upload & Analyze
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Resume History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'upload' ? (
            <div className="upload-section">
              <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
              {currentAnalysis && <ResumeDetails analysis={currentAnalysis} />}
            </div>
          ) : (
            <PastResumesTable refreshTrigger={refreshHistory} />
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;