import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Loader2, Mail, Chrome, Wallet, Key, Plus } from 'lucide-react';
import Logo3D from '@/components/Logo3D';
import ConstellationBackground from '@/components/ConstellationBackground';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    secretKey: '',
  });
  const { toast } = useToast();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const { createAccount, getStoredKeys, clearWallet } = useStellarWallet();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to iLe-Pay",
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.displayName);
    
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account",
      });
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      const keys = await createAccount();
      toast({
        title: "Wallet Created!",
        description: `New Stellar wallet created. Public Key: ${keys.publicKey.substring(0, 8)}...`,
      });
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
    if (!formData.secretKey) {
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
      const keypair = Keypair.fromSecret(formData.secretKey);
      
      // Store the keys locally
      const keys = {
        publicKey: keypair.publicKey(),
        secretKey: formData.secretKey
      };
      
      localStorage.setItem('stellar_wallet_keys', JSON.stringify(keys));
      
      toast({
        title: "Wallet Imported!",
        description: `Wallet imported successfully. Public Key: ${keys.publicKey.substring(0, 8)}...`,
      });
      
      setFormData(prev => ({ ...prev, secretKey: '' }));
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: "Invalid secret key. Please check and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const existingWallet = getStoredKeys();

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <ConstellationBackground className="fixed inset-0 -z-10" />
      
      <Card className="w-full max-w-md wallet-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo3D />
          </div>
          <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
            Welcome to iLe-Pay
          </CardTitle>
          <p className="text-muted-foreground">
            Your gateway to the Stellar network in Zambia
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={existingWallet ? "signin" : "wallet"} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="wallet" className="space-y-4">
              {existingWallet ? (
                <div className="space-y-4">
                  <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Wallet Found</h3>
                        <p className="text-sm text-muted-foreground">
                          {existingWallet.publicKey.substring(0, 8)}...{existingWallet.publicKey.substring(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      clearWallet();
                      toast({
                        title: "Wallet Cleared",
                        description: "Your wallet has been removed from this device",
                      });
                    }}
                  >
                    Clear Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
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
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Wallet
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secret-key">Import Existing Wallet</Label>
                    <Input
                      id="secret-key"
                      type="password"
                      placeholder="Enter your Stellar secret key (S...)"
                      value={formData.secretKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleImportWallet}
                    disabled={isLoading || !formData.secretKey}
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
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="btn-wallet-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Display Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="btn-wallet-secondary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;