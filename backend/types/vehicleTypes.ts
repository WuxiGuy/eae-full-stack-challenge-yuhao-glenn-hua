export interface VehicleState {
  connectionId: string;
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
  lastUpdated: number;
}

export interface WebSocketMessage {
  action: 'updateState' | 'connect' | 'disconnect' | 'setSpeed' | 'setCharging';
  data?: any;
}

export interface SpeedChangeMessage {
  speed: number;
}

export interface ChargingMessage {
  isCharging: boolean;
}

export interface StateUpdateMessage {
  state: Partial<VehicleState>;
} 