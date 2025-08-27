import React from 'react';
import { Wallet, Star } from 'lucide-react';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo3D: React.FC<Logo3DProps> = ({ size = 'md', animated = true }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className={`logo-3d relative inline-flex items-center gap-3 ${sizeClasses[size]}`}>
      {/* Main Logo Text */}
      <div className="relative">
        <h1 
          className={`font-bold bg-gradient-to-r from-primary via-warning to-secondary bg-clip-text text-transparent ${animated ? 'animate-logo-glow' : ''}`}
          style={{
            textShadow: '0 0 30px hsl(var(--primary) / 0.5)',
            filter: 'drop-shadow(0 4px 8px hsl(var(--primary) / 0.3))',
          }}
        >
          iLe-Pay
        </h1>
        
        {/* 3D Effect Layer */}
        <div 
          className="absolute inset-0 font-bold text-primary/20 -z-10"
          style={{
            transform: 'translateX(2px) translateY(2px) translateZ(-10px)',
            filter: 'blur(1px)'
          }}
        >
          iLe-Pay
        </div>
        
        {/* Metallic Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 animate-pulse" />
      </div>

      {/* Floating Icon */}
      <div className={`floating-icon ${animated ? 'animate-float' : ''}`}>
        <div className="relative">
          <Wallet className="w-8 h-8 text-primary drop-shadow-lg" />
          <Star className="absolute -top-1 -right-1 w-3 h-3 text-secondary animate-pulse" />
        </div>
      </div>

      {/* Orbital Elements */}
      {animated && (
        <div className="absolute -inset-4 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full animate-rotate-y opacity-60" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-secondary rounded-full animate-rotate-y opacity-40" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 right-0 w-1 h-1 bg-accent rounded-full animate-rotate-y opacity-50" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </div>
  );
};

export default Logo3D;