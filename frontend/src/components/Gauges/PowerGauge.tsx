/**
 * PowerGauge Component
 * 
 * Specialized gauge component for displaying power output/input in kilowatts (kW).
 * Extends BaseGauge with specific configuration for power measurements.
 * Range: -1000 kW to 1000 kW
 * - Negative values indicate power input (charging)
 * - Positive values indicate power output (driving)
 */

import React from 'react';
import BaseGauge from './BaseGauge';

interface PowerGaugeProps {
  value: number;  // Current power value in kW
}

const PowerGauge: React.FC<PowerGaugeProps> = ({ value }) => {
  return (
    <BaseGauge
      value={value}
      min={-1000}
      max={1000}
      unit="kW"
      title="Power"
    />
  );
};

export default PowerGauge; 