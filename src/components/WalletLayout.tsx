import React from 'react';
import { Outlet } from 'react-router-dom';
import WalletSidebar from './WalletSidebar';
import ConstellationBackground from './ConstellationBackground';
import { ThemeProvider } from 'next-themes';

const WalletLayout = () => {
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