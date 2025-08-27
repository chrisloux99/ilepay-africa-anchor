import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        onScan(result.data);
        onClose();
      },
      {
        onDecodeError: (err) => {
          console.log('QR decode error:', err);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    QrScanner.hasCamera().then((hasCamera) => {
      setHasCamera(hasCamera);
      if (hasCamera) {
        qrScanner.start();
        setScanner(qrScanner);
      }
    });

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  if (!hasCamera) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Camera Not Available
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Camera access is required to scan QR codes. Please ensure your device has a camera and you've granted permission.
              </p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-md max-h-md">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          playsInline
          muted
        />
        
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">Scan QR Code</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-center text-sm">
            Position the QR code within the frame to scan
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;