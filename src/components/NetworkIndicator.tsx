import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Globe } from 'lucide-react';

interface NetworkIndicatorProps {
  network?: 'testnet' | 'mainnet';
  className?: string;
}

export const NetworkIndicator = ({ 
  network = 'testnet', 
  className 
}: NetworkIndicatorProps) => {
  const isTestnet = network === 'testnet';
  
  return (
    <Badge 
      variant={isTestnet ? "destructive" : "secondary"} 
      className={`flex items-center gap-1 ${className}`}
    >
      {isTestnet ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Globe className="h-3 w-3" />
      )}
      {isTestnet ? 'TESTNET' : 'MAINNET'}
    </Badge>
  );
};