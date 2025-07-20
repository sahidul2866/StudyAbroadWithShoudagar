const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

// Generate document using AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { type, formData, customPrompt } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt = '';
    
    switch (type) {
      case 'sop':
        prompt = `
          Generate a Statement of Purpose for a student applying to study abroad.
          
          Student Information:
          - Name: ${formData.name}
          - Target University: ${formData.university}
          - Program: ${formData.program}
          - Target Country: ${formData.country}
          - Academic Background: ${formData.academicBackground}
          - Work Experience: ${formData.workExperience}
          - Career Goals: ${formData.careerGoals}
          - Why this program: ${formData.whyProgram}
          - Why this university: ${formData.whyUniversity}
          
          Additional Information: ${formData.additionalInfo || ''}
          
          Create a professional, compelling Statement of Purpose that:
          1. Has a strong opening hook
          2. Clearly outlines academic background and achievements
          3. Explains motivation for choosing the specific program and university
          4. Demonstrates career goals and how the program aligns with them
          5. Shows personality and unique perspective
          6. Has proper structure and flow
          7. Is approximately 800-1000 words
          
          Make it personal, authentic, and persuasive.
        `;
        break;
        
      case 'resume':
        prompt = `
          Create a professional resume for a student applying for study abroad programs.
          
          Personal Information:
          - Name: ${formData.name}
          - Email: ${formData.email}
          - Phone: ${formData.phone}
          - Address: ${formData.address}
          
          Education: ${formData.education}
          Work Experience: ${formData.workExperience}
          Skills: ${formData.skills}
          Achievements: ${formData.achievements}
          Certifications: ${formData.certifications}
          Languages: ${formData.languages}
          
          Create a well-structured, ATS-friendly resume suitable for international applications.
        `;
        break;
        
      case 'cover-letter':
        prompt = `
          Generate a cover letter for a student application.
          
          Details:
          - Applicant Name: ${formData.name}
          - Position/Program: ${formData.position}
          - Institution: ${formData.institution}
          - Key Qualifications: ${formData.qualifications}
          - Motivation: ${formData.motivation}
          
          Create a professional, engaging cover letter.
        `;
        break;
        
      default:
        if (customPrompt) {
          prompt = customPrompt;
        } else {
          return res.status(400).json({ message: 'Invalid document type or missing prompt' });
        }
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedContent = response.text();

    // Save the generated document
    const document = new Document({
      userId: req.user._id,
      type,
      title: `${type.toUpperCase()} - ${new Date().toLocaleDateString()}`,
      content: generatedContent,
      formData,
      isAiGenerated: true,
      aiPrompt: prompt,
      targetUniversity: formData.university,
      targetProgram: formData.program,
      targetCountry: formData.country,
      status: 'draft'
    });

    await document.save();

    res.json({
      message: 'Document generated successfully',
      document: {
        id: document._id,
        type: document.type,
        title: document.title,
        content: generatedContent,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({ message: 'Error generating document' });
  }
});

// Get document templates
router.get('/templates', (req, res) => {
  const templates = {
    sop: [
      {
        id: 'sop-template-1',
        name: 'Academic Focus Template',
        description: 'Emphasizes academic achievements and research interests'
      },
      {
        id: 'sop-template-2',
        name: 'Professional Experience Template',
        description: 'Highlights work experience and career goals'
      },
      {
        id: 'sop-template-3',
        name: 'Personal Journey Template',
        description: 'Focuses on personal growth and unique experiences'
      }
    ],
    resume: [
      {
        id: 'resume-template-1',
        name: 'Modern Professional',
        description: 'Clean, modern design suitable for most fields'
      },
      {
        id: 'resume-template-2',
        name: 'Academic CV',
        description: 'Detailed format for academic positions'
      },
      {
        id: 'resume-template-3',
        name: 'Creative Design',
        description: 'Visual appeal for creative fields'
      }
    ],
    'cover-letter': [
      {
        id: 'cover-letter-template-1',
        name: 'Standard Business',
        description: 'Professional business format'
      },
      {
        id: 'cover-letter-template-2',
        name: 'Academic Application',
        description: 'Tailored for academic programs'
      }
    ]
  };

  res.json({ templates });
});

// Get user's documents
router.get('/my-documents', auth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;
    
    const documents = await Document.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Exclude content for list view

    const totalDocs = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDocs / limit),
        totalDocuments: totalDocs
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// Get specific document
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Error fetching document' });
  }
});

// Save/update document
router.post('/save', auth, async (req, res) => {
  try {
    const { id, type, title, content, status } = req.body;
    
    if (id) {
      // Update existing document
      const document = await Document.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { 
          title, 
          content, 
          status: status || 'draft',
          version: { $inc: 1 },
          $push: {
            previousVersions: {
              content: content,
              version: '$version',
              createdAt: new Date()
            }
          }
        },
        { new: true }
      );

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json({ message: 'Document updated successfully', document });
    } else {
      // Create new document
      const document = new Document({
        userId: req.user._id,
        type,
        title,
        content,
        status: status || 'draft'
      });

      await document.save();
      res.status(201).json({ message: 'Document saved successfully', document });
    }
  } catch (error) {
    console.error('Save document error:', error);
    res.status(500).json({ message: 'Error saving document' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

// Share document
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { email, role = 'reviewer' } = req.body;
    
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $push: {
          sharedWith: {
            email,
            role,
            sharedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document shared successfully' });
  } catch (error) {
    console.error('Share document error:', error);
    res.status(500).json({ message: 'Error sharing document' });
  }
});

module.exports = router;