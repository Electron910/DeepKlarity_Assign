import axios from 'axios';

// This will use the production URL when deployed
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

const api = {
  uploadResume: (formData, onUploadProgress) => {
    return axiosInstance.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  getResumes: () => {
    return axiosInstance.get('/resumes');
  },

  getResumeById: (id) => {
    return axiosInstance.get(`/resumes/${id}`);
  },

  deleteResume: (id) => {
    return axiosInstance.delete(`/resumes/${id}`);
  },
  
  checkHealth: () => {
    return axiosInstance.get('/health');
  }
};

export default api;