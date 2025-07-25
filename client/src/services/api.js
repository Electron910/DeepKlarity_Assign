import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  uploadResume: (formData, onUploadProgress) => {
    return axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  getResumes: () => {
    return axios.get(`${API_BASE_URL}/resumes`);
  },

  getResumeById: (id) => {
    return axios.get(`${API_BASE_URL}/resumes/${id}`);
  },

  deleteResume: (id) => {
    return axios.delete(`${API_BASE_URL}/resumes/${id}`);
  },
};

export default api;