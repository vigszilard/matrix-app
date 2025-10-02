import { Server } from 'socket.io';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import skills and categories data
const skillsPath = join(__dirname, '../src/data/skills.ts');
let skills = [];
let categories = [];

try {
  // For now, we'll define the data directly since we can't easily import TypeScript
  skills = [
    // General Programming
    { id: 'javascript-basics', name: 'JavaScript Basics', category: 'general-programming', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'css-selectors', name: 'CSS Selectors', category: 'general-programming', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'html-knowledge', name: 'HTML Knowledge', category: 'general-programming', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    
    // Testing Fundamentals
    { id: 'test-design', name: 'Test Design', category: 'testing-fundamentals', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'bug-reporting', name: 'Bug Reporting', category: 'testing-fundamentals', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'test-planning', name: 'Test Planning', category: 'testing-fundamentals', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    
    // Problem Solving
    { id: 'debugging-skills', name: 'Debugging Skills', category: 'problem-solving', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'analytical-thinking', name: 'Analytical Thinking', category: 'problem-solving', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    
    // Manual Testing
    { id: 'exploratory-testing', name: 'Exploratory Testing', category: 'manual-testing', applicableTo: ['manual'] },
    { id: 'usability-testing', name: 'Usability Testing', category: 'manual-testing', applicableTo: ['manual'] },
    
    // Selenium Specific
    { id: 'selenium-webdriver', name: 'Selenium WebDriver', category: 'selenium-specific', applicableTo: ['selenium'] },
    { id: 'selenium-grid', name: 'Selenium Grid', category: 'selenium-specific', applicableTo: ['selenium'] },
    { id: 'selenium-waits', name: 'Selenium Waits', category: 'selenium-specific', applicableTo: ['selenium'] },
    
    // Cypress Specific
    { id: 'cypress-basics', name: 'Cypress Basics', category: 'cypress-specific', applicableTo: ['cypress'] },
    { id: 'cypress-fixtures', name: 'Cypress Fixtures', category: 'cypress-specific', applicableTo: ['cypress'] },
    { id: 'cypress-commands', name: 'Cypress Commands', category: 'cypress-specific', applicableTo: ['cypress'] },
    
    // Playwright Specific
    { id: 'playwright-basics', name: 'Playwright Basics', category: 'playwright-specific', applicableTo: ['playwright'] },
    { id: 'playwright-trace', name: 'Playwright Trace', category: 'playwright-specific', applicableTo: ['playwright'] },
    { id: 'playwright-debugging', name: 'Playwright Debugging', category: 'playwright-specific', applicableTo: ['playwright'] }
  ];

  categories = [
    { id: 'general-programming', name: 'General Programming', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'testing-fundamentals', name: 'Testing Fundamentals', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'problem-solving', name: 'Problem Solving', applicableTo: ['manual', 'selenium', 'cypress', 'playwright'] },
    { id: 'manual-testing', name: 'Manual Testing', applicableTo: ['manual'] },
    { id: 'selenium-specific', name: 'Selenium Specific', applicableTo: ['selenium'] },
    { id: 'cypress-specific', name: 'Cypress Specific', applicableTo: ['cypress'] },
    { id: 'playwright-specific', name: 'Playwright Specific', applicableTo: ['playwright'] }
  ];
} catch (error) {
  console.error('Error loading skills data:', error);
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store interview sessions in memory (in production, use a database)
const interviewSessions = new Map();

// Helper function to get applicable skills based on specialization and tools
function getApplicableSkills(specialization, automationTools = []) {
  return skills.filter(skill => {
    if (specialization === 'manual') {
      return skill.applicableTo.includes('manual');
    } else if (specialization === 'automation') {
      return automationTools.some(tool => skill.applicableTo.includes(tool));
    }
    return false;
  });
}

// Helper function to get applicable categories
function getApplicableCategories(specialization, automationTools = []) {
  return categories.filter(cat => {
    if (specialization === 'manual') {
      return cat.applicableTo.includes('manual');
    } else if (specialization === 'automation') {
      return automationTools.some(tool => cat.applicableTo.includes(tool));
    }
    return false;
  });
}

// Helper function to initialize skills and comments
function initializeSkillsAndComments(specialization, automationTools = []) {
  const applicableSkills = getApplicableSkills(specialization, automationTools);
  const applicableCategories = getApplicableCategories(specialization, automationTools);
  
  const initialSkills = applicableSkills.map(skill => ({
    skillId: skill.id,
    interviewer1Score: null,
    interviewer2Score: null
  }));
  
  const initialComments = applicableCategories.map(cat => ({
    categoryId: cat.id,
    interviewer1Comment: '',
    interviewer2Comment: ''
  }));
  
  return { skills: initialSkills, comments: initialComments };
}

io.on('connection', (socket) => {
  // Join interview room
  socket.on('join-interview', (interviewData) => {
    const { id: interviewId, candidateName, interviewer1, interviewer2 } = interviewData;
    socket.join(interviewId);
    
    // Get or create interview data
    let currentData = interviewSessions.get(interviewId);
    if (!currentData) {
      // Create new interview session
      currentData = {
        id: interviewId,
        candidateName,
        interviewer1,
        interviewer2,
        specialization: null,
        automationTools: [],
        skills: [],
        comments: []
      };
      interviewSessions.set(interviewId, currentData);
    }
    
    // Send current interview data to the newly joined user
    socket.emit('interview-data', currentData);
  });

  // Handle interview data updates
  socket.on('update-interview', (data) => {
    const { interviewId, interviewData } = data;
    
    // Store the updated data
    interviewSessions.set(interviewId, interviewData);
    
    // Broadcast to all users in the room except the sender
    socket.to(interviewId).emit('interview-data', interviewData);
  });

  // Handle specialization changes
  socket.on('update-specialization', (data) => {
    const { interviewId, specialization } = data;
    const currentData = interviewSessions.get(interviewId);
    
    if (currentData) {
      const { skills: initialSkills, comments: initialComments } = initializeSkillsAndComments(specialization, currentData.automationTools);
      
      const updatedData = {
        ...currentData,
        specialization,
        automationTools: specialization === 'automation' ? [] : [],
        skills: initialSkills,
        comments: initialComments
      };
      
      interviewSessions.set(interviewId, updatedData);
      io.to(interviewId).emit('interview-data', updatedData);
    }
  });

  // Handle automation tools changes
  socket.on('update-automation-tools', (data) => {
    const { interviewId, automationTools } = data;
    const currentData = interviewSessions.get(interviewId);
    
    if (currentData && currentData.specialization === 'automation') {
      const { skills: initialSkills, comments: initialComments } = initializeSkillsAndComments(currentData.specialization, automationTools);
      
      const updatedData = {
        ...currentData,
        automationTools,
        skills: initialSkills,
        comments: initialComments
      };
      
      interviewSessions.set(interviewId, updatedData);
      io.to(interviewId).emit('interview-data', updatedData);
    }
  });

  // Handle skill score changes
  socket.on('update-skill-score', (data) => {
    const { interviewId, skillId, interviewer, score } = data;
    const currentData = interviewSessions.get(interviewId);
    
    if (currentData) {
      const updatedSkills = currentData.skills.map(skill => 
        skill.skillId === skillId 
          ? { ...skill, [`${interviewer}Score`]: score }
          : skill
      );
      
      const updatedData = {
        ...currentData,
        skills: updatedSkills
      };
      
      interviewSessions.set(interviewId, updatedData);
      io.to(interviewId).emit('interview-data', updatedData);
    }
  });

  // Handle comment changes
  socket.on('update-comment', (data) => {
    const { interviewId, categoryId, interviewer, comment } = data;
    const currentData = interviewSessions.get(interviewId);
    
    if (currentData) {
      const updatedComments = currentData.comments.map(cat => 
        cat.categoryId === categoryId 
          ? { ...cat, [`${interviewer}Comment`]: comment }
          : cat
      );
      
      const updatedData = {
        ...currentData,
        comments: updatedComments
      };
      
      interviewSessions.set(interviewId, updatedData);
      io.to(interviewId).emit('interview-data', updatedData);
    }
  });

  socket.on('disconnect', () => {
    // User disconnected
  });
});

// Add manual cleanup endpoint for testing
httpServer.on('request', (req, res) => {
  // Skip if this is a Socket.IO request
  if (req.url.startsWith('/socket.io/')) {
    return;
  }
  
  // Add CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/session-stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      activeSessions: interviewSessions.size,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      uptime: Math.round(process.uptime()) + 's'
    }));
    return;
  }
  
  if (req.url === '/active-sessions' && req.method === 'GET') {
    const sessions = Array.from(interviewSessions.values()).map(session => ({
      id: session.id,
      candidateName: session.candidateName,
      interviewer1: session.interviewer1,
      interviewer2: session.interviewer2,
      specialization: session.specialization,
      automationTools: session.automationTools
    }));
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sessions));
    return;
  }
  
  if (req.url.startsWith('/terminate-session/') && req.method === 'POST') {
    const sessionId = req.url.split('/')[2];
    const session = interviewSessions.get(sessionId);
    
    if (session) {
      interviewSessions.delete(sessionId);
      
      // Notify all clients in the session that it's been terminated
      io.to(sessionId).emit('session-terminated', { message: 'Session has been terminated' });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'Session terminated successfully',
        sessionId: sessionId,
        candidateName: session.candidateName
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Session not found' }));
    }
    return;
  }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  httpServer.close(() => {
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
