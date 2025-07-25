const { pool } = require('../config/database');

class Resume {
  constructor(data) {
    this.id = data.id;
    this.filename = data.filename;
    this.upload_date = data.upload_date;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.skills = data.skills;
    this.experience = data.experience;
    this.education = data.education;
    this.rating = data.rating;
    this.suggestions = data.suggestions;
    this.improvements = data.improvements;
    this.raw_text = data.raw_text;
    this.file_size = data.file_size;
    this.analysis_complete = data.analysis_complete;
  }

  // Create a new resume record
  static async create(resumeData) {
    const {
      filename,
      file_size,
      raw_text,
      name,
      email,
      phone,
      summary,
      skills,
      experience,
      education,
      rating,
      suggestions,
      improvements,
      analysis_complete
    } = resumeData;

    const query = `
      INSERT INTO resumes (
        filename, file_size, raw_text, name, email, phone, 
        summary, skills, experience, education, rating, 
        suggestions, improvements, analysis_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      filename,
      file_size,
      raw_text,
      name,
      email,
      phone,
      summary,
      JSON.stringify(skills),
      JSON.stringify(experience),
      JSON.stringify(education),
      rating,
      suggestions,
      improvements,
      analysis_complete
    ];

    try {
      const result = await pool.query(query, values);
      return new Resume(result.rows[0]);
    } catch (error) {
      throw new Error(`Error creating resume: ${error.message}`);
    }
  }

  // Find all resumes
  static async findAll(options = {}) {
    const { 
      limit = null, 
      offset = 0, 
      orderBy = 'upload_date', 
      order = 'DESC' 
    } = options;

    let query = `
      SELECT id, filename, upload_date, name, email, phone, rating, analysis_complete
      FROM resumes
      ORDER BY ${orderBy} ${order}
    `;

    const values = [];

    if (limit) {
      query += ` LIMIT $1 OFFSET $2`;
      values.push(limit, offset);
    }

    try {
      const result = await pool.query(query, values);
      return result.rows.map(row => new Resume(row));
    } catch (error) {
      throw new Error(`Error fetching resumes: ${error.message}`);
    }
  }

  // Find resume by ID
  static async findById(id) {
    const query = 'SELECT * FROM resumes WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const resume = result.rows[0];
      // Parse JSON fields
      if (typeof resume.skills === 'string') {
        resume.skills = JSON.parse(resume.skills);
      }
      if (typeof resume.experience === 'string') {
        resume.experience = JSON.parse(resume.experience);
      }
      if (typeof resume.education === 'string') {
        resume.education = JSON.parse(resume.education);
      }
      
      return new Resume(resume);
    } catch (error) {
      throw new Error(`Error fetching resume: ${error.message}`);
    }
  }

  // Update resume
  async update(updateData) {
    const allowedUpdates = [
      'name', 'email', 'phone', 'summary', 'skills', 
      'experience', 'education', 'rating', 'suggestions', 
      'improvements', 'analysis_complete'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        
        // Stringify JSON fields
        if (['skills', 'experience', 'education'].includes(key)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        
        paramCount++;
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(this.id);
    const query = `
      UPDATE resumes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      Object.assign(this, result.rows[0]);
      return this;
    } catch (error) {
      throw new Error(`Error updating resume: ${error.message}`);
    }
  }

  // Delete resume
  static async delete(id) {
    const query = 'DELETE FROM resumes WHERE id = $1 RETURNING id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Error deleting resume: ${error.message}`);
    }
  }

  // Search resumes
  static async search(searchTerm) {
    const query = `
      SELECT id, filename, upload_date, name, email, rating, analysis_complete
      FROM resumes
      WHERE 
        name ILIKE $1 OR 
        email ILIKE $1 OR 
        filename ILIKE $1 OR
        raw_text ILIKE $1
      ORDER BY upload_date DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    try {
      const result = await pool.query(query, [searchPattern]);
      return result.rows.map(row => new Resume(row));
    } catch (error) {
      throw new Error(`Error searching resumes: ${error.message}`);
    }
  }

  // Get resume statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_resumes,
        AVG(rating)::NUMERIC(3,1) as average_rating,
        COUNT(CASE WHEN analysis_complete = true THEN 1 END) as analyzed_count,
        COUNT(CASE WHEN rating >= 8 THEN 1 END) as high_rating_count,
        COUNT(CASE WHEN rating >= 6 AND rating < 8 THEN 1 END) as medium_rating_count,
        COUNT(CASE WHEN rating < 6 THEN 1 END) as low_rating_count
      FROM resumes
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }

  // Get recent resumes
  static async getRecent(limit = 5) {
    return this.findAll({ limit, orderBy: 'upload_date', order: 'DESC' });
  }

  // Bulk delete
  static async bulkDelete(ids) {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const query = `DELETE FROM resumes WHERE id IN (${placeholders}) RETURNING id`;
    
    try {
      const result = await pool.query(query, ids);
      return result.rows.map(row => row.id);
    } catch (error) {
      throw new Error(`Error bulk deleting resumes: ${error.message}`);
    }
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      filename: this.filename,
      upload_date: this.upload_date,
      name: this.name,
      email: this.email,
      phone: this.phone,
      summary: this.summary,
      skills: this.skills,
      experience: this.experience,
      education: this.education,
      rating: this.rating,
      suggestions: this.suggestions,
      improvements: this.improvements,
      file_size: this.file_size,
      analysis_complete: this.analysis_complete
    };
  }
}

module.exports = Resume;