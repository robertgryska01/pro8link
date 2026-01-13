// File: src/components/dashboard/RevenueMiniChart.tsx
'use client';

import React, { useRef, useCallback } from 'react';

type RevenuePoint = {
    label: string;
    value: number;
};
  
interface RevenueMiniChartProps {
    data: RevenuePoint[];
    height?: number;
    width?: number;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
}
  
export function RevenueMiniChart({
    data,
    height = 160,
    width = 420,
    onInteractionStart,
    onInteractionEnd,
}: RevenueMiniChartProps) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isInteractingRef = useRef(false);
    
    const padding = { top: 20, right: 20, bottom: 30, left: 20 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;

    if (data.length === 0) {
        return <svg width={width} height={height}></svg>;
    }
  
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));
  
    const scaleX = (i: number) =>
        padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2);
  
    const scaleY = (v: number) =>
        padding.top +
        chartHeight -
        ((v - min) / (max - min || 1)) * chartHeight;

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
  
    const path = data
      .map((d, i) => {
        const x = scaleX(i);
        const y = scaleY(d.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  
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
        <path
          d={path}
          fill="none"
          stroke="#4da3ff"
          strokeWidth={3}
          strokeLinecap="round"
        />
  
        {data.map((d, i) => (
          <text
            key={`${d.label}-${i}`}
            x={scaleX(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize={12}
            fill="rgba(255,255,255,0.5)"
          >
            {d.label}
          </text>
        ))}

        {activeIndex !== null && (
          <g>
            <line
              x1={scaleX(activeIndex)}
              y1={padding.top}
              x2={scaleX(activeIndex)}
              y2={padding.top + chartHeight}
              stroke="rgba(77, 163, 255, 0.5)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />

            <circle
              cx={scaleX(activeIndex)}
              cy={scaleY(data[activeIndex].value)}
              r={5}
              fill="#4da3ff"
              stroke="white"
              strokeWidth={2}
            />

            <g>
              <rect
                x={scaleX(activeIndex) - 35}
                y={scaleY(data[activeIndex].value) - 35}
                width={70}
                height={26}
                rx={6}
                fill="rgba(30, 45, 80, 0.95)"
                stroke="rgba(77, 163, 255, 0.6)"
                strokeWidth={1.5}
              />
              <text
                x={scaleX(activeIndex)}
                y={scaleY(data[activeIndex].value) - 18}
                textAnchor="middle"
                fontSize={13}
                fontWeight="600"
                fill="white"
              >
                {new Intl.NumberFormat('en-US').format(data[activeIndex].value)}
              </text>
            </g>
          </g>
        )}
      </svg>
    );
}
