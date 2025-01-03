import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleState extends Document {
  vehicleId: string;  // Identifier for the vehicle
  power: number;
  rpm: number;
  batteryPercentage: number;
  batteryTemperature: number;
  gearRatio: string;
  parkingBrake: boolean;
  checkEngine: boolean;
  motorWarning: boolean;
  batteryLow: boolean;
  isCharging: boolean;
  motorSpeed: number;
  lastUpdated: Date;
}

const VehicleStateSchema: Schema = new Schema({
  vehicleId: { type: String, required: true, unique: true },  // Ensure only one state per vehicle
  power: { type: Number, required: true },
  rpm: { type: Number, required: true },
  batteryPercentage: { type: Number, required: true },
  batteryTemperature: { type: Number, required: true },
  gearRatio: { type: String, required: true },
  parkingBrake: { type: Boolean, required: true },
  checkEngine: { type: Boolean, required: true },
  motorWarning: { type: Boolean, required: true },
  batteryLow: { type: Boolean, required: true },
  isCharging: { type: Boolean, required: true },
  motorSpeed: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IVehicleState>('VehicleState', VehicleStateSchema); 