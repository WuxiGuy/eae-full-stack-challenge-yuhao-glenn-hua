# Vehicle Dashboard System

A real-time vehicle monitoring dashboard system built with React frontend and Node.js/Express backend, deployed on AWS infrastructure.

## System Architecture

- **Frontend**: React-based dashboard with real-time vehicle metrics display
- **Backend**: Node.js/Express API with AWS Lambda integration
- **Database**: MongoDB for vehicle state persistence
- **Infrastructure**: AWS (Lambda, API Gateway, S3) for serverless deployment

## Project Structure

```
.
├── frontend/         # React frontend application
├── backend/          # Node.js/Express backend application
└── infrastructure/   # AWS CloudFormation templates
```

## Prerequisites

- Node.js (v20.x)
- npm (v9 or later)
- AWS CLI configured with appropriate credentials
- MongoDB Atlas account
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/WuxiGuy/eae-full-stack-challenge-yuhao-glenn-hua.git
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables with your values

3. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

4. Start development servers:
   ```bash
   # Start frontend (in frontend directory)
   npm start

   # Start backend (in backend directory)
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

6. Access the database
   - Download MongoDB Compass
   - Add new connection with provided url

## Deployment

### Frontend Deployment (AWS S3)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to S3:
   - Upload the contents of `frontend/build` to your S3 bucket
   - Configure the bucket for static website hosting

### Backend Deployment (AWS Lambda)

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Create deployment package:
   ```bash
   zip -r function.zip . -x "*.git*" "src/*" "test/*"
   ```

3. Deploy to AWS Lambda:
   - Upload `function.zip` to your Lambda function
   - Set handler to `index.handler`
   - Configure environment variables
   - Set memory to 256 MB and timeout to 30 seconds

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
MONGODB_URI=<your-mongodb-connection-string>
```

## Features

- Real-time vehicle metrics monitoring
- Interactive vehicle controls:
  - Engine Control: Start/Stop engine with real-time state feedback
  - Brake System: Toggle brake hold for safety during stops
  - Motor Speed Control: Adjust vehicle speed in real-time
  - Charging Management: Monitor and control charging state
  - Temperature Control: Adjust vehicle temperature
- Persistent state storage
- Responsive design
- Error handling and reconnection logic

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Format code: `npm run format`

## License

MIT License - see LICENSE file for details
