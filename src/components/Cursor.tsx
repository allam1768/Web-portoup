'use client';
import { useEffect, useState, useRef } from 'react';

// Spark Type Definition
type Spark = {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
};

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  
  // Use refs for values to avoid re-renders
  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
         isVisible.current = true;
         // Set initial position immediately to avoid 'flying in' from 0,0
         cursor.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
       createSparks(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    // Animation Loop for Smooth Movement (LERP)
    let animationFrameId: number;
    
    const animate = () => {
        if (cursorRef.current && isVisible.current) {
            // LERP: Move cursor towards mouse position by a factor (0.15 = 15% of the distance per frame)
            // This creates a smooth trailing effect and filters out jitter
            const ease = 0.15;
            
            cursor.current.x += (mouse.current.x - cursor.current.x) * ease;
            cursor.current.y += (mouse.current.y - cursor.current.y) * ease;

            cursorRef.current.style.transform = `translate(${cursor.current.x}px, ${cursor.current.y}px) translate(-50%, -50%)`;
        }
        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Spark Animation Loop
  useEffect(() => {
      if (sparks.length === 0) return;

      const interval = setInterval(() => {
          setSparks(currentSparks => 
              currentSparks
                  .map(spark => ({
                      ...spark,
                      x: spark.x + Math.cos(spark.angle) * spark.speed,
                      y: spark.y + Math.sin(spark.angle) * spark.speed,
                      size: spark.size * 0.9, // Shrink over time
                  }))
                  .filter(spark => spark.size > 0.5) // Remove small sparks
          );
      }, 16); // ~60fps

      return () => clearInterval(interval);
  }, [sparks.length]);

  const createSparks = (x: number, y: number) => {
      const newSparks: Spark[] = [];
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
          newSparks.push({
              id: Date.now() + i,
              x,
              y,
              angle: (Math.PI * 2 * i) / sparkCount, // Evenly distributed
              speed: Math.random() * 2 + 2,
              size: Math.random() * 3 + 2, // Varied initial size
              color: '#9D00FF'
          });
      }
      setSparks(prev => [...prev, ...newSparks]);
  };

  return (
    <>
      {/* Four Pointed Star Cursor - Smooth LERP */}
      <div 
        ref={cursorRef}
className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
            transform: 'translate(-100px, -100px)', // Start off-screen
        }}
      >
        <svg 
  width="32" 
  height="32" 
  viewBox="0 0 24 24" 
  fill="#9D00FF"
  stroke="none"
  className="w-8 h-8 drop-shadow-[0_0_6px_rgba(157,0,255,0.8)]"
>

            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

      {/* Sparks */}
      {sparks.map((spark) => (
        <div
            key={spark.id}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
            style={{
                left: spark.x,
                top: spark.y,
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.color,
                opacity: 1, 
            }}
        />
      ))}
    </>
  );
}
