# Vehicle Dashboard Backend

Node.js/Express backend service for the Vehicle Dashboard System, designed to run on AWS Lambda with API Gateway integration.

## Features

- Vehicle state management
- Real-time metrics simulation
- MongoDB integration for state persistence
- RESTful API endpoints
- Error handling and logging
- AWS Lambda integration

## Prerequisites

- Node.js (v20.x)
- npm (v9 or later)
- MongoDB Atlas account
- AWS account with configured credentials
- AWS CLI installed and configured

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   PORT=3001
   MONGODB_URI=<your-mongodb-connection-string>
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will be available at http://localhost:3001

## Building for Production

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Create deployment package:
   ```bash
   zip -r function.zip . -x "*.git*" "src/*" "test/*"
   ```

## Project Structure

```
src/
├── config/           # Configuration files
├── models/           # MongoDB models
├── routes/           # API routes
├── services/         # Business logic
└── utils/            # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Build TypeScript code
- `npm run lint` - Lint code
- `npm run format` - Format code

## API Documentation

### Vehicle State
- GET `/state`
  - Returns current vehicle state
  - Response: Vehicle state object

### Control Endpoints
- POST `/control/engine`
  - Toggle engine state
  - Body: `{ state: boolean }`
  - Response: Updated engine state
  - Safety checks included

- POST `/control/brakeHold`
  - Manage brake hold system
  - Body: `{ state: boolean }`
  - Response: Updated brake state
  - Includes emergency brake functionality

- POST `/control/motorSpeed`
  - Update motor speed
  - Body: `{ speed: number }`
  - Range: 0-100
  - Safety limits enforced

- POST `/control/charging`
  - Toggle charging state
  - Body: `{ state: boolean }`
  - Response: Updated charging state

- POST `/control/temperature`
  - Adjust temperature
  - Body: `{ temperature: number }`
  - Range: 16-30°C

## Vehicle Simulator

The backend includes a vehicle simulator that:
- Simulates battery drain based on motor speed
- Manages charging state
- Controls engine state
- Handles brake hold system
- Monitors temperature

## AWS Deployment

1. Create Lambda function:
   - Runtime: Node.js 18.x
   - Handler: index.handler
   - Memory: 256 MB
   - Timeout: 30 seconds

2. Configure environment variables in Lambda:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   ```

3. Set up API Gateway:
   - Create HTTP API
   - Configure routes
   - Enable CORS
   - Deploy API

## Error Handling

The backend implements comprehensive error handling:
- Invalid requests
- Database connection issues
- Vehicle state validation
- AWS service integration errors

## Monitoring

- CloudWatch Logs for Lambda function
- MongoDB Atlas monitoring
- API Gateway metrics

## Security

- Environment variables for sensitive data
- MongoDB Atlas security features
- AWS IAM roles and policies
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
