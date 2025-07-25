const { pool } = require('../config/database');
const analysisService = require('../services/analysisService');

const uploadAndAnalyze = async (req, res) => {
  console.log('\n📤 Upload request received');
  
  try {
    // Check file upload
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please select a PDF file to upload'
      });
    }

    console.log('📄 File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const { originalname, buffer, size } = req.file;

    // Extract text from PDF
    let extractedText;
    try {
      console.log('📝 Extracting text from PDF...');
      extractedText = await analysisService.extractTextFromPDF(buffer);
      console.log(`✅ Text extracted, length: ${extractedText.length}`);
    } catch (error) {
      console.error('❌ PDF extraction error:', error);
      return res.status(400).json({ 
        error: 'Failed to extract text from PDF',
        details: error.message
      });
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('❌ No text found in PDF');
      return res.status(400).json({ 
        error: 'No text found in PDF',
        details: 'The PDF appears to be empty or contains only images'
      });
    }

    // Analyze with Gemini
    let analysis;
    try {
      console.log('🤖 Starting analysis...');
      analysis = await analysisService.analyzeResume(extractedText);
      console.log('✅ Analysis completed');
      console.log('Analysis result:', {
        name: analysis.name,
        email: analysis.email,
        skillsCount: analysis.skills?.length || 0,
        rating: analysis.rating
      });
    } catch (error) {
      console.error('❌ Analysis error:', error);
      return res.status(500).json({ 
        error: 'Failed to analyze resume',
        details: error.message
      });
    }

    // Ensure we have valid data before saving
    const validatedAnalysis = {
      name: analysis.name || 'Unknown',
      email: analysis.email || '',
      phone: analysis.phone || '',
      summary: analysis.summary || '',
      skills: Array.isArray(analysis.skills) ? analysis.skills : [],
      experience: Array.isArray(analysis.experience) ? analysis.experience : [],
      education: Array.isArray(analysis.education) ? analysis.education : [],
      rating: typeof analysis.rating === 'number' ? analysis.rating : 5,
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : []
    };

    // Save to database
    try {
      console.log('💾 Saving to database...');
      const query = `
        INSERT INTO resumes (
          filename, file_size, raw_text, name, email, phone, 
          summary, skills, experience, education, rating, 
          suggestions, improvements, analysis_complete
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        originalname,
        size,
        extractedText.substring(0, 10000), // Limit stored text
        validatedAnalysis.name,
        validatedAnalysis.email,
        validatedAnalysis.phone,
        validatedAnalysis.summary,
        JSON.stringify(validatedAnalysis.skills),
        JSON.stringify(validatedAnalysis.experience),
        JSON.stringify(validatedAnalysis.education),
        validatedAnalysis.rating,
        validatedAnalysis.suggestions,
        validatedAnalysis.improvements,
        true
      ];

      const result = await pool.query(query, values);
      console.log('✅ Saved to database, ID:', result.rows[0].id);
      
      // Prepare response - ensure JSON fields are parsed
      const resume = result.rows[0];
      
      // Safely parse JSON fields
      try {
        resume.skills = typeof resume.skills === 'string' ? JSON.parse(resume.skills) : resume.skills;
      } catch (e) {
        resume.skills = [];
      }
      
      try {
        resume.experience = typeof resume.experience === 'string' ? JSON.parse(resume.experience) : resume.experience;
      } catch (e) {
        resume.experience = [];
      }
      
      try {
        resume.education = typeof resume.education === 'string' ? JSON.parse(resume.education) : resume.education;
      } catch (e) {
        resume.education = [];
      }
      
      console.log('✅ Sending success response');
      res.json({
        success: true,
        resume: resume,
        analysis: validatedAnalysis
      });
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to save resume',
        details: dbError.message
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({ 
      error: 'Failed to process resume',
      details: error.message 
    });
  }
};

const getAllResumes = async (req, res) => {
  try {
    const query = `
      SELECT id, filename, upload_date, name, email, rating, analysis_complete
      FROM resumes
      ORDER BY upload_date DESC
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch resumes',
      details: error.message
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM resumes WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Parse JSON fields safely
    const resume = result.rows[0];
    
    try {
      if (typeof resume.skills === 'string') {
        resume.skills = JSON.parse(resume.skills);
      }
    } catch (e) {
      resume.skills = [];
    }
    
    try {
      if (typeof resume.experience === 'string') {
        resume.experience = JSON.parse(resume.experience);
      }
    } catch (e) {
      resume.experience = [];
    }
    
    try {
      if (typeof resume.education === 'string') {
        resume.education = JSON.parse(resume.education);
      }
    } catch (e) {
      resume.education = [];
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch resume',
      details: error.message
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM resumes WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      error: 'Failed to delete resume',
      details: error.message
    });
  }
};

module.exports = {
  uploadAndAnalyze,
  getAllResumes,
  getResumeById,
  deleteResume
};