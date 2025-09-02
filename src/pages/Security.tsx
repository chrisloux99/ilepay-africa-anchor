import React from 'react';
import { Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSecurityData } from '@/hooks/useSecurityData';

const Security = () => {
  const { toast } = useToast();
  const {
    securitySettings,
    securityActivities,
    trustedDevices,
    securityScore,
    isLoading,
    toggleSecurityFeature,
    removeTrustedDevice
  } = useSecurityData();

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const getActivityIcon = (type: string, status: string) => {
    if (status === 'blocked') return <XCircle className="w-4 h-4 text-destructive" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-success" />;
    return <Eye className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Security Center</h1>
        </div>
        <p className="text-muted-foreground">Monitor and manage your wallet security</p>
      </div>

      {/* Security Score */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    strokeWidth="3"
                    strokeDasharray={`${securityScore}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${getSecurityScoreColor(securityScore)}`}>
                    {securityScore}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Security Level: {getSecurityLevel(securityScore)}</h3>
                <p className="text-muted-foreground">Last security audit: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <Button className="btn-wallet-primary">
              Run Security Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Security Features */}
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Extra layer of security</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.twoFactor ? "default" : "secondary"}>
                  {securitySettings.twoFactor ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={securitySettings.twoFactor}
                  onCheckedChange={() => toggleSecurityFeature('twoFactor')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Biometric Authentication</Label>
                <p className="text-sm text-muted-foreground">Fingerprint/Face unlock</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.biometric ? "default" : "secondary"}>
                  {securitySettings.biometric ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={securitySettings.biometric}
                  onCheckedChange={() => toggleSecurityFeature('biometric')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto-lock after inactivity</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.sessionTimeout ? "default" : "secondary"}>
                  {securitySettings.sessionTimeout ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={securitySettings.sessionTimeout}
                  onCheckedChange={() => toggleSecurityFeature('sessionTimeout')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transaction PIN</Label>
                <p className="text-sm text-muted-foreground">PIN for transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.transactionPIN ? "default" : "secondary"}>
                  {securitySettings.transactionPIN ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={securitySettings.transactionPIN}
                  onCheckedChange={() => toggleSecurityFeature('transactionPIN')}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trusted Devices */}
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Trusted Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trustedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{device.name}</p>
                      {device.current && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last used: {new Date(device.last_used).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeTrustedDevice(device.id)}
                    disabled={device.current || isLoading}
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Remove'}
                  </Button>
                </div>
              ))}
              {trustedDevices.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No trusted devices found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Activity */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityActivities.length > 0 ? (
              securityActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.type, activity.status)}
                    <div>
                      <p className="font-medium capitalize">
                        {activity.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.device} • {activity.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'blocked' ? 'destructive' : 'secondary'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent security activity</p>
                <p className="text-sm">Security events will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="wallet-card">
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!securitySettings.transactionPIN && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Enable Transaction PIN for an extra layer of security on all transactions.
                  <Button className="ml-2" size="sm" variant="outline">
                    Enable PIN
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                Back up your recovery phrase securely. Store it offline and never share it with anyone.
                <Button className="ml-2" size="sm" variant="outline">
                  View Recovery
                </Button>
              </AlertDescription>
            </Alert>

            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Regularly review your trusted devices and remove any devices you no longer use.
                <Button className="ml-2" size="sm" variant="outline">
                  Review Devices
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;