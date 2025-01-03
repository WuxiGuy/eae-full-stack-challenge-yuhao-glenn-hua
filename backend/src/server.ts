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
connectDB().catch(err => {
  console.warn('Warning: Running without MongoDB connection:', err.message);
});

// Enable CORS and JSON parsing
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
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
    // console.log('Fetching vehicle state');
    const state = simulator.getState();
    // console.log('Vehicle state:', state);
    // Send just the state object to match frontend expectations
    res.json(state);
  } catch (error: any) {
    console.error('Error in /state endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching vehicle state'
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

// Add this line to listen on the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app and simulator for Lambda
export { app, simulator }; 