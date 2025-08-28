import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TelecomService {
  id: string;
  provider: string;
  service_type: string;
  package_name: string;
  amount: number;
  data_amount?: string;
  validity_days?: number;
}

const TelecomServices = () => {
  const [services, setServices] = useState<TelecomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const providers = [
    { id: 'MTN', name: 'MTN Zambia', color: 'bg-yellow-500', icon: Smartphone },
    { id: 'Airtel', name: 'Airtel Zambia', color: 'bg-red-500', icon: Phone },
    { id: 'Zamtel', name: 'Zamtel', color: 'bg-green-500', icon: Wifi },
    { id: 'ZedMobile', name: 'ZedMobile', color: 'bg-blue-500', icon: CreditCard },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('telecom_services')
        .select('*')
        .eq('active', true)
        .order('provider', { ascending: true })
        .order('amount', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load telecom services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (service: TelecomService) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase telecom services",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setPurchasing(service.id);

    try {
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'telecom_purchase',
          amount: service.amount,
          asset_code: 'iLede',
          telecom_provider: service.provider,
          phone_number: phoneNumber,
          service_type: service.service_type,
          status: 'pending',
        });

      if (transactionError) throw transactionError;

      // Here you would integrate with actual telecom APIs
      // For now, simulate the purchase
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Purchase Successful",
        description: `${service.package_name} has been added to ${phoneNumber}`,
      });

      // Update transaction status to completed
      // In a real implementation, this would be done by a webhook or background job
      
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  const filteredServices = selectedProvider === 'all'
    ? services
    : services.filter(s => s.provider === selectedProvider);

  const dataServices = filteredServices.filter(s => s.service_type === 'data');
  const airtimeServices = filteredServices.filter(s => s.service_type === 'airtime');

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Telecom Services</h1>
        </div>
        <p className="text-muted-foreground">Buy data bundles and airtime for all major Zambian networks</p>
      </div>

      {/* Provider Selection & Phone Input */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +260971234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Filter by Provider (Optional)</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {providers.map(provider => {
          const Icon = provider.icon;
          return (
            <Card
              key={provider.id}
              className={`wallet-card cursor-pointer transition-all ${
                selectedProvider === provider.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedProvider(selectedProvider === provider.id ? 'all' : provider.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${provider.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-sm">{provider.name}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Services Tabs */}
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data">Data Bundles</TabsTrigger>
          <TabsTrigger value="airtime">Airtime</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataServices.map(service => (
              <Card key={service.id} className="wallet-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.package_name}</CardTitle>
                    <span className="text-sm text-muted-foreground">{service.provider}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">{service.data_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validity:</span>
                      <span className="font-medium">{service.validity_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-primary">K{service.amount}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full btn-wallet-primary"
                    onClick={() => handlePurchase(service)}
                    disabled={purchasing === service.id || !phoneNumber}
                  >
                    {purchasing === service.id ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="airtime" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airtimeServices.map(service => (
              <Card key={service.id} className="wallet-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.package_name}</CardTitle>
                    <span className="text-sm text-muted-foreground">{service.provider}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">K{service.amount}</div>
                    <p className="text-muted-foreground">Airtime Value</p>
                  </div>
                  <Button
                    className="w-full btn-wallet-secondary"
                    onClick={() => handlePurchase(service)}
                    disabled={purchasing === service.id || !phoneNumber}
                  >
                    {purchasing === service.id ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelecomServices;