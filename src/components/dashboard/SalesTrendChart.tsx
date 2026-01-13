// File: src/components/dashboard/SalesTrendChart.tsx
'use client';

import React, { useRef, useCallback } from 'react';

type SalesPoint = {
  label: string;
  value: number;
};

interface SalesTrendChartProps {
  data: SalesPoint[];
  height?: number;
  width?: number;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export function SalesTrendChart({
  data,
  height = 180,
  width = 360,
  onInteractionStart,
  onInteractionEnd,
}: SalesTrendChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef(false);

  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  if (data.length === 0) {
    return <svg width={width} height={height}></svg>;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  const scaleX = (i: number) =>
    padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2);

  const scaleY = (v: number) =>
    padding.top + chartHeight - (maxValue > 0 ? (v / maxValue) * chartHeight : chartHeight);

  const getDataIndexFromPosition = useCallback((x: number) => {
    const dataIndex = Math.round(((x - padding.left) / chartWidth) * (data.length - 1));
    return dataIndex >= 0 && dataIndex < data.length ? dataIndex : null;
  }, [data.length, padding.left, chartWidth]);

  const handleInteractionMove = useCallback((x: number) => {
    if (isInteractingRef.current) {
      const dataIndex = getDataIndexFromPosition(x);
      if (dataIndex !== null) {
        setActiveIndex(dataIndex);
      }
    }
  }, [getDataIndexFromPosition]);

  const startLongPress = useCallback((x: number) => {
    longPressTimerRef.current = setTimeout(() => {
      isInteractingRef.current = true;
      onInteractionStart?.();
      const dataIndex = getDataIndexFromPosition(x);
      if (dataIndex !== null) {
        setActiveIndex(dataIndex);
      }
    }, 200);
  }, [onInteractionStart, getDataIndexFromPosition]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isInteractingRef.current) {
      isInteractingRef.current = false;
      onInteractionEnd?.();
      setActiveIndex(null);
    }
  }, [onInteractionEnd]);

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    startLongPress(x);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    handleInteractionMove(x);
  };

  const handleTouchEnd = () => {
    cancelLongPress();
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    startLongPress(x);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    handleInteractionMove(x);
  };

  const handleMouseUp = () => {
    cancelLongPress();
  };

  const handleMouseLeave = () => {
    cancelLongPress();
  };

  const linePath = data
    .map((d, i) => {
      const x = scaleX(i);
      const y = scaleY(d.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `
    ${linePath}
    L ${scaleX(data.length - 1)} ${padding.top + chartHeight}
    L ${scaleX(0)} ${padding.top + chartHeight}
    Z
  `;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ touchAction: 'none' }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4fd1ff" />
          <stop offset="100%" stopColor="#4cff8f" />
        </linearGradient>

        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4cff8f" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#4cff8f" stopOpacity={0} />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map(p => (
        <line
          key={p}
          x1={padding.left}
          x2={padding.left + chartWidth}
          y1={padding.top + chartHeight * p}
          y2={padding.top + chartHeight * p}
          stroke="rgba(255,255,255,0.1)"
        />
      ))}

      <path d={areaPath} fill="url(#areaGradient)" />

      <path
        d={linePath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {data.map((d, i) => (
        <text
          key={`${d.label}-${i}`}
          x={scaleX(i)}
          y={height - 8}
          textAnchor="middle"
          fontSize={11}
          fill="rgba(255,255,255,0.6)"
        >
          {d.label}
        </text>
      ))}

      {activeIndex !== null && (() => {
        const pointY = scaleY(data[activeIndex].value);
        const tooltipHeight = 26;
        const tooltipY = pointY - 35;
        const shouldFlip = tooltipY < padding.top;
        const finalTooltipY = shouldFlip ? pointY + 10 : tooltipY;

        return (
          <g>
            <line
              x1={scaleX(activeIndex)}
              y1={padding.top}
              x2={scaleX(activeIndex)}
              y2={padding.top + chartHeight}
              stroke="rgba(76, 255, 143, 0.5)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />

            <circle
              cx={scaleX(activeIndex)}
              cy={pointY}
              r={5}
              fill="#4cff8f"
              stroke="white"
              strokeWidth={2}
            />

            <g>
              <rect
                x={scaleX(activeIndex) - 35}
                y={finalTooltipY}
                width={70}
                height={tooltipHeight}
                rx={6}
                fill="rgba(30, 45, 80, 0.95)"
                stroke="rgba(76, 255, 143, 0.6)"
                strokeWidth={1.5}
              />
              <text
                x={scaleX(activeIndex)}
                y={finalTooltipY + 17}
                textAnchor="middle"
                fontSize={13}
                fontWeight="600"
                fill="white"
              >
                {new Intl.NumberFormat('en-US').format(data[activeIndex].value)}
              </text>
            </g>
          </g>
        );
      })()}
    </svg>
  );
}
