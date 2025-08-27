import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  value, 
  size = 200, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (error) console.error('QR Code generation error:', error);
      }
    );
  }, [value, size]);

  if (!value) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <p className="text-muted-foreground text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg ${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default QRGenerator;