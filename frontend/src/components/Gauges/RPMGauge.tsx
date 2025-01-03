/**
 * RPMGauge Component
 * 
 * Specialized gauge component for displaying motor speed in revolutions per minute (RPM).
 * Extends BaseGauge with specific configuration for RPM measurements.
 * Range: 0 to 800 RPM
 * Features:
 * - Linear scale starting from zero
 * - Warning indicator at high RPM (>700)
 */

import React from 'react';
import BaseGauge from './BaseGauge';

interface RPMGaugeProps {
  value: number;  // Current RPM value
}

const RPMGauge: React.FC<RPMGaugeProps> = ({ value }) => {
  return (
    <BaseGauge
      value={value}
      min={0}
      max={800}
      unit="RPM"
      title="Motor Speed"
    />
  );
};

export default RPMGauge; 