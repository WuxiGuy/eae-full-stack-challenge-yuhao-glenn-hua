# Vehicle Dashboard Frontend

React-based frontend application for the Vehicle Dashboard System, providing real-time monitoring and control of vehicle systems.

## Features

- Real-time vehicle state monitoring
- Interactive controls for:
  - Motor speed
  - Engine state
  - Charging state
  - Brake hold
  - Temperature control
- Responsive design for various screen sizes
- Error handling and status indicators
- Automatic reconnection logic

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Modern web browser with JavaScript enabled

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API endpoint:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

## Development

Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The production-ready files will be in the `build` directory

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── styles/           # CSS styles
└── utils/            # Utility functions
```

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm run format` - Format code

## Component Documentation

### Dashboard
The main component that displays vehicle metrics and controls:
- Vehicle state monitoring
- Real-time updates
- Interactive controls
- Error handling

### Controls
Individual control components for:
- Engine Control:
  - Start/Stop engine with real-time feedback
  - Visual indicators for engine state
  - Safety checks before state changes
- Brake System:
  - Toggle brake hold for vehicle stops
  - Emergency brake activation
  - Visual indicators for brake state
- Motor speed adjustment
- Charging state management
- Temperature control

## API Integration

The frontend communicates with the backend API using HTTP requests:
- GET `/state` - Fetch current vehicle state
- POST `/control/engine` - Toggle engine state (on/off)
- POST `/control/brakeHold` - Activate/deactivate brake hold
- POST `/control/motorSpeed` - Update motor speed
- POST `/control/charging` - Toggle charging state
- POST `/control/temperature` - Adjust temperature

## Error Handling

The application includes comprehensive error handling:
- API connection errors
- Invalid state updates
- Network connectivity issues
- Automatic reconnection attempts

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
