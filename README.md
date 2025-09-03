# Voice Notes Fullstack Application

A full-stack web application that allows users to create, manage, and organize voice notes with AI-powered features.

## Features

- Record and save voice notes
- Automatic speech-to-text transcription
- Responsive design for all devices
- AI-powered note summarization and analysis
- Edit voice notes
- Delete voice notes

## Tech Stack

### Frontend
- React.js
- React Hooks
- Axios for API calls
- React Toastify for notifications
- Date-fns for date manipulation
- CSS Modules for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Gemini AI for AI features

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account or local MongoDB instance
- Gemini API key

## Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
voice_notes/
├── backend/               # Backend server code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic and external services
│   │   ├── app.js         # Express app configuration
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── frontend/              # Frontend React application
    ├── public/            # Static files
    └── src/
        ├── components/    # Reusable UI components
        ├── services/      # API services
        ├── uiComponents/  # UI component library
        └── App.jsx        # Main application component
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm start` - Start the development server
- `npm run build` - Build for production

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Your Gemini API key
- `PORT`: Port to run the server on.

## Acknowledgments

- Gemini AI for their powerful API
- The React and Node.js communities
- All contributors who helped in building this application
