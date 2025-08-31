import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as StellarSdk from 'stellar-sdk';

interface WalletKeys {
  publicKey: string;
  secretKey: string;
}

export const useStellarWallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get stored wallet keys from localStorage
  const getStoredKeys = useCallback((): WalletKeys | null => {
    try {
      const keys = localStorage.getItem('stellar_wallet_keys');
      return keys ? JSON.parse(keys) : null;
    } catch (error) {
      console.error('Error retrieving stored keys:', error);
      return null;
    }
  }, []);

  // Store wallet keys in localStorage (non-custodial)
  const storeKeys = useCallback((keys: WalletKeys) => {
    try {
      localStorage.setItem('stellar_wallet_keys', JSON.stringify(keys));
    } catch (error) {
      console.error('Error storing keys:', error);
      toast({
        title: "Error",
        description: "Failed to store wallet keys locally",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Create new Stellar account
  const createAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stellar-wallet', {
        body: { action: 'create-account' },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;

      const keys = {
        publicKey: data.publicKey,
        secretKey: data.secretKey
      };

      // Store keys locally (non-custodial)
      storeKeys(keys);

      // Log token distribution info
      if (data.tokens) {
        console.log('Welcome tokens distributed:', data.tokens);
      }

      toast({
        title: "Success",
        description: `Wallet created! Address: ${keys.publicKey.substring(0, 8)}...`,
      });

      return keys;
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create wallet",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, storeKeys]);

  // Get account balance from Stellar network
  const getBalance = useCallback(async (publicKey?: string) => {
    const keys = getStoredKeys();
    const accountKey = publicKey || keys?.publicKey;

    if (!accountKey) {
      throw new Error('No wallet address available');
    }

    try {
      const { data, error } = await supabase.functions.invoke('stellar-wallet/get-balance', {
        body: { publicKey: accountKey },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting balance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get balance",
        variant: "destructive"
      });
      throw error;
    }
  }, [getStoredKeys, toast]);

  // Build transaction (non-custodial)
  const buildTransaction = useCallback(async (params: {
    destinationPublicKey: string;
    amount: string;
    assetCode?: string;
    assetIssuer?: string;
    memo?: string;
  }) => {
    const keys = getStoredKeys();
    if (!keys) {
      throw new Error('No wallet keys found');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stellar-wallet/build-transaction', {
        body: {
          sourcePublicKey: keys.publicKey,
          ...params
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error building transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to build transaction",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getStoredKeys, toast]);

  // Sign and submit transaction
  const signAndSubmitTransaction = useCallback(async (transactionXDR: string, networkPassphrase: string) => {
    const keys = getStoredKeys();
    if (!keys) {
      throw new Error('No wallet keys found');
    }

    setIsLoading(true);
    try {
      // Sign transaction with user's secret key (client-side)
      const transaction = new StellarSdk.Transaction(transactionXDR, networkPassphrase);
      const keypair = StellarSdk.Keypair.fromSecret(keys.secretKey);
      transaction.sign(keypair);
      
      const signedXDR = transaction.toXDR();

      // Submit signed transaction
      const operation = transaction.operations[0];
      const paymentOperation = operation.type === 'payment' ? operation : null;
      
      const { data, error } = await supabase.functions.invoke('stellar-wallet/submit-transaction', {
        body: {
          signedTransactionXDR: signedXDR,
          amount: paymentOperation?.amount || '0',
          assetCode: paymentOperation?.asset?.code || 'XLM',
          destinationPublicKey: paymentOperation?.destination || '',
          memo: transaction.memo?.value || undefined
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction sent successfully!",
      });

      return data;
    } catch (error: any) {
      console.error('Error submitting transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send transaction",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getStoredKeys, toast]);

  // Send payment (combines build + sign + submit)
  const sendPayment = useCallback(async (params: {
    destinationPublicKey: string;
    amount: string;
    assetCode?: string;
    assetIssuer?: string;
    memo?: string;
  }) => {
    try {
      // Build transaction
      const buildResult = await buildTransaction(params);
      
      // Sign and submit
      const result = await signAndSubmitTransaction(
        buildResult.transactionXDR, 
        buildResult.networkPassphrase
      );
      
      return result;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }, [buildTransaction, signAndSubmitTransaction]);

  // Clear wallet (logout)
  const clearWallet = useCallback(() => {
    localStorage.removeItem('stellar_wallet_keys');
    toast({
      title: "Wallet Cleared",
      description: "Wallet keys have been removed from this device",
    });
  }, [toast]);

  return {
    isLoading,
    getStoredKeys,
    createAccount,
    getBalance,
    buildTransaction,
    signAndSubmitTransaction,
    sendPayment,
    clearWallet
  };
};