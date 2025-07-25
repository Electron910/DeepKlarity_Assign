// const pdf = require('pdf-parse');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const extractTextFromPDF = async (buffer) => {
//   try {
//     const data = await pdf(buffer);
//     return data.text;
//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     throw new Error(`PDF extraction failed: ${error.message}`);
//   }
// };

// const analyzeResume = async (resumeText) => {
//   try {
//     // Check if API key exists
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error('Gemini API key is not configured');
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // More explicit prompt for JSON generation
//     const prompt = `
// You are a resume analyzer. Analyze the resume text below and return ONLY a valid JSON object. Do not include any explanation, markdown formatting, or additional text.

// Resume to analyze:
// ${resumeText.substring(0, 4000)}

// Return ONLY this JSON structure (no other text):
// {
//   "name": "person's full name or Unknown",
//   "email": "email address or empty string",
//   "phone": "phone number or empty string", 
//   "summary": "2-3 sentence professional summary",
//   "skills": ["skill1", "skill2", "skill3"],
//   "experience": [
//     {
//       "company": "Company Name",
//       "position": "Job Title",
//       "duration": "Date Range",
//       "description": "Brief description"
//     }
//   ],
//   "education": [
//     {
//       "institution": "School Name",
//       "degree": "Degree Type",
//       "field": "Field of Study",
//       "year": "Year"
//     }
//   ],
//   "rating": 7,
//   "suggestions": ["suggestion 1", "suggestion 2"],
//   "improvements": ["improvement area 1", "improvement area 2"]
// }

// Ensure the response is valid JSON that can be parsed with JSON.parse().
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text();
    
//     console.log('Raw Gemini response:', text.substring(0, 200) + '...'); // Debug log

//     // Clean the response
//     text = text.trim();
    
//     // Remove any markdown code blocks
//     text = text.replace(/```json\s*/gi, '');
//     text = text.replace(/```\s*/gi, '');
    
//     // Find JSON object - look for outermost curly braces
//     const jsonStart = text.indexOf('{');
//     const jsonEnd = text.lastIndexOf('}');
    
//     if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
//       text = text.substring(jsonStart, jsonEnd + 1);
//     }
    
//     try {
//       const analysis = JSON.parse(text);
      
//       // Validate and clean the parsed data
//       return {
//         name: (analysis.name && typeof analysis.name === 'string') ? analysis.name : 'Unknown',
//         email: (analysis.email && typeof analysis.email === 'string') ? analysis.email : '',
//         phone: (analysis.phone && typeof analysis.phone === 'string') ? analysis.phone : '',
//         summary: (analysis.summary && typeof analysis.summary === 'string') ? analysis.summary : 'No summary available',
//         skills: Array.isArray(analysis.skills) ? analysis.skills.filter(s => typeof s === 'string') : [],
//         experience: Array.isArray(analysis.experience) ? analysis.experience.map(exp => ({
//           company: exp.company || '',
//           position: exp.position || '',
//           duration: exp.duration || '',
//           description: exp.description || ''
//         })) : [],
//         education: Array.isArray(analysis.education) ? analysis.education.map(edu => ({
//           institution: edu.institution || '',
//           degree: edu.degree || '',
//           field: edu.field || '',
//           year: edu.year || ''
//         })) : [],
//         rating: (typeof analysis.rating === 'number' && analysis.rating >= 0 && analysis.rating <= 10) ? analysis.rating : 5,
//         suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.filter(s => typeof s === 'string') : ['Consider adding more details to your resume'],
//         improvements: Array.isArray(analysis.improvements) ? analysis.improvements.filter(s => typeof s === 'string') : ['Ensure all sections are complete']
//       };
//     } catch (parseError) {
//       console.error('JSON parsing failed:', parseError);
//       console.error('Attempted to parse:', text.substring(0, 500));
      
//       // Fallback: Try to extract basic information manually
//       return extractBasicInfo(resumeText);
//     }
//   } catch (error) {
//     console.error('Gemini API error:', error);
    
//     // If Gemini fails completely, use fallback extraction
//     return extractBasicInfo(resumeText);
//   }
// };

// // Fallback function to extract basic information
// const extractBasicInfo = (resumeText) => {
//   console.log('Using fallback extraction method...');
  
//   // Simple regex patterns for basic extraction
//   const emailRegex = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/;
//   const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}/;
  
//   // Extract email
//   const emailMatch = resumeText.match(emailRegex);
//   const email = emailMatch ? emailMatch[0] : '';
  
//   // Extract phone
//   const phoneMatch = resumeText.match(phoneRegex);
//   const phone = phoneMatch ? phoneMatch[0] : '';
  
//   // Try to extract name (usually at the beginning)
//   const lines = resumeText.split('\n').filter(line => line.trim());
//   const name = lines.length > 0 ? lines[0].trim() : 'Unknown';
  
//   // Extract skills (look for common keywords)
//   const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS', 'Git', 'AWS', 'Docker'];
//   const skills = skillKeywords.filter(skill => 
//     resumeText.toLowerCase().includes(skill.toLowerCase())
//   );
  
//   return {
//     name: name,
//     email: email,
//     phone: phone,
//     summary: 'Resume uploaded successfully. Manual review recommended.',
//     skills: skills,
//     experience: [],
//     education: [],
//     rating: 5,
//     suggestions: [
//       'Resume analysis completed with basic extraction',
//       'Consider formatting your resume with clear sections',
//       'Ensure contact information is clearly visible'
//     ],
//     improvements: [
//       'Add clear section headers (Experience, Education, Skills)',
//       'Use consistent formatting throughout the resume'
//     ]
//   };
// };

// module.exports = {
//   extractTextFromPDF,
//   analyzeResume
// };








// const pdf = require('pdf-parse');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const extractTextFromPDF = async (buffer) => {
//   try {
//     const data = await pdf(buffer);
//     return data.text;
//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     throw new Error(`PDF extraction failed: ${error.message}`);
//   }
// };

// const analyzeWithRetry = async (resumeText, retries = 3) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       console.log(`Attempt ${attempt} of ${retries}...`);
      
//       // Different prompt strategies for each retry
//       let prompt;
      
//       if (attempt === 1) {
//         // First attempt: Very explicit JSON instruction
//         prompt = `
// Output only valid JSON for this resume. No other text.

// Resume: ${resumeText.substring(0, 3000)}

// Output this exact JSON format:
// {"name":"string","email":"string","phone":"string","summary":"string","skills":["string"],"experience":[{"company":"string","position":"string","duration":"string","description":"string"}],"education":[{"institution":"string","degree":"string","field":"string","year":"string"}],"rating":5,"suggestions":["string"],"improvements":["string"]}
// `;
//       } else if (attempt === 2) {
//         // Second attempt: Step by step
//         prompt = `
// Extract resume data and format as JSON:
// ${resumeText.substring(0, 2500)}

// Format: {"name":"[NAME]","email":"[EMAIL]","phone":"[PHONE]","summary":"[SUMMARY]","skills":["[SKILL1]","[SKILL2]"],"experience":[{"company":"[COMPANY]","position":"[POSITION]","duration":"[DURATION]","description":"[DESC]"}],"education":[{"institution":"[SCHOOL]","degree":"[DEGREE]","field":"[FIELD]","year":"[YEAR]"}],"rating":5,"suggestions":["[SUGGESTION]"],"improvements":["[IMPROVEMENT]"]}
// `;
//       } else {
//         // Third attempt: Simpler extraction
//         prompt = `
// Return JSON: {"name":"","email":"","phone":"","summary":"","skills":[],"experience":[],"education":[],"rating":5,"suggestions":[],"improvements":[]}

// Fill with data from: ${resumeText.substring(0, 2000)}
// `;
//       }
      
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       let text = response.text();
      
//       // Clean response
//       text = text.trim();
//       text = text.replace(/```json\s*/gi, '');
//       text = text.replace(/```\s*/gi, '');
//       text = text.replace(/^[^{]*/, ''); // Remove everything before first {
//       text = text.replace(/[^}]*$/, ''); // Remove everything after last }
      
//       // Try to parse
//       const parsed = JSON.parse(text);
      
//       // If successful, return validated data
//       if (parsed && typeof parsed === 'object') {
//         return validateAndCleanData(parsed);
//       }
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed:`, error.message);
//       if (attempt === retries) {
//         console.log('All attempts failed, using fallback extraction');
//         return extractBasicInfo(resumeText);
//       }
//     }
//   }
// };

// const validateAndCleanData = (data) => {
//   return {
//     name: data.name || 'Unknown',
//     email: data.email || '',
//     phone: data.phone || '',
//     summary: data.summary || 'No summary available',
//     skills: Array.isArray(data.skills) ? data.skills : [],
//     experience: Array.isArray(data.experience) ? data.experience : [],
//     education: Array.isArray(data.education) ? data.education : [],
//     rating: typeof data.rating === 'number' ? data.rating : 5,
//     suggestions: Array.isArray(data.suggestions) ? data.suggestions : ['Review and update your resume'],
//     improvements: Array.isArray(data.improvements) ? data.improvements : ['Add more details']
//   };
// };

// const extractBasicInfo = (resumeText) => {
//   // Enhanced extraction logic
//   const patterns = {
//     email: /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/,
//     phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}/,
//     linkedin: /linkedin\.com\/in\/[\w-]+/i,
//     github: /github\.com\/[\w-]+/i
//   };
  
//   const extracted = {};
//   for (const [key, pattern] of Object.entries(patterns)) {
//     const match = resumeText.match(pattern);
//     extracted[key] = match ? match[0] : '';
//   }
  
//   // Extract name (first non-empty line that looks like a name)
//   const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l);
//   let name = 'Unknown';
//   for (const line of lines.slice(0, 5)) {
//     if (line.length < 50 && /^[A-Za-z\s\-\.]+$/.test(line)) {
//       name = line;
//       break;
//     }
//   }
  
//   // Extract skills
//     // Extract skills (continued)
//   const commonSkills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'MongoDB', 
//     'SQL', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript',
//     'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'C#', '.NET', 'Spring', 'Django', 'Flask', 'Laravel',
//     'Machine Learning', 'Data Science', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'];
  
//   const foundSkills = [];
//   const lowerText = resumeText.toLowerCase();
//   for (const skill of commonSkills) {
//     if (lowerText.includes(skill.toLowerCase())) {
//       foundSkills.push(skill);
//     }
//   }
  
//   return {
//     name: name,
//     email: extracted.email,
//     phone: extracted.phone,
//     summary: `Resume for ${name}. Contact: ${extracted.email || 'Not provided'}`,
//     skills: foundSkills,
//     experience: [],
//     education: [],
//     rating: 5,
//     suggestions: [
//       'AI analysis was not available - manual review recommended',
//       'Ensure your resume has clear section headers',
//       'Consider adding more specific achievements and metrics'
//     ],
//     improvements: [
//       'Add quantifiable achievements to your experience',
//       'Include relevant keywords for your target role',
//       'Ensure consistent formatting throughout'
//     ]
//   };
// };

// const analyzeResume = async (resumeText) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error('Gemini API key is not configured');
//     }
    
//     return await analyzeWithRetry(resumeText);
//   } catch (error) {
//     console.error('Analysis error:', error);
//     return extractBasicInfo(resumeText);
//   }
// };

// module.exports = {
//   extractTextFromPDF,
//   analyzeResume
// };




const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

// Safe JSON parse function
const safeJsonParse = (text) => {
  try {
    // First check if it looks like JSON
    const trimmed = text.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.log('Text does not start with { or [, not JSON');
      return null;
    }
    return JSON.parse(trimmed);
  } catch (e) {
    console.log('JSON parse failed:', e.message);
    return null;
  }
};

// Parse any type of Gemini response
const parseGeminiResponse = (responseText, resumeText) => {
  console.log('🔍 Parsing Gemini response...');
  console.log('Response type:', typeof responseText);
  console.log('First 100 chars:', responseText.substring(0, 100));
  
  // First, try to parse as JSON
  const jsonAttempt = safeJsonParse(responseText);
  if (jsonAttempt) {
    console.log('✅ Successfully parsed as JSON');
    return {
      name: jsonAttempt.name || 'Unknown',
      email: jsonAttempt.email || '',
      phone: jsonAttempt.phone || '',
      summary: jsonAttempt.summary || '',
      skills: Array.isArray(jsonAttempt.skills) ? jsonAttempt.skills : [],
      experience: Array.isArray(jsonAttempt.experience) ? jsonAttempt.experience : [],
      education: Array.isArray(jsonAttempt.education) ? jsonAttempt.education : [],
      rating: jsonAttempt.rating || 5,
      suggestions: Array.isArray(jsonAttempt.suggestions) ? jsonAttempt.suggestions : [],
      improvements: Array.isArray(jsonAttempt.improvements) ? jsonAttempt.improvements : []
    };
  }
  
  console.log('📝 Parsing as natural language...');
  
  // Initialize result object
  const result = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    rating: 5,
    suggestions: [],
    improvements: []
  };
  
  // Extract email from response or original resume
  const emailRegex = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/;
  const emailMatch = responseText.match(emailRegex) || resumeText.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[0];
  }
  
  // Extract phone
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}/;
  const phoneMatch = responseText.match(phoneRegex) || resumeText.match(phoneRegex);
  if (phoneMatch) {
    result.phone = phoneMatch[0];
  }
  
  // Extract name - look for patterns
  const namePatterns = [
    /name\s*[:=]\s*([^\n,]+)/i,
    /candidate\s*[:=]\s*([^\n,]+)/i,
    /^([A-Z][a-z]+ [A-Z][a-z]+)/m
  ];
  
  for (const pattern of namePatterns) {
    const match = responseText.match(pattern) || resumeText.match(pattern);
    if (match && match[1]) {
      result.name = match[1].trim();
      break;
    }
  }
  
  // If still no name, try first line of resume
  if (!result.name) {
    const lines = resumeText.split('\n').filter(l => l.trim());
    if (lines.length > 0 && lines[0].length < 50) {
      result.name = lines[0].trim();
    }
  }
  
  // Handle skills - check if response is just a comma-separated list
  if (responseText.includes(',') && responseText.length < 200) {
    // Might be a direct skills list like "Python,Java,JavaScript"
    const potentialSkills = responseText.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (potentialSkills.length > 0 && potentialSkills.every(s => s.length < 30)) {
      result.skills = potentialSkills;
    }
  }
  
  // Look for skills in various formats
  if (result.skills.length === 0) {
    const skillsMatch = responseText.match(/skills?\s*[:=]?\s*([^\n]+)/i);
    if (skillsMatch) {
      result.skills = skillsMatch[1]
        .split(/[,;·•|]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 30);
    }
  }
  
  // Extract skills from resume text if not found in response
  if (result.skills.length === 0) {
    const techKeywords = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Angular', 'Vue',
      'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'MongoDB', 'SQL',
      'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git',
      'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift'
    ];
    
    const foundSkills = [];
    const lowerResume = resumeText.toLowerCase();
    
    for (const skill of techKeywords) {
      if (lowerResume.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }
    result.skills = foundSkills;
  }
  
  // Extract rating
  const ratingMatch = responseText.match(/(\d+)\s*(?:\/|out of)\s*10/i) || 
                      responseText.match(/rating\s*[:=]?\s*(\d+)/i);
  if (ratingMatch) {
    const rating = parseInt(ratingMatch[1]);
    if (rating >= 0 && rating <= 10) {
      result.rating = rating;
    }
  }
  
  // Create summary if not found
  if (!result.summary) {
    result.summary = `${result.name || 'Candidate'} with skills in ${result.skills.slice(0, 3).join(', ') || 'various technologies'}.`;
  }
  
  // Default suggestions and improvements
  if (result.suggestions.length === 0) {
    result.suggestions = [
      'Consider adding more specific achievements and metrics',
      'Include relevant certifications or training',
      'Highlight leadership and teamwork experiences'
    ];
  }
  
  if (result.improvements.length === 0) {
    result.improvements = [
      'Use action verbs to describe your accomplishments',
      'Quantify your achievements where possible',
      'Tailor your resume to the specific job requirements'
    ];
  }
  
  console.log('✅ Parsing complete');
  return result;
};

const analyzeResume = async (resumeText) => {
  try {
    console.log('\n📊 Starting resume analysis...');
    console.log(`📝 Resume text length: ${resumeText.length} characters`);
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ No Gemini API key found');
      return extractBasicInfo(resumeText);
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Simple prompt that's less likely to confuse Gemini
    const prompt = `Analyze this resume and tell me:
- The person's name
- Their email
- Their phone number
- Their main skills
- Rate the resume from 1 to 10

Resume:
${resumeText.substring(0, 3000)}`;

    console.log('📤 Sending to Gemini...');
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      console.log('📥 Gemini responded');
      console.log(`Response length: ${responseText.length} characters`);
      
      // Parse whatever Gemini returns
      const parsedData = parseGeminiResponse(responseText, resumeText);
      
      // Ensure we have at least basic info
      if (!parsedData.name && !parsedData.email) {
        const basicInfo = extractBasicInfo(resumeText);
        parsedData.name = parsedData.name || basicInfo.name;
        parsedData.email = parsedData.email || basicInfo.email;
        parsedData.phone = parsedData.phone || basicInfo.phone;
        
        if (parsedData.skills.length === 0) {
          parsedData.skills = basicInfo.skills;
        }
      }
      
      return parsedData;
      
    } catch (geminiError) {
      console.error('❌ Gemini error:', geminiError.message);
      return extractBasicInfo(resumeText);
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    return extractBasicInfo(resumeText);
  }
};

const extractBasicInfo = (resumeText) => {
  console.log('🔄 Using basic extraction...');
  
  const result = {
    name: 'Unknown',
    email: '',
    phone: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    rating: 5,
    suggestions: [
      'Resume processed with basic extraction',
      'Consider restructuring with clear sections',
      'Add more specific details and achievements'
    ],
    improvements: [
      'Include quantifiable achievements',
      'Add section headers for better organization',
      'Use consistent formatting throughout'
    ]
  };
  
  // Extract email
  const emailMatch = resumeText.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  if (emailMatch) {
    result.email = emailMatch[0];
  }
  
  // Extract phone
  const phoneMatch = resumeText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0];
  }
  
  // Extract name from first few lines
  const lines = resumeText.split('\n').filter(l => l.trim());
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Check if line looks like a name
    if (line.length < 50 && line.length > 3) {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        // Check if all words start with capital letters
        if (words.every(w => /^[A-Z]/.test(w))) {
          result.name = line;
          break;
        }
      }
    }
  }
  
  // Extract skills
    // Extract skills (continued)
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'MongoDB', 'SQL',
    'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Scala', '.NET', 'jQuery', 'Bootstrap', 'Tailwind',
    'Redux', 'GraphQL', 'REST', 'API', 'Microservices', 'CI/CD', 'Jenkins',
    'Linux', 'Agile', 'Scrum', 'Machine Learning', 'AI', 'Data Science'
  ];
  
  const lowerText = resumeText.toLowerCase();
  for (const skill of skillKeywords) {
    if (lowerText.includes(skill.toLowerCase())) {
      result.skills.push(skill);
    }
  }
  
  // Create summary
  if (result.skills.length > 0) {
    result.summary = `Professional with expertise in ${result.skills.slice(0, 3).join(', ')}.`;
  } else {
    result.summary = 'Professional seeking new opportunities.';
  }
  
  return result;
};

module.exports = {
  extractTextFromPDF,
  analyzeResume
};