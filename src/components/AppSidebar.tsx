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
  Shield,
  Smartphone,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Logo3D from './Logo3D';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

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
  { title: 'Telecom', url: '/telecom', icon: Smartphone },
  { title: 'History', url: '/history', icon: History },
  { title: 'Analytics', url: '/analytics', icon: TrendingUp },
  { title: 'Security', url: '/security', icon: Shield },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-l-2 border-primary" 
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Logo3D size="sm" animated />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">iLe-Pay</h2>
              <p className="text-xs text-muted-foreground">Stellar Wallet</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavCls(active)}
                      >
                        <Icon className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border space-y-4">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={isCollapsed ? "w-10 px-0" : "w-full justify-start"}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4" />
                {!isCollapsed && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            )}
          </div>
        </Button>

        {/* User Info */}
        {!isCollapsed && (
          <div className="wallet-card p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.display_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  iLe-Pay Wallet
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={
            isCollapsed 
              ? "w-10 px-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
              : "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          }
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </div>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}