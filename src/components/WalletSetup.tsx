import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Loader2, Plus, Key, Wallet, Gift } from 'lucide-react';
import Logo3D from '@/components/Logo3D';
import ConstellationBackground from '@/components/ConstellationBackground';

interface WalletSetupProps {
  onWalletCreated: () => void;
}

const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [mode, setMode] = useState<'choose' | 'create' | 'import'>('choose');
  const { toast } = useToast();
  const { createAccount } = useStellarWallet();

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      const keys = await createAccount();
      
      // Simulate token distribution
      toast({
        title: "Wallet Created Successfully!",
        description: `New Stellar wallet created with starter tokens! Public Key: ${keys.publicKey.substring(0, 8)}...`,
      });
      
      // Additional success toast for token distribution
      setTimeout(() => {
        toast({
          title: "Welcome Bonus Received!",
          description: "You've received 100 iLede starter tokens to get you started!",
          variant: "default",
        });
      }, 1500);
      
      onWalletCreated();
    } catch (error: any) {
      toast({
        title: "Wallet Creation Failed",
        description: error.message || "Failed to create wallet",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleImportWallet = async () => {
    if (!secretKey) {
      toast({
        title: "Secret Key Required",
        description: "Please enter your Stellar secret key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate and import the secret key
      const { Keypair } = await import('stellar-sdk');
      const keypair = Keypair.fromSecret(secretKey);
      
      // Store the keys locally
      const keys = {
        publicKey: keypair.publicKey(),
        secretKey: secretKey
      };
      
      localStorage.setItem('stellar_wallet_keys', JSON.stringify(keys));
      
      toast({
        title: "Wallet Imported Successfully!",
        description: `Wallet imported successfully. Public Key: ${keys.publicKey.substring(0, 8)}...`,
      });
      
      onWalletCreated();
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: "Invalid secret key. Please check and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
        <ConstellationBackground className="fixed inset-0 -z-10" />
        
        <Card className="w-full max-w-md wallet-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo3D />
            </div>
            <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
              Set Up Your Stellar Wallet
            </CardTitle>
            <p className="text-muted-foreground">
              Create a new wallet or import an existing one to start using iLe-Pay
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button
              className="btn-wallet-primary w-full"
              onClick={() => setMode('create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Wallet
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMode('import')}
            >
              <Key className="w-4 h-4 mr-2" />
              Import Existing Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
        <ConstellationBackground className="fixed inset-0 -z-10" />
        
        <Card className="w-full max-w-md wallet-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
              Create Your Wallet
            </CardTitle>
            <p className="text-muted-foreground">
              You'll receive 100 iLede starter tokens to begin your journey!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-medium text-primary">Welcome Bonus</h3>
                  <p className="text-sm text-muted-foreground">
                    Get 100 iLede tokens to start using the platform
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              className="btn-wallet-primary w-full"
              onClick={handleCreateWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Wallet...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Create Wallet & Claim Tokens
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMode('choose')}
              disabled={isLoading}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <ConstellationBackground className="fixed inset-0 -z-10" />
      
      <Card className="w-full max-w-md wallet-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center">
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
            Import Your Wallet
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your existing Stellar secret key to import your wallet
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secret-key">Stellar Secret Key</Label>
            <Input
              id="secret-key"
              type="password"
              placeholder="Enter your Stellar secret key (S...)"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          
          <Button
            className="btn-wallet-primary w-full"
            onClick={handleImportWallet}
            disabled={isLoading || !secretKey}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Import Wallet
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setMode('choose')}
            disabled={isLoading}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSetup;