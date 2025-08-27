import React, { useState } from 'react';
import { History as HistoryIcon, Filter, Download, ArrowUpRight, ArrowDownLeft, Upload, CreditCard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock transaction data - replace with actual Stellar transaction history
  const transactions = [
    {
      id: 'tx_1',
      hash: '2b4e1f8c3d7a9e6b5c8f2a1d4e7b9c6f3a8d5e2b7c4f9a1d6e3b8c5f2a9d7e4',
      type: 'receive',
      amount: 250.00,
      currency: 'USDC',
      counterparty: 'GDXA...7891',
      counterpartyName: 'John Smith',
      memo: 'Invoice payment',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
      fee: 0.00001
    },
    {
      id: 'tx_2',
      hash: '8f3a1d5e2b7c4f9a6d3e8b5c2f9a7d4e1b6c3f8a5d2e9b7c4f1a8d5e3b9c6f2',
      type: 'send',
      amount: 150.50,
      currency: 'XLM',
      counterparty: 'GCAB...4567',
      counterpartyName: 'Jane Doe',
      memo: 'Dinner split',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'completed',
      fee: 0.00001
    },
    {
      id: 'tx_3',
      hash: '5d2e9b7c4f1a8d5e3b9c6f2a7d4e1b8c5f2a9d6e3b7c4f8a1d5e2b9c6f3a8d5',
      type: 'deposit',
      amount: 500.00,
      currency: 'USDC',
      counterparty: 'Bank Transfer',
      counterpartyName: 'First National Bank',
      memo: 'Account funding',
      timestamp: '2024-01-14T16:45:00Z',
      status: 'pending',
      fee: 2.50
    },
    {
      id: 'tx_4',
      hash: '9c6f3a8d5e2b7c4f1a8d5e3b9c6f2a7d4e1b8c5f2a9d6e3b7c4f8a1d5e2b9c6',
      type: 'withdraw',
      amount: 75.25,
      currency: 'USDC',
      counterparty: 'Debit Card',
      counterpartyName: 'Wells Fargo ****1234',
      memo: 'Cash withdrawal',
      timestamp: '2024-01-13T14:20:00Z',
      status: 'completed',
      fee: 1.50
    },
    {
      id: 'tx_5',
      hash: 'a1d5e2b9c6f3a8d5e2b7c4f1a8d5e3b9c6f2a7d4e1b8c5f2a9d6e3b7c4f8a1d',
      type: 'send',
      amount: 25.00,
      currency: 'XLM',
      counterparty: 'GDEF...8901',
      counterpartyName: 'Coffee Shop',
      memo: 'Payment for coffee',
      timestamp: '2024-01-12T08:30:00Z',
      status: 'failed',
      fee: 0.00001
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-5 h-5" />;
      case 'receive': return <ArrowDownLeft className="w-5 h-5" />;
      case 'deposit': return <Upload className="w-5 h-5" />;
      case 'withdraw': return <CreditCard className="w-5 h-5" />;
      default: return <HistoryIcon className="w-5 h-5" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-primary';
      case 'receive': return 'text-success';
      case 'deposit': return 'text-warning';
      case 'withdraw': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success';
      case 'pending': return 'bg-warning/20 text-warning';
      case 'failed': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.counterpartyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportTransactions = () => {
    // TODO: Implement CSV/PDF export functionality
    console.log('Exporting transactions...');
  };

  return (
    <div className="p-6 animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <HistoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Transaction History</h1>
              <p className="text-muted-foreground">Track all your wallet activities</p>
            </div>
          </div>
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="wallet-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdraw">Withdraw</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="wallet-card">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((tx, index) => (
                <div
                  key={tx.id}
                  className={`p-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                    index === 0 ? 'rounded-t-lg' : ''
                  } ${index === filteredTransactions.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-success/20' :
                        tx.type === 'send' ? 'bg-primary/20' :
                        tx.type === 'deposit' ? 'bg-warning/20' :
                        'bg-secondary/20'
                      } ${getTransactionColor(tx.type)}`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{tx.type}</p>
                          <Badge variant="secondary" className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === 'send' ? 'To: ' : tx.type === 'receive' ? 'From: ' : ''}
                          {tx.counterpartyName || tx.counterparty}
                        </p>
                        {tx.memo && (
                          <p className="text-xs text-muted-foreground italic">{tx.memo}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'receive' ? 'text-success' :
                        tx.type === 'send' ? 'text-primary' :
                        tx.type === 'deposit' ? 'text-warning' :
                        'text-secondary'
                      }`}>
                        {tx.type === 'send' || tx.type === 'withdraw' ? '-' : '+'}
                        {tx.amount.toFixed(2)} {tx.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fee: {tx.fee} {tx.currency === 'XLM' ? 'XLM' : 'USD'}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <div className="text-center mt-6">
          <Button variant="outline">Load More Transactions</Button>
        </div>
      )}
    </div>
  );
};

export default History;