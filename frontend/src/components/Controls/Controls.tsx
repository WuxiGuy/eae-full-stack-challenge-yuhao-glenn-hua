/**
 * Controls Component
 * 
 * Provides user interface controls for adjusting vehicle motor speed and charging state.
 * Features a slider for motor speed control (0-4) and a charging toggle button.
 * 
 * Props:
 * - motorSpeed: Current motor speed setting (0-4)
 * - isCharging: Current charging state
 * - engineOn: Current engine power state
 * - brakeHold: Current brake hold state
 * - onSpeedChange: Callback for motor speed changes
 * - onChargingToggle: Callback for charging state changes
 */

import React from 'react';
import './Controls.css';

interface ControlsProps {
  motorSpeed: number;      // Current motor speed (0-4)
  isCharging: boolean;     // Current charging state
  engineOn: boolean;       // Engine power state
  brakeHold: boolean;      // Brake hold state
  onSpeedChange: (speed: number) => void;  // Speed change handler
  onChargingToggle: () => void;            // Charging toggle handler
}

/**
 * Controls Component
 * Renders motor speed slider and charging toggle controls
 */
const Controls: React.FC<ControlsProps> = ({
  motorSpeed,
  isCharging,
  engineOn,
  brakeHold,
  onSpeedChange,
  onChargingToggle
}) => {
  /**
   * Handles slider input changes
   * Converts string value to number and calls onSpeedChange
   */
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(event.target.value));
  };

  const getDisabledReason = () => {
    if (isCharging) return "Cannot change speed while charging";
    if (!engineOn) return "Start the engine to change speed";
    if (brakeHold) return "Release brake hold to change speed";
    return "";
  };

  const isDisabled = isCharging || !engineOn || brakeHold;
  const disabledReason = getDisabledReason();

  return (
    <div className="controls">
      <div className="speed-control">
        <div className="speed-label">MOTOR SPEED SETTING</div>
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={motorSpeed}
          onChange={handleSliderChange}
          className="speed-slider"
          disabled={isDisabled}
        />
        <div className="speed-labels">
          <span>OFF</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
        {isDisabled && <div className="speed-disabled-message">{disabledReason}</div>}
      </div>
    </div>
  );
};

export default Controls; 