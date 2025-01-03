/**
 * Vehicle Simulator Module
 * 
 * This module simulates a vehicle's electrical and mechanical systems, providing real-time
 * state updates and handling various vehicle operations like motor speed control,
 * charging, and system monitoring.
 */

import { EventEmitter } from 'events';
import VehicleState from '../models/VehicleState';

/**
 * Interface defining the complete state of a vehicle
 * All numeric values are in their respective units (kW, RPM, %, °C)
 */
export interface IVehicleState {
  power: number;          // Power output/input in kW (-1000 to 1000)
  rpm: number;           // Motor RPM (0 to 800)
  batteryPercentage: number;  // Battery charge level (0 to 100)
  batteryTemperature: number; // Battery temperature in Celsius
  gearRatio: string;     // Current gear ratio (e.g., "1.5/3.0" or "N/N")
  parkingBrake: boolean; // Parking brake status
  checkEngine: boolean;  // Engine check warning status
  motorWarning: boolean; // Motor warning status
  batteryLow: boolean;   // Battery low warning status
  isCharging: boolean;   // Charging status
  motorSpeed: number;    // Motor speed setting (0 to 4)
  engineOn: boolean;     // Engine power status
  brakeHold: boolean;    // Brake hold feature status
}

/**
 * VehicleSimulator class
 * 
 * Simulates vehicle behavior and manages vehicle state. Provides real-time updates
 * through event emission and persists state to MongoDB.
 */
export class VehicleSimulator extends EventEmitter {
  private state: IVehicleState;
  private simulationInterval: NodeJS.Timeout | null = null;
  private readonly updateInterval = 100; // Update interval in milliseconds
  private readonly vehicleId: string;
  private lastSavedState: string = '';

  /**
   * Creates a new vehicle simulator instance
   * @param vehicleId - Unique identifier for the vehicle (defaults to 'vehicle-1')
   */
  constructor(vehicleId: string = 'vehicle-1') {
    super();
    this.vehicleId = vehicleId;
    this.state = {
      power: 0,
      rpm: 0,
      batteryPercentage: 100,
      batteryTemperature: 25,
      gearRatio: 'N/N',
      parkingBrake: false,
      checkEngine: false,
      motorWarning: false,
      batteryLow: false,
      isCharging: false,
      motorSpeed: 0,
      engineOn: false,
      brakeHold: false
    };
    this.startSimulation();
    this.initializeState();
  }

  /**
   * Initializes the vehicle state in the database
   * Creates or updates the initial state record
   */
  private async initializeState() {
    try {
      await VehicleState.findOneAndUpdate(
        { vehicleId: this.vehicleId },
        { ...this.state, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error initializing vehicle state:', error);
    }
  }

  /**
   * Calculates the gear ratio based on motor speed
   * @param speed - Current motor speed (0-4)
   * @returns Formatted gear ratio string (e.g., "1.5/3.0" or "N/N")
   */
  private calculateGearRatio(speed: number): string {
    if (speed === 0 || !this.state.engineOn) return 'N/N';
    const ratio = 1 + (speed - 1) * 0.5;
    return `${ratio.toFixed(1)}/${(ratio * 2).toFixed(1)}`;
  }

  /**
   * Starts the simulation loop
   * Updates vehicle state and emits state changes at regular intervals
   */
  private startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(async () => {
      const previousState = { ...this.state };
      this.updateState();
      
      // Only emit and save if state has changed
      const currentStateString = JSON.stringify(this.state);
      if (currentStateString !== this.lastSavedState) {
        // Round all numeric values before sending
        const roundedState = {
          ...this.state,
          power: Math.round(this.state.power),
          rpm: Math.round(this.state.rpm),
          batteryPercentage: Math.round(this.state.batteryPercentage),
          batteryTemperature: Math.round(this.state.batteryTemperature)
        };

        this.emit('stateUpdate', roundedState);
        this.lastSavedState = currentStateString;
        
        try {
          await VehicleState.findOneAndUpdate(
            { vehicleId: this.vehicleId },
            { ...roundedState, lastUpdated: new Date() },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error('Error updating vehicle state:', error);
        }
      }
    }, this.updateInterval);
  }

  /**
   * Updates the vehicle state based on current conditions
   * Handles all state transitions and calculations for:
   * - Battery management
   * - Power output
   * - Temperature monitoring
   * - Warning indicators
   */
  private updateState() {
    // Update battery low indicator
    this.state.batteryLow = this.state.batteryPercentage < 20;

    if (!this.state.engineOn) {
      this.state.power = 0;
      this.state.rpm = 0;
      this.state.motorSpeed = 0;
      this.state.gearRatio = 'N/N';
      return;
    }

    if (this.state.isCharging) {
      // Charging logic
      this.state.power = -50; // Charging at 50kW
      this.state.rpm = 0;
      const chargingRate = 2 * (this.updateInterval / 1000); // 2% per second
      this.state.batteryPercentage = Math.min(100, this.state.batteryPercentage + chargingRate);
      this.state.batteryTemperature = Math.max(25, this.state.batteryTemperature - 0.1);
      this.state.gearRatio = 'N/N';
    } else if (!this.state.brakeHold) {
      // Driving logic
      const speedFactor = this.state.motorSpeed / 4; // 0 to 1
      this.state.rpm = speedFactor * 800;
      this.state.power = speedFactor * 1000;
      this.state.gearRatio = this.calculateGearRatio(this.state.motorSpeed);
      
      // Battery consumption - 1% per second for speed 1, increasing with speed
      const batteryDrainRate = this.state.motorSpeed * (this.updateInterval / 1000); // Convert to rate per interval
      this.state.batteryPercentage = Math.max(0, this.state.batteryPercentage - batteryDrainRate);
      this.state.batteryTemperature = Math.min(80, 25 + speedFactor * 55);
    } else {
      // Brake hold active
      this.state.rpm = 0;
      this.state.power = 0;
      this.state.gearRatio = 'N/N';
    }

    // Update warning states
    this.state.motorWarning = this.state.rpm > 700;
    this.state.checkEngine = this.state.batteryTemperature > 75;
  }

  /**
   * Sets the motor speed
   * @param speed - Desired motor speed (0-4)
   */
  public setMotorSpeed(speed: number) {
    if (this.state.isCharging || !this.state.engineOn || this.state.brakeHold) return;
    this.state.motorSpeed = Math.max(0, Math.min(4, speed));
  }

  /**
   * Sets the charging state
   * @param charging - Whether to enable charging
   */
  public setCharging(charging: boolean) {
    this.state.isCharging = charging;
    if (charging) {
      this.state.motorSpeed = 0;
    }
  }

  /**
   * Sets the engine power state
   * @param on - Whether to turn the engine on/off
   */
  public setEngine(on: boolean) {
    this.state.engineOn = on;
    if (!on) {
      this.state.motorSpeed = 0;
      this.state.isCharging = false;
    }
  }

  /**
   * Sets the brake hold state
   * @param active - Whether to enable brake hold
   */
  public setBrakeHold(active: boolean) {
    this.state.brakeHold = active;
    if (active) {
      this.state.motorSpeed = 0;
    }
  }

  /**
   * Gets the current vehicle state with rounded values
   * @returns Current vehicle state
   */
  public getState(): IVehicleState {
    return {
      ...this.state,
      power: Math.round(this.state.power),
      rpm: Math.round(this.state.rpm),
      batteryPercentage: Math.round(this.state.batteryPercentage),
      batteryTemperature: Math.round(this.state.batteryTemperature)
    };
  }

  /**
   * Stops the simulation
   * Cleans up the update interval
   */
  public stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
} 