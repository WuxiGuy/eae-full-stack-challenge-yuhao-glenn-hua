import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

interface VehicleState {
  motorSpeed: number;
  isCharging: boolean;
  engineOn: boolean;
  brakeHoldOn: boolean;
  temperature: number;
}

const Dashboard: React.FC = () => {
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    motorSpeed: 0,
    isCharging: false,
    engineOn: false,
    brakeHoldOn: false,
    temperature: 20
  });

  const fetchVehicleState = async () => {
    try {
      const response = await fetch(`${API_URL}/state`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVehicleState(data);
    } catch (error) {
      console.error('Error fetching vehicle state:', error);
    }
  };

  const sendControl = async (action: string, value: any) => {
    try {
      const response = await fetch(`${API_URL}/control/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error sending ${action} control:`, error);
    }
  };

  useEffect(() => {
    fetchVehicleState();
    const interval = setInterval(fetchVehicleState, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Your existing JSX */}
    </div>
  );
};

export default Dashboard; 