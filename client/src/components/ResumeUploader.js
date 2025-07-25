import React, { useState } from 'react';
import api from '../services/api';
import './ResumeUploader.css';

const ResumeUploader = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
      } else {
        setFile(droppedFile);
        setError(null);
      }
    } else {
      setError('Please drop a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.uploadResume(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      if (response.data.success) {
        onAnalysisComplete(response.data);
        setFile(null);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.details || 
                          err.response?.data?.error || 
                          'Failed to upload resume. Please try again.';
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-uploader">
      <h2>Upload Your Resume</h2>
      
      <div 
        className={`upload-area ${file ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          hidden
        />
        
        <label htmlFor="file-input" className="upload-label">
          {file ? (
            <div className="file-info">
              <span className="file-icon">📄</span>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <span className="upload-icon">⬆️</span>
              <p>Drag & drop your resume here or click to browse</p>
              <p className="upload-hint">Only PDF files up to 5MB</p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <button 
        className="upload-button"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>

      {loading && (
        <div className="loading-indicator">
          <p>Processing your resume... This may take a moment.</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;