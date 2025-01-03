import React from 'react';
import './StatusIndicators.css';

interface StatusIndicatorsProps {
  parkingBrake: boolean;
  checkEngine: boolean;
  motorWarning: boolean;
  batteryLow: boolean;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  parkingBrake,
  checkEngine,
  motorWarning,
  batteryLow
}) => {
  return (
    <div className="status-indicators">
      <div className={`indicator ${parkingBrake ? 'active' : ''}`}>
        <div className="indicator-icon parking-brake">P</div>
      </div>
      <div className={`indicator ${checkEngine ? 'active' : ''}`}>
        <div className="indicator-icon check-engine">⚙️</div>
      </div>
      <div className={`indicator ${motorWarning ? 'active' : ''}`}>
        <div className="indicator-icon motor-warning">⚡</div>
      </div>
      <div className={`indicator ${batteryLow ? 'active' : ''}`}>
        <div className="indicator-icon battery-low">🔋</div>
      </div>
    </div>
  );
};

export default StatusIndicators; 