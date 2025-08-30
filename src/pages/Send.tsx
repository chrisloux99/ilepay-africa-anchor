import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Scan, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import QRScanner from '@/components/QRScanner';

const Send = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'XLM',
    memo: ''
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [walletBalance, setWalletBalance] = useState<any>(null);
  const { toast } = useToast();
  const { getStoredKeys, getBalance, sendPayment, isLoading } = useStellarWallet();

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    const keys = getStoredKeys();
    if (!keys) {
      toast({
        title: "No Wallet Found",
        description: "Create a wallet first to send payments",
        variant: "destructive"
      });
      return;
    }

    try {
      const balance = await getBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const getAvailableBalance = () => {
    if (!walletBalance?.balances) return 0;
    const asset = walletBalance.balances.find((b: any) => 
      (formData.currency === 'XLM' && b.asset_type === 'native') ||
      (b.asset_code === formData.currency)
    );
    return asset ? parseFloat(asset.balance) : 0;
  };

  const handleQRScan = (result: string) => {
    // Parse QR code result (could be a Stellar address or payment request)
    try {
      if (result.startsWith('stellar:')) {
        const url = new URL(result);
        setFormData(prev => ({
          ...prev,
          recipient: url.pathname,
          amount: url.searchParams.get('amount') || '',
          memo: url.searchParams.get('memo') || ''
        }));
      } else {
        // Assume it's just a Stellar address
        setFormData(prev => ({ ...prev, recipient: result }));
      }
      setShowQRScanner(false);
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not a valid payment request",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const availableBalance = getAvailableBalance();
    const amount = parseFloat(formData.amount);
    
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalance.toFixed(7)} ${formData.currency} available`,
        variant: "destructive"
      });
      return;
    }

    try {
      await sendPayment({
        destinationPublicKey: formData.recipient,
        amount: formData.amount,
        assetCode: formData.currency === 'XLM' ? undefined : formData.currency,
        memo: formData.memo || undefined
      });
      
      // Reset form and refresh balance
      setFormData({ recipient: '', amount: '', currency: 'XLM', memo: '' });
      fetchWalletBalance();
    } catch (error: any) {
      // Error already handled in hook with toast
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Send Payment</h1>
        </div>
        <p className="text-muted-foreground">Send assets to any Stellar address</p>
      </div>

      {/* Send Form */}
      <Card className="wallet-card">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <div className="relative">
                <Input
                  id="recipient"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={formData.recipient}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                  className="pr-20"
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost" 
                    className="p-2"
                    onClick={() => setShowQRScanner(true)}
                  >
                    <Scan className="w-4 h-4" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="p-2">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a valid Stellar public key or scan QR code
              </p>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.0000001"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pr-12"
                    required
                  />
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XLM">XLM (Stellar Lumens)</SelectItem>
                    <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                    <SelectItem value="EURC">EURC (Euro Coin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                placeholder="Add a memo to your transaction..."
                value={formData.memo}
                onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Memo helps identify the transaction purpose
              </p>
            </div>

            {/* Transaction Summary */}
            {formData.amount && formData.recipient && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-medium">Transaction Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount:</p>
                    <p className="font-medium">{formData.amount} {formData.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available:</p>
                    <p className="font-medium">{getAvailableBalance().toFixed(7)} {formData.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Network Fee:</p>
                    <p className="font-medium">0.00001 XLM</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Recipient:</p>
                    <p className="font-medium font-mono text-xs">{formData.recipient}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="btn-wallet-primary w-full"
              disabled={isLoading || !formData.recipient || !formData.amount || parseFloat(formData.amount) > getAvailableBalance()}
            >
              {isLoading ? 'Processing...' : 'Send Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />

      {/* Recent Recipients */}
      <Card className="wallet-card mt-6">
        <CardHeader>
          <CardTitle>Recent Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent recipients</p>
            <p className="text-sm">Recipients will appear here after you send payments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Send;