import React, { useEffect, useRef } from 'react';

interface ConstellationProps {
  className?: string;
}

const ConstellationBackground: React.FC<ConstellationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Africa constellation points (approximate)
    const africaPoints = [
      { x: 0.3, y: 0.2, name: 'Morocco' },
      { x: 0.35, y: 0.25, name: 'Algeria' },
      { x: 0.4, y: 0.3, name: 'Libya' },
      { x: 0.45, y: 0.32, name: 'Egypt' },
      { x: 0.2, y: 0.35, name: 'Mauritania' },
      { x: 0.25, y: 0.4, name: 'Mali' },
      { x: 0.3, y: 0.42, name: 'Niger' },
      { x: 0.35, y: 0.45, name: 'Chad' },
      { x: 0.4, y: 0.48, name: 'Sudan' },
      { x: 0.45, y: 0.5, name: 'Ethiopia' },
      { x: 0.15, y: 0.5, name: 'Senegal' },
      { x: 0.2, y: 0.55, name: 'Guinea' },
      { x: 0.25, y: 0.58, name: 'Burkina Faso' },
      { x: 0.3, y: 0.6, name: 'Nigeria' },
      { x: 0.35, y: 0.62, name: 'Cameroon' },
      { x: 0.4, y: 0.65, name: 'CAR' },
      { x: 0.45, y: 0.67, name: 'South Sudan' },
      { x: 0.5, y: 0.7, name: 'Kenya' },
      { x: 0.25, y: 0.7, name: 'Ghana' },
      { x: 0.32, y: 0.75, name: 'DRC' },
      { x: 0.4, y: 0.78, name: 'Tanzania' },
      { x: 0.35, y: 0.85, name: 'Angola' },
      { x: 0.42, y: 0.88, name: 'Zambia' },
      { x: 0.48, y: 0.9, name: 'Zimbabwe' },
      { x: 0.45, y: 0.95, name: 'South Africa' },
    ];

    // Animation variables
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw constellation points
      africaPoints.forEach((point, index) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        
        // Pulsing stars
        const pulse = Math.sin(time + index * 0.5) * 0.3 + 0.7;
        
        // Star gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
        gradient.addColorStop(0, `hsl(24, 100%, 60%, ${pulse})`);
        gradient.addColorStop(0.5, `hsl(120, 60%, 50%, ${pulse * 0.7})`);
        gradient.addColorStop(1, `hsl(200, 100%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, 2 + pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star rays
        ctx.strokeStyle = `hsl(24, 100%, 60%, ${pulse * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2 + time;
          const rayLength = 8 + pulse * 4;
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * rayLength,
            y + Math.sin(angle) * rayLength
          );
        }
        ctx.stroke();
      });

      // Draw connections between nearby points
      africaPoints.forEach((point1, i) => {
        africaPoints.forEach((point2, j) => {
          if (i >= j) return;
          
          const x1 = point1.x * canvas.width;
          const y1 = point1.y * canvas.height;
          const x2 = point2.x * canvas.width;
          const y2 = point2.y * canvas.height;
          
          const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          
          if (distance < 150) { // Connect nearby points
            const opacity = Math.max(0, (150 - distance) / 150) * 0.3;
            const pulse = Math.sin(time * 2 + i + j) * 0.2 + 0.8;
            
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `hsl(24, 100%, 60%, ${opacity * pulse})`);
            gradient.addColorStop(0.5, `hsl(120, 60%, 50%, ${opacity * pulse * 0.8})`);
            gradient.addColorStop(1, `hsl(200, 100%, 60%, ${opacity * pulse * 0.6})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
        style={{ background: 'transparent' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/10 pointer-events-none" />
    </div>
  );
};

export default ConstellationBackground;