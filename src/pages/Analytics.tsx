import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Mock analytics data - replace with real data
  const analyticsData = {
    totalVolume: 45672.89,
    totalTransactions: 1247,
    averageTransaction: 36.62,
    monthlyGrowth: 12.5,
    topAssets: [
      { symbol: 'USDC', amount: 25430.12, percentage: 55.7 },
      { symbol: 'XLM', amount: 15890.45, percentage: 34.8 },
      { symbol: 'EURC', amount: 4352.32, percentage: 9.5 }
    ],
    monthlyActivity: [
      { month: 'Jan', sent: 2400, received: 3200, deposits: 800, withdrawals: 600 },
      { month: 'Feb', sent: 1800, received: 2800, deposits: 1200, withdrawals: 400 },
      { month: 'Mar', sent: 3200, received: 4100, deposits: 1500, withdrawals: 800 },
      { month: 'Apr', sent: 2800, received: 3600, deposits: 900, withdrawals: 700 },
      { month: 'May', sent: 4200, received: 5300, deposits: 1800, withdrawals: 1200 },
      { month: 'Jun', sent: 3800, received: 4800, deposits: 1400, withdrawals: 900 }
    ],
    recentTrends: {
      sending: { value: 15.2, trend: 'up' },
      receiving: { value: 8.7, trend: 'up' },
      deposits: { value: -3.1, trend: 'down' },
      withdrawals: { value: 22.4, trend: 'up' }
    }
  };

  return (
    <div className="p-6 animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Track your wallet performance and activity</p>
            </div>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="wallet-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalVolume.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+{analyticsData.monthlyGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="wallet-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-success">
              <Activity className="w-4 h-4" />
              <span>+18 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="wallet-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.averageTransaction}</div>
            <div className="flex items-center gap-1 text-sm text-primary">
              <BarChart3 className="w-4 h-4" />
              <span>Stable</span>
            </div>
          </CardContent>
        </Card>

        <Card className="wallet-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.0124 XLM</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>≈ $0.05</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Distribution */}
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Asset Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topAssets.map((asset, index) => (
                <div key={asset.symbol} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{asset.symbol}</span>
                    <span>${asset.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-gradient-primary' :
                        index === 1 ? 'bg-gradient-secondary' :
                        'bg-gradient-to-r from-accent to-accent/70'
                      }`}
                      style={{ width: `${asset.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{asset.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Trends */}
        <Card className="wallet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Sending</span>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${analyticsData.recentTrends.sending.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {analyticsData.recentTrends.sending.trend === 'up' ? '+' : ''}{analyticsData.recentTrends.sending.value}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-medium">Receiving</span>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${analyticsData.recentTrends.receiving.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {analyticsData.recentTrends.receiving.trend === 'up' ? '+' : ''}{analyticsData.recentTrends.receiving.value}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-warning" />
                  </div>
                  <span className="font-medium">Deposits</span>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${analyticsData.recentTrends.deposits.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {analyticsData.recentTrends.deposits.value}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-medium">Withdrawals</span>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${analyticsData.recentTrends.withdrawals.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {analyticsData.recentTrends.withdrawals.trend === 'up' ? '+' : ''}{analyticsData.recentTrends.withdrawals.value}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity Chart Placeholder */}
      <Card className="wallet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Interactive chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">2,840</div>
              <div className="text-sm text-muted-foreground">Sent</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-success">3,690</div>
              <div className="text-sm text-muted-foreground">Received</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">1,250</div>
              <div className="text-sm text-muted-foreground">Deposits</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary">840</div>
              <div className="text-sm text-muted-foreground">Withdrawals</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="mt-6 text-center">
        <Button variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Export Analytics Report
        </Button>
      </div>
    </div>
  );
};

export default Analytics;