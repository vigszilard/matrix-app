# Technical Interview Feedback Application

A collaborative web application for conducting technical interviews with real-time synchronization between two interviewers.

## Features

- **Landing Page**: Create new interview sessions with candidate and interviewer information
- **Real-time Collaboration**: Two interviewers can work simultaneously using Socket.IO
- **Dynamic Skill Assessment**: Skills and categories change based on specialization (Manual/Automation)
- **Scoring System**: Rate skills from 1-4 or N/A for both interviewers
- **Category Averages**: Automatic calculation of average scores per category
- **Comments**: Individual comments for each interviewer after each category
- **PDF Export**: Generate PDF reports of the interview feedback
- **Color Coding**: Visual distinction between Interviewer 1 (blue) and Interviewer 2 (green)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Real-time**: Socket.IO
- **PDF Generation**: html2canvas + jsPDF
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

You need to run two servers simultaneously:

1. **Start the Next.js development server** (in one terminal):
   ```bash
   npm run dev
   ```
   This will start the frontend on http://localhost:3000

2. **Start the Socket.IO server** (in another terminal):
   ```bash
   npm run socket-server
   ```
   This will start the Socket.IO server on http://localhost:3001

### Usage

1. **Create Interview Session**:
   - Go to http://localhost:3000
   - Fill in candidate name, interviewer 1, and interviewer 2
   - Click "Start New Interview"

2. **Share the Link**:
   - Copy the generated URL and share it with the second interviewer
   - Both interviewers can now collaborate in real-time

3. **Conduct Interview**:
   - Select specialization (Manual or Automation)
   - If Automation, select tools (Selenium, Cypress, Playwright)
   - Rate skills for both interviewers
   - Add comments after each category
   - Export to PDF when complete

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   └── competence/
│       └── page.tsx          # Main interview page
├── components/
│   └── PDFExport.tsx         # PDF export functionality
├── data/
│   └── skills.ts            # Skills and categories data
├── hooks/
│   └── useSocket.ts         # Socket.IO integration
├── lib/
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions

server/
└── socket-server.js         # Socket.IO server
```

## Skills and Categories

The application includes predefined skills organized in categories:

- **General Categories**: Programming, Testing Fundamentals, Problem Solving
- **Manual Testing**: Exploratory Testing, Usability Testing
- **Automation Tools**: Selenium, Cypress, Playwright specific skills

Skills are dynamically filtered based on the selected specialization and automation tools.

## Real-time Features

- Live synchronization of all form changes
- Connection status indicator
- Automatic data persistence
- Conflict-free collaboration

## PDF Export

The PDF export feature:
- Captures the entire interview form
- Generates multi-page PDFs for long forms
- Uses candidate name and date in filename
- Maintains formatting and styling

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run socket-server` - Start Socket.IO server
- `npm run lint` - Run linting
- `npm run format` - Format code

### Adding New Skills

To add new skills or categories, edit `src/data/skills.ts`:

```typescript
export const skills: Skill[] = [
  {
    id: 'new-skill',
    name: 'New Skill Name',
    category: 'category-id',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  }
];
```

## Future Enhancements

- Database persistence (currently in-memory)
- User authentication
- Interview templates
- Advanced analytics
- Azure deployment
- Mobile responsiveness improvements
