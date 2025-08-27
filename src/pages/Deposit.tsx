import React, { useState } from 'react';
import { Upload, CreditCard, Building, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Deposit = () => {
  const [depositMethod, setDepositMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Integrate with Stellar Anchor services
      // This would typically involve:
      // 1. KYC verification
      // 2. Banking integration
      // 3. Anchor service API calls
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Deposit Initiated",
        description: `Deposit of ${amount} ${currency} has been initiated`,
      });
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Deposit Funds</h1>
        </div>
        <p className="text-muted-foreground">Add funds to your wallet from external sources</p>
      </div>

      {/* KYC Notice */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Deposits require KYC verification through our anchor partner. This is a one-time process for regulatory compliance.
        </AlertDescription>
      </Alert>

      {/* Deposit Methods */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Select Deposit Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={depositMethod === 'bank' ? 'default' : 'outline'}
              className="h-20 flex-col gap-2"
              onClick={() => setDepositMethod('bank')}
            >
              <Building className="w-6 h-6" />
              <span>Bank Transfer</span>
            </Button>
            <Button
              variant={depositMethod === 'card' ? 'default' : 'outline'}
              className="h-20 flex-col gap-2"
              onClick={() => setDepositMethod('card')}
            >
              <CreditCard className="w-6 h-6" />
              <span>Credit/Debit Card</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Form */}
      {depositMethod && (
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle>
              {depositMethod === 'bank' ? 'Bank Transfer Details' : 'Card Payment Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-6">
              {/* Amount and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="NGN">NGN</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {depositMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Wire Transfer Instructions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Bank Name:</p>
                          <p className="font-medium">iLe-Pay Anchor Bank</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Account Number:</p>
                          <p className="font-medium font-mono">1234567890</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Routing Number:</p>
                          <p className="font-medium font-mono">021000021</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Swift Code:</p>
                          <p className="font-medium font-mono">ILPYUS33XXX</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-muted-foreground">Reference:</p>
                        <p className="font-medium font-mono">ILP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Please include this reference in your wire transfer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {depositMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Information */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Fee Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Deposit Amount:</p>
                    <p className="font-medium">{amount || '0.00'} {currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Fee:</p>
                    <p className="font-medium">
                      {depositMethod === 'bank' ? '0.5%' : '2.9%'} + $0.30
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Network Fee:</p>
                    <p className="font-medium">0.00001 XLM</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">You'll receive:</p>
                    <p className="font-medium text-success">
                      ≈ {amount ? (parseFloat(amount) * 0.97).toFixed(2) : '0.00'} USDC
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-wallet-primary w-full"
                disabled={isLoading || !amount}
              >
                {isLoading ? 'Processing...' : 
                 depositMethod === 'bank' ? 'Generate Wire Instructions' : 'Process Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Deposit;