import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Send, 
  Download, 
  Upload, 
  History, 
  Settings, 
  Moon, 
  Sun,
  Wallet,
  CreditCard,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Logo3D from './Logo3D';

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Send', url: '/send', icon: Send },
  { title: 'Receive', url: '/receive', icon: Download },
  { title: 'Deposit', url: '/deposit', icon: Upload },
  { title: 'Withdraw', url: '/withdraw', icon: CreditCard },
  { title: 'History', url: '/history', icon: History },
  { title: 'Analytics', url: '/analytics', icon: TrendingUp },
  { title: 'Security', url: '/security', icon: Shield },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const WalletSidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Logo3D size="sm" animated />
        <p className="text-sm text-muted-foreground mt-2">Stellar Anchor Wallet</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Theme Toggle & User Section */}
      <div className="p-4 border-t border-border space-y-4">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Dark Mode
            </>
          )}
        </Button>

        {/* User Info */}
        <div className="wallet-card p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Address</p>
              <p className="text-xs text-muted-foreground truncate">
                GABC...XYZ123 {/* Placeholder Stellar address */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WalletSidebar;