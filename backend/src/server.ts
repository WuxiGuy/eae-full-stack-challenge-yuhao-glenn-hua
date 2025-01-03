import express, { Request, Response, NextFunction } from 'express';
import { VehicleSimulator } from './simulator/VehicleSimulator';
import connectDB from './config/database';
import VehicleState from './models/VehicleState';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const simulator = new VehicleSimulator('vehicle-1'); // Single vehicle instance

// Connect to MongoDB
connectDB();

// Enable CORS and JSON parsing
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',  // Frontend URL
    'http://localhost:3000'  // Local development
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Vehicle control endpoints
app.post('/control/motorSpeed', (req: Request, res: Response) => {
  const { speed } = req.body;
  simulator.setMotorSpeed(speed);
  res.json(simulator.getState());
});

app.post('/control/charging', (req: Request, res: Response) => {
  const { isCharging } = req.body;
  simulator.setCharging(isCharging);
  res.json(simulator.getState());
});

app.post('/control/engine', (req: Request, res: Response) => {
  const { isOn } = req.body;
  simulator.setEngine(isOn);
  res.json(simulator.getState());
});

app.post('/control/brakeHold', (req: Request, res: Response) => {
  const { isActive } = req.body;
  simulator.setBrakeHold(isActive);
  res.json(simulator.getState());
});

app.post('/control/temperature', (req: Request, res: Response) => {
  const { showDetails } = req.body;
  // Add any temperature-specific logic here if needed
  res.json(simulator.getState());
});

// Get current vehicle state
app.get('/state', async (req: Request, res: Response) => {
  try {
    console.log('Fetching vehicle state');
    const state = simulator.getState();
    console.log('Vehicle state:', state);
    res.json({
      status: 'ok',
      state,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /state endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching vehicle state',
      details: error.stack
    });
  }
});

// Monitoring endpoints
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Vehicle Dashboard Backend',
    endpoints: {
      '/': 'This info',
      '/state': 'Current vehicle state',
      '/control/motorSpeed': 'Set motor speed (POST)',
      '/control/charging': 'Set charging state (POST)',
      '/control/engine': 'Set engine state (POST)',
      '/control/brakeHold': 'Set brake hold state (POST)',
      '/control/temperature': 'Show temperature details (POST)'
    }
  });
});

// Export the app and simulator for Lambda
export { app, simulator }; 