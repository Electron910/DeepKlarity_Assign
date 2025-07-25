import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PastResumesTable.css';

const PastResumesTable = ({ refreshTrigger }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [refreshTrigger]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await api.getResumes();
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await api.getResumeById(id);
      setSelectedResume(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching resume details:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.deleteResume(id);
        fetchResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="past-resumes">
      <h2>Resume History</h2>
      
      {resumes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No resumes uploaded yet</p>
          <p className="empty-hint">Upload your first resume to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="resumes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Upload Date</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>
                    <div className="name-cell">
                      <span className="file-icon">📄</span>
                      <div>
                        <p className="candidate-name">{resume.name || 'Unknown'}</p>
                        <p className="file-name">{resume.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td>{resume.email || 'N/A'}</td>
                  <td>{formatDate(resume.upload_date)}</td>
                  <td>
                    <span className={`rating-badge rating-${resume.rating >= 8 ? 'high' : resume.rating >= 6 ? 'medium' : 'low'}`}>
                      {resume.rating}/10
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${resume.analysis_complete ? 'complete' : 'pending'}`}>
                      {resume.analysis_complete ? 'Analyzed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleView(resume.id)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(resume.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetails && selectedResume && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Resume Details</h3>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {selectedResume.name}</p>
                <p><strong>Email:</strong> {selectedResume.email}</p>
                <p><strong>Phone:</strong> {selectedResume.phone || 'N/A'}</p>
              </div>
              
              <div className="detail-section">
                <h4>Summary</h4>
                <p>{selectedResume.summary || 'No summary available'}</p>
              </div>

              {selectedResume.skills && (
                <div className="detail-section">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {selectedResume.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Analysis</h4>
                <p><strong>Rating:</strong> {selectedResume.rating}/10</p>
                {selectedResume.suggestions && selectedResume.suggestions.length > 0 && (
                  <div>
                    <strong>Suggestions:</strong>
                    <ul>
                      {selectedResume.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastResumesTable;