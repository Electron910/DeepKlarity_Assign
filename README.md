### README.md

# Resume Analyzer 📄

An AI-powered full-stack web application that analyzes resumes using Google's Gemini AI. Upload PDF resumes to extract structured information, get AI-driven insights, and track historical uploads.

![Resume Analyzer Screenshot](screenshots/main.png)

## Features

- **PDF Resume Upload**: Drag-and-drop or click to upload PDF resumes (up to 5MB)
- **AI-Powered Analysis**: Uses Google Gemini to extract and analyze resume content
- **Structured Data Extraction**: Automatically extracts:
  - Personal information (name, email, phone)
  - Professional summary
  - Skills and competencies
  - Work experience
  - Education details
- **Resume Rating**: Get an AI-generated rating (0-10) based on resume quality
- **Improvement Suggestions**: Receive personalized suggestions and areas for improvement
- **Historical Tracking**: View and manage all previously uploaded resumes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Axios for API calls
- CSS3 with responsive design

### Backend
- Node.js & Express.js
- PostgreSQL database
- Multer for file uploads
- pdf-parse for PDF text extraction
- Google Generative AI SDK (Gemini)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Google Cloud account with Gemini API access
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer

### 2. Set up the backend

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/resume_analyzer
GEMINI_API_KEY=your_gemini_api_key_here
```

Create the PostgreSQL database:
```bash
createdb resume_analyzer
```

Start the backend server:
```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload and analyze a resume |
| GET | `/api/resumes` | Get all resumes |
| GET | `/api/resumes/:id` | Get a specific resume |
| DELETE | `/api/resumes/:id` | Delete a resume |

## Project Structure

```
resume-analyzer/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                    # Node.js backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── server.js            # Entry point
│   └── package.json
└── README.md
```

## Usage

1. **Upload a Resume**
   - Click on the "Upload & Analyze" tab
   - Drag and drop a PDF file or click to browse
   - Click "Upload & Analyze" to process the resume

2. **View Analysis Results**
   - See extracted personal information
   - Check the AI-generated rating
   - Review skills, experience, and education
   - Read suggestions and improvement areas

3. **Manage Resume History**
   - Click on the "Resume History" tab
   - View all previously uploaded resumes
   - Click the eye icon to view details
   - Click the trash icon to delete a resume

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API key

### Frontend
- `REACT_APP_API_URL`: Backend API URL (optional, defaults to http://localhost:5000/api)

## Testing

Test the application with various resume formats:
- Standard PDF resumes
- Multi-page resumes
- Resumes with different layouts
- Non-English resumes (limited support)

## Security Considerations

- File size limited to 5MB
- Only PDF files are accepted
- API keys are stored in environment variables
- Input validation on both frontend and backend
- SQL injection protection through parameterized queries

## Troubleshooting

### Common Issues

1. **"Failed to extract text from PDF"**
   - Ensure the PDF is not corrupted
   - Check if the PDF contains selectable text (not scanned images)

2. **"Gemini API error"**
   - Verify your API key is correct
   - Check API quotas and limits
   - Ensure proper network connectivity

3. **Database connection errors**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for resume analysis
- pdf-parse library for PDF text extraction
- React.js community for excellent documentation

## Future Enhancements

- [ ] Support for more file formats (DOCX, TXT)
- [ ] Resume comparison feature
- [ ] Export analysis reports
- [ ] Multi-language support
- [ ] Resume templates generator
- [ ] Integration with job boards
- [ ] Batch upload functionality
- [ ] Advanced filtering and search
```

### .gitignore
```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.idea/
.vscode/
*.swp
*.swo
*~

# Database
*.sqlite
*.sqlite3

# Uploaded files
uploads/
temp/

# Build files
*.log
*.pid
*.pid.lock
*.seed

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
```

### sample-resumes/sample-resume.md
# Sample Resume for Testing

You can use this template to create test PDF resumes:

---

**John Doe**
Email: john.doe@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

## Professional Summary
Experienced Full Stack Developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills and a passion for creating user-friendly solutions.

## Skills
- Programming Languages: JavaScript, TypeScript, Python, Java
- Frontend: React, Vue.js, HTML5, CSS3, Redux
- Backend: Node.js, Express, Django, Spring Boot
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Google Cloud, Docker, Kubernetes
- Tools: Git, Jenkins, JIRA, Webpack

## Experience

### Senior Full Stack Developer
**Tech Solutions Inc.** | Jan 2021 - Present
- Led development of microservices architecture serving 1M+ users
- Improved application performance by 40% through optimization
- Mentored junior developers and conducted code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%

### Full Stack Developer
**Digital Innovations Ltd.** | Jun 2018 - Dec 2020
- Developed RESTful APIs and responsive web applications
- Collaborated with cross-functional teams in Agile environment
- Integrated third-party services and payment gateways
- Maintained 99.9% uptime for production applications

## Education

### Bachelor of Science in Computer Science
**University of Technology** | 2014 - 2018
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Database Systems

## Certifications
- AWS Certified Solutions Architect
- Google Cloud Professional Developer

---

Convert this to PDF for testing the application!

### Setup Instructions (setup.md)
# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js installed (run `node --version` to check)
- [ ] PostgreSQL installed and running
- [ ] Git installed
- [ ] A Google Cloud account with Gemini API access

## Step-by-Step Setup

### 1. Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE resume_analyzer;
\q


### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for later use

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
echo "PORT=5000" > .env
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_analyzer" >> .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# Start server
npm run dev
```

### 4. Frontend Setup

```bash
# Open new terminal
cd client

# Install dependencies
npm install

# Start React app
npm start
```

### 5. Test the Application

1. Open http://localhost:3000
2. Upload a sample PDF resume
3. Check the analysis results
4. View resume history

## Common Setup Issues

### PostgreSQL Connection Error
- Ensure PostgreSQL service is running
- Check username/password in DATABASE_URL
- Try using `localhost` instead of `127.0.0.1`

### Gemini API Error
- Verify API
