import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Globe } from 'lucide-react';
import { STELLAR_CONFIG } from '@/config/stellar';

interface NetworkIndicatorProps {
  className?: string;
}

export const NetworkIndicator = ({ 
  className 
}: NetworkIndicatorProps) => {
  const network = STELLAR_CONFIG.NETWORK as 'testnet' | 'mainnet';
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