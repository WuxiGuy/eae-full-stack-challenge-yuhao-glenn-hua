/**
 * BaseGauge Component
 * 
 * A reusable circular gauge component built with D3.js for displaying vehicle metrics.
 * Features include:
 * - Circular design with customizable range
 * - Animated transitions
 * - Scale with major and minor ticks
 * - Value display with units
 * - Gradient background
 * 
 * Props:
 * - value: Current value to display
 * - min: Minimum value of the scale
 * - max: Maximum value of the scale
 * - unit: Unit of measurement
 * - title: Title of the gauge
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Gauges.css';

interface BaseGaugeProps {
  value: number;      // Current value to display
  min: number;        // Minimum scale value
  max: number;        // Maximum scale value
  unit: string;       // Unit of measurement
  title: string;      // Gauge title
}

/**
 * Interface for arc data used by D3
 */
interface ArcDatum {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

/**
 * BaseGauge Component
 * Core gauge implementation using D3.js
 */
const BaseGauge: React.FC<BaseGaugeProps> = ({
  value,
  min,
  max,
  unit,
  title
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = 300;  // SVG size in pixels
  const margin = 40; // Margin for labels
  const radius = (size - 2 * margin) / 2;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${size / 2}, ${size / 2})`);

    // Create gradient definitions
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', `gauge-gradient-${title}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', -radius).attr('y1', 0)
      .attr('x2', radius).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2a2a2a');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3a3a3a');

    // Create arc generators
    const backgroundArc = d3.arc<ArcDatum>()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI)
      .endAngle(Math.PI);

    const valueArc = d3.arc<ArcDatum>()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI)
      .endAngle((value - min) / (max - min) * 2 * Math.PI - Math.PI);

    // Draw background arc
    svg.append('path')
      .datum({
        startAngle: -Math.PI,
        endAngle: Math.PI,
        innerRadius: radius - 20,
        outerRadius: radius
      })
      .attr('class', 'gauge-background')
      .attr('d', backgroundArc)
      .style('fill', `url(#gauge-gradient-${title})`);

    // Draw value arc with transition
    svg.append('path')
      .datum({
        startAngle: -Math.PI,
        endAngle: (value - min) / (max - min) * 2 * Math.PI - Math.PI,
        innerRadius: radius - 20,
        outerRadius: radius
      })
      .attr('class', 'gauge-value')
      .attr('d', valueArc)
      .style('fill', '#4CAF50');

    // Add ticks and labels
    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([-150, 150]);

    const ticks = scale.ticks(10);

    // Draw tick marks
    svg.selectAll('.tick')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'tick')
      .attr('x1', 0)
      .attr('y1', -radius + 25)
      .attr('x2', 0)
      .attr('y2', -radius + 15)
      .attr('transform', d => `rotate(${scale(d)})`)
      .style('stroke', 'rgba(255, 255, 255, 0.3)')
      .style('stroke-width', 2);

    // Add tick labels
    svg.selectAll('.tick-label')
      .data(ticks)
      .enter()
      .append('text')
      .attr('class', 'tick-label')
      .attr('x', d => (radius - 35) * Math.sin(scale(d) * Math.PI / 180))
      .attr('y', d => -(radius - 35) * Math.cos(scale(d) * Math.PI / 180))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '12px');

    // Add value display
    svg.append('text')
      .attr('class', 'value-text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '24px')
      .text(Math.round(value));

    // Add unit label
    svg.append('text')
      .attr('class', 'unit-text')
      .attr('x', 0)
      .attr('y', 45)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '14px')
      .text(unit);

  }, [value, min, max, unit, title, radius]);

  return (
    <div className="gauge">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BaseGauge; 