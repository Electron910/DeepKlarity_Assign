import React from 'react';
import './ResumeDetails.css';

const ResumeDetails = ({ analysis }) => {
  if (!analysis || !analysis.analysis) return null;

  const { resume, analysis: details } = analysis;

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4caf50';
    if (rating >= 6) return '#ff9800';
    return '#f44336';
  };

  // Ensure arrays are actually arrays
  const skills = Array.isArray(details.skills) ? details.skills : [];
  const experience = Array.isArray(details.experience) ? details.experience : [];
  const education = Array.isArray(details.education) ? details.education : [];
  const suggestions = Array.isArray(details.suggestions) ? details.suggestions : [];
  const improvements = Array.isArray(details.improvements) ? details.improvements : [];

  return (
    <div className="resume-details">
      <h2>Analysis Results</h2>
      
      <div className="details-grid">
        <div className="detail-card">
          <h3>Personal Information</h3>
          <div className="info-item">
            <strong>Name:</strong> {details.name || 'Not found'}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {details.email || 'Not found'}
          </div>
          <div className="info-item">
            <strong>Phone:</strong> {details.phone || 'Not found'}
          </div>
        </div>

        <div className="detail-card">
          <h3>Resume Rating</h3>
          <div className="rating-display">
            <div 
              className="rating-circle"
              style={{ borderColor: getRatingColor(details.rating || 0) }}
            >
              <span className="rating-number">{details.rating || 0}/10</span>
            </div>
            <p className="rating-text">
              {details.rating >= 8 ? 'Excellent' : 
               details.rating >= 6 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>

      {details.summary && (
        <div className="detail-card">
          <h3>Professional Summary</h3>
          <p>{details.summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="detail-card">
          <h3>Skills ({skills.length})</h3>
          <div className="skills-container">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="detail-card">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h4>{exp.position || 'Position'}</h4>
              <p className="company">{exp.company || 'Company'} {exp.duration && `• ${exp.duration}`}</p>
              {exp.description && <p className="description">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="detail-card">
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <h4>{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h4>
              <p>{edu.institution || 'Institution'} {edu.year && `• ${edu.year}`}</p>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="detail-card suggestions">
          <h3>💡 Suggestions</h3>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="detail-card improvements">
          <h3>🎯 Areas for Improvement</h3>
          <ul>
            {improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Debug information - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <summary>Debug Information</summary>
          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ResumeDetails;