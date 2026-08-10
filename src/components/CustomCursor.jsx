import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const onMouseMove = (e) => {
      setIsVisible(true);
      setDotPosition({ x: e.clientX, y: e.clientY });

      // Smooth lag for outer ring
      setPosition((prev) => ({
        x: prev.x + (e.clientX - prev.x) * 0.15,
        y: prev.y + (e.clientY - prev.y) * 0.15,
      }));
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-red-600/80 bg-red-600/10 transition-transform duration-100 ease-out hidden md:block"
        style={{
          transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0) scale(${isHovered ? 2.2 : 1})`,
          boxShadow: isHovered ? '0 0 25px rgba(229, 9, 20, 0.6)' : '0 0 10px rgba(229, 9, 20, 0.2)',
          borderColor: isHovered ? '#ff1e27' : 'rgba(229, 9, 20, 0.6)',
        }}
      />
      <div
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 z-[10000] w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_#ff1e27] hidden md:block"
        style={{
          transform: `translate3d(${dotPosition.x}px, ${dotPosition.y}px, 0)`,
        }}
      />
    </>
  );
}
