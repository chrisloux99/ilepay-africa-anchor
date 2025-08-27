import React, { useState } from 'react';
import { Download, Building, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Withdraw = () => {
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock balance data
  const availableBalance = {
    USDC: 6490.22,
    XLM: 8930.45,
    EURC: 1250.75
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Integrate with Stellar Anchor services
      // This would typically involve:
      // 1. Anchor withdrawal API
      // 2. Banking integration
      // 3. Stellar transaction creation
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal Initiated",
        description: `Withdrawal of ${amount} ${currency} has been initiated`,
      });
    } catch (error) {
      toast({
        title: "Withdrawal Failed", 
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maxAmount = availableBalance[currency as keyof typeof availableBalance] || 0;

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Withdraw Funds</h1>
        </div>
        <p className="text-muted-foreground">Transfer your assets to external accounts</p>
      </div>

      {/* Available Balance */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">USDC</p>
              <p className="text-xl font-bold">{availableBalance.USDC.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">XLM</p>
              <p className="text-xl font-bold">{availableBalance.XLM.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">EURC</p>
              <p className="text-xl font-bold">{availableBalance.EURC.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Notice */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Withdrawals require completed KYC verification and may take 1-3 business days to process.
        </AlertDescription>
      </Alert>

      {/* Withdrawal Methods */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Select Withdrawal Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={withdrawMethod === 'bank' ? 'default' : 'outline'}
              className="h-20 flex-col gap-2"
              onClick={() => setWithdrawMethod('bank')}
            >
              <Building className="w-6 h-6" />
              <span>Bank Transfer</span>
            </Button>
            <Button
              variant={withdrawMethod === 'card' ? 'default' : 'outline'}
              className="h-20 flex-col gap-2"
              onClick={() => setWithdrawMethod('card')}
            >
              <CreditCard className="w-6 h-6" />
              <span>Debit Card</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {withdrawMethod && (
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle>
              {withdrawMethod === 'bank' ? 'Bank Transfer Details' : 'Debit Card Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Amount and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={maxAmount}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-xs"
                      onClick={() => setAmount(maxAmount.toString())}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max: {maxAmount.toLocaleString()} {currency}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Asset</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                      <SelectItem value="XLM">XLM (Stellar Lumens)</SelectItem>
                      <SelectItem value="EURC">EURC (Euro Coin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bank Details */}
              {withdrawMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails(prev => ({
                          ...prev,
                          accountName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="1234567890"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails(prev => ({
                          ...prev,
                          accountNumber: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="routingNumber">Routing Number / IBAN</Label>
                      <Input
                        id="routingNumber"
                        placeholder="021000021"
                        value={bankDetails.routingNumber}
                        onChange={(e) => setBankDetails(prev => ({
                          ...prev,
                          routingNumber: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card Details */}
              {withdrawMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardNumber">Debit Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Information */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Withdrawal Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Withdrawal Amount:</p>
                    <p className="font-medium">{amount || '0.00'} {currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Fee:</p>
                    <p className="font-medium">
                      {withdrawMethod === 'bank' ? '$5.00' : '1.5%'} + $1.00
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Time:</p>
                    <p className="font-medium">
                      {withdrawMethod === 'bank' ? '1-3 business days' : 'Instant'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">You'll receive:</p>
                    <p className="font-medium text-success">
                      ${amount ? (parseFloat(amount) - (withdrawMethod === 'bank' ? 5 : parseFloat(amount) * 0.015 + 1)).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-wallet-secondary w-full"
                disabled={isLoading || !amount || parseFloat(amount) > maxAmount}
              >
                {isLoading ? 'Processing...' : `Withdraw ${amount || '0'} ${currency}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Withdraw;