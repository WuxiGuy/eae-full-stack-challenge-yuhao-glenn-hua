/**
 * Dashboard Component
 * 
 * Main dashboard interface for the vehicle control system. Displays real-time
 * vehicle metrics and provides controls for vehicle operations.
 * 
 * Features:
 * - Real-time power and RPM gauges
 * - Vehicle status indicators
 * - Battery monitoring
 * - Temperature monitoring
 * - Motor speed control
 * - Charging control
 * - Engine control
 * - Brake hold control
 */

import React, { useState, useEffect } from 'react';
import PowerGauge from '../Gauges/PowerGauge';
import RPMGauge from '../Gauges/RPMGauge';
import Controls from '../Controls/Controls';
import './Dashboard.css';

/**
 * Interface defining the complete vehicle state
 * Matches the backend state structure
 */
interface VehicleState {
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

// API endpoint for the backend
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  console.error('REACT_APP_API_URL environment variable is not set');
}
console.log('API URL:', API_URL); // Debug log

/**
 * Dashboard Component
 * Manages the WebSocket connection and vehicle state
 */
const Dashboard: React.FC = () => {
  // Initialize vehicle state with default values
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    power: 0,
    rpm: 0,
    batteryPercentage: 22,
    batteryTemperature: 33,
    gearRatio: 'N/N',
    parkingBrake: false,
    checkEngine: false,
    motorWarning: false,
    batteryLow: false,
    isCharging: false,
    motorSpeed: 0,
    engineOn: false,
    brakeHold: false
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a state to track initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch vehicle state periodically
  useEffect(() => {
    const fetchState = async () => {
      try {
        console.log('Fetching state from:', `${API_URL}/state`);
        // Only show loading on initial load
        if (isInitialLoad) {
          setIsLoading(true);
        }
        
        const response = await fetch(`${API_URL}/state`);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        try {
          const data = JSON.parse(text);
          setVehicleState(data);
          setError(null);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          console.log('Received non-JSON response:', text);
          setError('Failed to parse server response');
        }
      } catch (error) {
        console.error('Error fetching vehicle state:', error);
        setError(`Failed to connect to vehicle system: ${error}`);
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    // Fetch immediately and then every second
    fetchState();
    const interval = setInterval(fetchState, 1000);

    return () => clearInterval(interval);
  }, []); // isInitialLoad doesn't need to be in dependencies as it only matters for first load

  const handleApiError = (error: any, action: string) => {
    console.error(`Error ${action}:`, error);
    setError(`Failed to ${action}. Please try again.`);
  };

  /**
   * Handles motor speed changes
   * @param speed - New motor speed value (0-4)
   */
  const handleSpeedChange = async (speed: number) => {
    try {
      const response = await fetch(`${API_URL}/control/motorSpeed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ speed })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVehicleState(data);
      setError(null);
    } catch (error) {
      handleApiError(error, 'set motor speed');
    }
  };

  /**
   * Toggles charging state
   */
  const handleChargingToggle = async () => {
    try {
      const response = await fetch(`${API_URL}/control/charging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCharging: !vehicleState.isCharging })
      });
      const data = await response.json();
      setVehicleState(data);
    } catch (error) {
      console.error('Error toggling charging:', error);
    }
  };

  /**
   * Toggles engine power state
   */
  const handleEngineToggle = async () => {
    try {
      const response = await fetch(`${API_URL}/control/engine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOn: !vehicleState.engineOn })
      });
      const data = await response.json();
      setVehicleState(data);
    } catch (error) {
      console.error('Error toggling engine:', error);
    }
  };

  /**
   * Toggles brake hold state
   */
  const handleBrakeHoldToggle = async () => {
    try {
      const response = await fetch(`${API_URL}/control/brakeHold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !vehicleState.brakeHold })
      });
      const data = await response.json();
      setVehicleState(data);
    } catch (error) {
      console.error('Error toggling brake hold:', error);
    }
  };

  /**
   * Handles temperature button click
   * Shows detailed temperature information
   */
  const handleTemperatureClick = async () => {
    try {
      const response = await fetch(`${API_URL}/control/temperature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ showDetails: true })
      });
      const data = await response.json();
      setVehicleState(data);
    } catch (error) {
      console.error('Error showing temperature details:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Only show loading when both isLoading AND isInitialLoad are true */}
      {isLoading && isInitialLoad && (
        <div className="dashboard-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
      
      {error && (
        <div className="dashboard-error">
          <div className="error-message">{error}</div>
          <button onClick={() => setError(null)} className="error-dismiss">Dismiss</button>
        </div>
      )}

      {/* Status Indicators Section */}
      <div className="status-line">
        <div className={`status-indicator parking ${vehicleState.brakeHold ? 'active' : ''}`}>P</div>
        <div className={`status-indicator engine-indicator ${vehicleState.engineOn ? 'active' : ''}`}>
          <div className="engine-circle">
            <div className="engine-text">E</div>
          </div>
        </div>
        <div className={`status-indicator ${vehicleState.motorSpeed > 0 ? 'active' : ''}`}>⚡</div>
        <div className={`status-indicator ${vehicleState.batteryLow ? 'active' : ''}`}>🔋</div>
      </div>

      {/* Main Gauges Section */}
      <div className="gauge-line">
        <div className="gauge-wrapper">
          <PowerGauge value={vehicleState.power} />
          <div className="gauge-label">kW</div>
        </div>
        <div className="gauge-wrapper">
          <RPMGauge value={vehicleState.rpm} />
          <div className="gauge-label">RPM</div>
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div className="info-line">
        <div className="info-item">
          <div className="info-icon">⚙️</div>
          <div className="info-value">{vehicleState.gearRatio}</div>
          <div className="info-unit">Ratio</div>
        </div>
        <div className="info-item">
          <div className="info-icon">🔋</div>
          <div className="info-value">{vehicleState.batteryPercentage}</div>
          <div className="info-unit">%</div>
        </div>
        <div className="info-item">
          <div className="info-icon">🌡️</div>
          <div className="info-value">{vehicleState.batteryTemperature}</div>
          <div className="info-unit">°C</div>
        </div>
        <div className="info-item">
          <div className="info-icon">⚡</div>
          <div className="info-value">{vehicleState.rpm}</div>
          <div className="info-unit">RPM</div>
        </div>
        <div className="info-item">
          <Controls
            motorSpeed={vehicleState.motorSpeed}
            isCharging={vehicleState.isCharging}
            engineOn={vehicleState.engineOn}
            brakeHold={vehicleState.brakeHold}
            onSpeedChange={handleSpeedChange}
            onChargingToggle={handleChargingToggle}
          />
        </div>
      </div>

      {/* Control Buttons Section */}
      <div className="control-line">
        <div className="control-group">
          <button className="control-button">⚙️</button>
          <button className="control-button">⚡</button>
          <button className="control-button temperature-button" onClick={handleTemperatureClick}>🌡️</button>
        </div>
        <div className="menu-grid">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="menu-dot" />
          ))}
        </div>
        <button
          className={`charging-button ${vehicleState.isCharging ? 'active' : ''}`}
          onClick={handleChargingToggle}
        >
          <div className="charging-icon" />
        </button>
      </div>

      {/* System Control Buttons */}
      <div className="system-controls">
        <button
          className={`system-button brake-hold ${vehicleState.brakeHold ? 'active' : ''}`}
          onClick={handleBrakeHoldToggle}
        >
          BRAKE HOLD
        </button>
        <button
          className={`system-button engine-power ${vehicleState.engineOn ? 'active' : ''}`}
          onClick={handleEngineToggle}
        >
          {vehicleState.engineOn ? 'ENGINE ON' : 'ENGINE OFF'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 