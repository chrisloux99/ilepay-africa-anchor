import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SecurityActivity {
  id: string;
  type: 'login' | 'password_change' | 'failed_login' | 'device_added' | 'device_removed' | 'security_setting_changed';
  device: string;
  location: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  status: 'success' | 'blocked' | 'pending';
}

export interface TrustedDevice {
  id: string;
  name: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  last_used: string;
  current: boolean;
  user_agent?: string;
  ip_address?: string;
}

export interface SecuritySettings {
  twoFactor: boolean;
  biometric: boolean;
  sessionTimeout: boolean;
  emailAlerts: boolean;
  loginAlerts: boolean;
  transactionPIN: boolean;
}

export const useSecurityData = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactor: false,
    biometric: false,
    sessionTimeout: true,
    emailAlerts: true,
    loginAlerts: true,
    transactionPIN: false
  });
  
  const [securityActivities, setSecurityActivities] = useState<SecurityActivity[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate security score based on enabled features
  const calculateSecurityScore = useCallback((settings: SecuritySettings) => {
    let score = 30; // Base score
    
    if (settings.twoFactor) score += 25;
    if (settings.biometric) score += 20;
    if (settings.transactionPIN) score += 15;
    if (settings.sessionTimeout) score += 5;
    if (settings.emailAlerts) score += 3;
    if (settings.loginAlerts) score += 2;
    
    return Math.min(score, 100);
  }, []);

  // Load user security settings from profile
  const loadSecuritySettings = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile && (profile as any).security_settings) {
        const settings = JSON.parse((profile as any).security_settings);
        setSecuritySettings(settings);
        setSecurityScore(calculateSecurityScore(settings));
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  }, [user?.id, calculateSecurityScore]);

  // Save security settings to profile
  const updateSecuritySettings = useCallback(async (newSettings: SecuritySettings) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          security_settings: JSON.stringify(newSettings),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSecuritySettings(newSettings);
      setSecurityScore(calculateSecurityScore(newSettings));

      // Log security setting change
      await logSecurityActivity({
        type: 'security_setting_changed',
        device: navigator.userAgent.split(' ')[0] || 'Unknown Device',
        location: 'Current Location', // In production, use geolocation API
        status: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error updating security settings:', error);
      return false;
    }
  }, [user?.id, calculateSecurityScore]);

  // Log security activity
  const logSecurityActivity = useCallback(async (activity: Omit<SecurityActivity, 'id' | 'timestamp'>) => {
    if (!user?.id) return;

    try {
      const newActivity: SecurityActivity = {
        ...activity,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      // In a real app, this would be stored in a security_activities table
      setSecurityActivities(prev => [newActivity, ...prev].slice(0, 10));
      
      return newActivity;
    } catch (error) {
      console.error('Error logging security activity:', error);
    }
  }, [user?.id]);

  // Toggle security feature
  const toggleSecurityFeature = useCallback(async (feature: keyof SecuritySettings) => {
    const newSettings = {
      ...securitySettings,
      [feature]: !securitySettings[feature]
    };

    const success = await updateSecuritySettings(newSettings);
    
    if (success) {
      toast({
        title: "Security Setting Updated",
        description: `${feature} has been ${securitySettings[feature] ? 'disabled' : 'enabled'}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update security setting",
        variant: "destructive"
      });
    }
  }, [securitySettings, updateSecuritySettings, toast]);

  // Remove trusted device
  const removeTrustedDevice = useCallback(async (deviceId: string) => {
    setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
    
    await logSecurityActivity({
      type: 'device_removed',
      device: 'Unknown Device',
      location: 'Current Location',
      status: 'success'
    });

    toast({
      title: "Device Removed",
      description: "The trusted device has been removed successfully",
    });
  }, [logSecurityActivity, toast]);

  // Initialize current device as trusted
  const initializeCurrentDevice = useCallback(() => {
    const currentDevice: TrustedDevice = {
      id: 'current',
      name: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
      device_type: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
      last_used: new Date().toISOString(),
      current: true,
      user_agent: navigator.userAgent,
      ip_address: 'Current IP'
    };

    setTrustedDevices([currentDevice]);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadSecuritySettings();
      initializeCurrentDevice();
      
      // Log login activity
      logSecurityActivity({
        type: 'login',
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
        location: 'Current Location',
        status: 'success'
      });
    }
  }, [user?.id, loadSecuritySettings, initializeCurrentDevice, logSecurityActivity]);

  return {
    securitySettings,
    securityActivities,
    trustedDevices,
    securityScore,
    isLoading,
    toggleSecurityFeature,
    removeTrustedDevice,
    logSecurityActivity,
    updateSecuritySettings
  };
};