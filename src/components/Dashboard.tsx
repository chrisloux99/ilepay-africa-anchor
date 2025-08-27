import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Wallet,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Placeholder data - replace with real data from Stellar network
  const walletData = {
    totalBalance: 15420.67,
    xlmBalance: 8930.45,
    usdcBalance: 6490.22,
    recentTransactions: [
      {
        id: '1',
        type: 'receive',
        amount: 250.00,
        currency: 'USDC',
        from: 'GDXA...7891',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        type: 'send',
        amount: 150.50,
        currency: 'XLM',
        to: 'GCAB...4567',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'completed'
      },
      {
        id: '3',
        type: 'deposit',
        amount: 500.00,
        currency: 'USDC',
        from: 'Bank Transfer',
        timestamp: '2024-01-14T16:45:00Z',
        status: 'pending'
      }
    ]
  };

  const formatBalance = (amount: number) => {
    return balanceVisible ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '****';
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
                {formatBalance(walletData.totalBalance)}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.5% this month</span>
                </div>
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
            <Button className="btn-wallet-primary w-full justify-start">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send Money
            </Button>
            <Button className="btn-wallet-secondary w-full justify-start">
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
            <div className="text-2xl font-bold">{formatBalance(walletData.xlmBalance)}</div>
            <p className="text-sm text-muted-foreground">≈ {balanceVisible ? '8,930.45 XLM' : '****'}</p>
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
            <div className="text-2xl font-bold">{formatBalance(walletData.usdcBalance)}</div>
            <p className="text-sm text-muted-foreground">≈ {balanceVisible ? '6,490.22 USDC' : '****'}</p>
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
            {walletData.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'receive' ? 'bg-success/20 text-success' :
                    tx.type === 'send' ? 'bg-primary/20 text-primary' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> :
                     tx.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> :
                     <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.type === 'send' ? `To: ${tx.to?.substring(0, 8)}...` :
                       tx.type === 'receive' ? `From: ${tx.from?.substring(0, 8)}...` :
                       tx.from}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'receive' ? 'text-success' :
                    tx.type === 'send' ? 'text-primary' :
                    'text-warning'
                  }`}>
                    {tx.type === 'send' ? '-' : '+'}{balanceVisible ? `${tx.amount} ${tx.currency}` : '****'}
                  </p>
                  <p className={`text-xs ${
                    tx.status === 'completed' ? 'text-success' :
                    tx.status === 'pending' ? 'text-warning' :
                    'text-destructive'
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;