import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import ConstellationBackground from './ConstellationBackground';
import { ThemeProvider } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import WalletSetup from './WalletSetup';

const WalletLayout = () => {
  const { user, loading } = useAuth();
  const { getStoredKeys } = useStellarWallet();
  const [walletExists, setWalletExists] = useState<boolean | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading iLe-Pay...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user && !loading) {
      // Check if wallet exists after authentication
      const keys = getStoredKeys();
      setWalletExists(!!keys);
    }
  }, [user, loading, getStoredKeys]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but no wallet exists, show wallet setup
  if (user && walletExists === false) {
    return <WalletSetup onWalletCreated={() => setWalletExists(true)} />;
  }

  // Still checking for wallet
  if (walletExists === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Setting up your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="min-h-screen bg-background relative overflow-hidden w-full">
          {/* Constellation Background */}
          <ConstellationBackground className="fixed inset-0 -z-10" />
          
          {/* Global Sidebar Trigger */}
          <header className="h-12 flex items-center border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
            <SidebarTrigger className="ml-4" />
            <h1 className="ml-4 font-semibold text-lg">iLe-Pay Wallet</h1>
          </header>
          
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <AppSidebar />
            
            {/* Main Content */}
            <main className="flex-1">
              <div className="relative z-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default WalletLayout;