import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './SearchKnob.css';

interface SearchKnobProps {
  onSearch?: (query: string) => void;
  className?: string;
  isDark?: boolean;
}

const SearchKnob: React.FC<SearchKnobProps> = ({ onSearch, className, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const width = 240;
  const height = 40;
  const circleRadius = 12;
  const circleCenterX = width - 20; // 220
  const circleCenterY = 20;

  // Animation controls
  const lineControls = useAnimation();
  const uiControls = useAnimation();

  // Ensure initial state matches
  useEffect(() => {
    lineControls.set({ d: `M ${circleCenterX} ${circleCenterY} L ${circleCenterX + 8} ${circleCenterY + 8}` });
    uiControls.set({ opacity: 0 });
  }, []);

  useEffect(() => {
    const sequence = async () => {
      const cx = circleCenterX;
      const cy = circleCenterY;
      
      const path0 = `M ${cx} ${cy} L ${cx + 8} ${cy + 8}`; // Closed tail, strictly inside radius 12
      const path1 = `M ${cx - 8} ${cy - 8} L ${cx + 8} ${cy + 8}`; // Diagonal diameter
      const path2 = `M ${cx - 12} ${cy} L ${cx + 12} ${cy}`; // Horizontal diameter
      const path3 = `M 20 ${cy} L ${cx - 12} ${cy}`; // Fully open bar, stops at left edge of circle

      if (isOpen) {
        // Focus input after opening
        if (inputRef.current) inputRef.current.focus();

        // Fade in UI elements slightly delayed
        uiControls.start({ opacity: 1, transition: { duration: 0.3, delay: 0.3 } });

        // Single seamless morphing animation
        await lineControls.start({
          d: [path0, path1, path2, path3],
          transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }
        });
      } else {
        // Fade out UI elements immediately
        uiControls.start({ opacity: 0, transition: { duration: 0.2 } });

        // Single seamless morphing animation in reverse
        await lineControls.start({
          d: [path3, path2, path1, path0],
          transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }
        });
      }
    };

    sequence();
  }, [isOpen, lineControls, uiControls, circleCenterX, circleCenterY]);



  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setQuery('');
      if (onSearch) onSearch('');
    } else {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleToggle();
    } else if (e.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  const strokeColor = isDark ? '#ffffff' : '#000000';

  return (
    <div className={`search-knob ${isOpen ? 'open' : 'closed'} ${className || ''}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="knob-svg"
      >
        {/* The Circle (static shape) */}
        <circle
          cx={circleCenterX}
          cy={circleCenterY}
          r={circleRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* The Morphing Line (tail -> bar) */}
        <motion.path
          animate={lineControls}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Small 'x' Inside the Circle (fades in) */}
        <motion.path
          animate={uiControls}
          d="M -4 -4 l 8 8 M 4 -4 l -8 8" // Simple X
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          className="clear-icon"
          transform={`translate(${circleCenterX}, ${circleCenterY})`}
          style={{ pointerEvents: 'none' }}
        />

        {/* Invisible clickable area to make it easier to click */}
        <rect
          x={circleCenterX - 20}
          y={circleCenterY - 20}
          width={40}
          height={40}
          fill="transparent"
          onClick={handleToggle}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        />
      </svg>
      
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onSearch) onSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Explore"
        className="search-knob-input"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          color: strokeColor,
          caretColor: strokeColor,
        }}
      />
    </div>
  );
};

export default SearchKnob;
