import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import WalletSidebar from './WalletSidebar';
import ConstellationBackground from './ConstellationBackground';
import { ThemeProvider } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const WalletLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading iLe-Pay...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Constellation Background */}
        <ConstellationBackground className="fixed inset-0 -z-10" />
        
        <div className="flex">
          {/* Sidebar */}
          <WalletSidebar />
          
          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default WalletLayout;