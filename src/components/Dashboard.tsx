import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Wallet,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [balanceData, setBalanceData] = useState<any>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { getStoredKeys, getBalance, isLoading } = useStellarWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const keys = getStoredKeys();
    if (!keys) {
      toast({
        title: "No Wallet Found",
        description: "Create a wallet first to view your balance",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingBalance(true);
    try {
      const balance = await getBalance();
      setBalanceData(balance);
      
      if (balance.account_id) {
        toast({
          title: "Wallet Loaded",
          description: "Successfully connected to Stellar testnet",
        });
      }
    } catch (error: any) {
      console.error('Error loading wallet data:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const formatBalance = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return balanceVisible ? num.toFixed(7) : '****';
  };

  const getTotalBalance = () => {
    if (!balanceData?.balances) return 0;
    return balanceData.balances.reduce((total: number, asset: any) => {
      if (asset.asset_type === 'native') return total + parseFloat(asset.balance);
      return total + parseFloat(asset.balance || 0);
    }, 0);
  };

  const getAssetBalance = (assetCode: string) => {
    if (!balanceData?.balances) return '0';
    const asset = balanceData.balances.find((b: any) => 
      (assetCode === 'XLM' && b.asset_type === 'native') ||
      (b.asset_code === assetCode)
    );
    return asset ? asset.balance : '0';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your iLe-Pay wallet</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBalanceVisible(!balanceVisible)}
          className="gap-2"
        >
          {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {balanceVisible ? 'Hide' : 'Show'} Balance
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="wallet-card col-span-1 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                {isLoadingBalance ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  `${formatBalance(getTotalBalance())} XLM`
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadWalletData}
                  disabled={isLoadingBalance}
                >
                  {isLoadingBalance ? 'Refreshing...' : 'Refresh Balance'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="wallet-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="btn-wallet-primary w-full justify-start"
              onClick={() => navigate('/send')}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send Money
            </Button>
            <Button 
              className="btn-wallet-secondary w-full justify-start"
              onClick={() => navigate('/receive')}
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Asset Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xs font-bold text-white">XLM</span>
              </div>
              Stellar Lumens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBalance(getAssetBalance('XLM'))} XLM
            </div>
            <p className="text-sm text-muted-foreground">Native Stellar Asset</p>
          </CardContent>
        </Card>

        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              USD Coin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBalance(getAssetBalance('USDC'))} USDC
            </div>
            <p className="text-sm text-muted-foreground">USD Coin on Stellar</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="wallet-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balanceData?.recent_payments?.records?.slice(0, 3).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.from === balanceData.account_id ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'
                  }`}>
                    {tx.from === balanceData.account_id ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {tx.from === balanceData.account_id ? 'Send' : 'Receive'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tx.from === balanceData.account_id 
                        ? `To: ${tx.to?.substring(0, 8)}...` 
                        : `From: ${tx.from?.substring(0, 8)}...`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.from === balanceData.account_id ? 'text-primary' : 'text-success'
                  }`}>
                    {tx.from === balanceData.account_id ? '-' : '+'}
                    {balanceVisible ? `${tx.amount} ${tx.asset_type === 'native' ? 'XLM' : tx.asset_code}` : '****'}
                  </p>
                  <p className="text-xs text-success">completed</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent transactions</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;