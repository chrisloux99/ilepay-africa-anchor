import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, Copy, QrCode, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import QRGenerator from '@/components/QRGenerator';

const Receive = () => {
  const [requestAmount, setRequestAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWalletAddress();
    }
  }, [user]);

  const fetchWalletAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      // Generate a placeholder address if none exists
      setWalletAddress(data?.wallet_address || `GD${user?.id?.replace(/-/g, '').substring(0, 54).toUpperCase()}`);
    } catch (error) {
      console.error('Error fetching wallet address:', error);
      setWalletAddress(`GD${user?.id?.replace(/-/g, '').substring(0, 54).toUpperCase()}`);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const generateQR = () => {
    // TODO: Integrate QR code generation
    toast({
      title: "QR Code Generated",
      description: "QR code generated for your address",
    });
  };

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'iLe-Pay Wallet Address',
        text: `Send payments to my iLe-Pay wallet: ${walletAddress}`
      });
    } else {
      copyAddress();
    }
  };

  const generatePaymentLink = () => {
    const baseUrl = `stellar:${walletAddress}`;
    const params = new URLSearchParams();
    
    if (requestAmount) params.append('amount', requestAmount);
    if (memo) params.append('memo', memo);
    
    return params.toString() ? `${baseUrl}?${params}` : baseUrl;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Receive Payment</h1>
        </div>
        <p className="text-muted-foreground">Share your address to receive payments</p>
      </div>

      {/* Wallet Address */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Your Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-border">
              <div className="text-center space-y-4">
                {/* QR Code */}
                <div className="w-48 h-48 mx-auto rounded-lg flex items-center justify-center">
                  <QRGenerator 
                    value={generatePaymentLink()} 
                    size={192}
                    className="rounded-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground">QR Code for your wallet address</p>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <Label>Public Address</Label>
              <div className="flex gap-2">
                <Input
                  value={walletAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="sm" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={generateQR}>
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareAddress}>
                <Share className="w-4 h-4 mr-2" />
                Share Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Request */}
      <Card className="wallet-card mb-6">
        <CardHeader>
          <CardTitle>Request Specific Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0000001"
                  placeholder="0.00"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value="XLM"
                  readOnly
                  className="text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                placeholder="Add a memo for this payment request..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
              />
            </div>

            <Button className="btn-wallet-secondary w-full" onClick={() => {
              const link = generatePaymentLink();
              navigator.clipboard.writeText(link);
              toast({
                title: "Payment Link Copied",
                description: "Payment request link copied to clipboard",
              });
            }}>
              Generate Payment Link
            </Button>

            {/* Payment Link Preview */}
            {(requestAmount || memo) && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Payment Request Summary</h4>
                <div className="space-y-1 text-sm">
                  {requestAmount && (
                    <p><span className="text-muted-foreground">Amount:</span> {requestAmount} XLM</p>
                  )}
                  {memo && (
                    <p><span className="text-muted-foreground">Memo:</span> {memo}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="wallet-card">
        <CardHeader>
          <CardTitle>Tips for Receiving Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Share your public address safely</p>
                <p className="text-muted-foreground">Your public address is safe to share and cannot be used to access your funds.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
              <div>
                <p className="font-medium">Use memos for identification</p>
                <p className="text-muted-foreground">Include memos in payment requests to help identify the purpose of transactions.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
              <div>
                <p className="font-medium">Verify the network</p>
                <p className="text-muted-foreground">Ensure senders use the correct Stellar network (Mainnet) for your address.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receive;