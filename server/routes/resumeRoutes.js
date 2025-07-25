const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

// Upload and analyze resume
router.post('/upload', upload.single('resume'), resumeController.uploadAndAnalyze);

// Get all resumes
router.get('/', resumeController.getAllResumes);

// Get single resume
router.get('/:id', resumeController.getResumeById);

// Delete resume
router.delete('/:id', resumeController.deleteResume);

module.exports = router;




// Add this route for testing
router.post('/test-analysis', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    const analysisService = require('../services/analysisService');
    const analysis = await analysisService.analyzeResume(text);
    
    res.json({
      success: true,
      analysis: analysis,
      textLength: text.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});