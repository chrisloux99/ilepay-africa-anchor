import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepositParams {
  asset_code: string;
  asset_issuer?: string;
  amount?: string;
  account: string;
  memo_type?: string;
  memo?: string;
}

interface WithdrawParams {
  asset_code: string;
  asset_issuer?: string;
  amount: string;
  type: string;
  dest?: string;
  dest_extra?: string;
}

interface KYCFields {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  [key: string]: any;
}

export const useAnchorServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get anchor information
  const getAnchorInfo = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('anchor-services/info');
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting anchor info:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get anchor information",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Submit KYC information
  const submitKYC = useCallback(async (fields: KYCFields) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('anchor-services/kyc-submit', {
        body: fields,
      });

      if (error) throw error;

      toast({
        title: "KYC Submitted",
        description: "Your information has been submitted for verification",
      });

      return data;
    } catch (error: any) {
      console.error('Error submitting KYC:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit KYC information",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initiate deposit
  const initiateDeposit = useCallback(async (params: DepositParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('anchor-services/deposit', {
        body: params,
      });

      if (error) throw error;

      toast({
        title: "Deposit Initiated",
        description: "Follow the instructions to complete your deposit",
      });

      return data;
    } catch (error: any) {
      console.error('Error initiating deposit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate deposit",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initiate withdrawal
  const initiateWithdraw = useCallback(async (params: WithdrawParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('anchor-services/withdraw', {
        body: params,
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Initiated",
        description: "Follow the instructions to complete your withdrawal",
      });

      return data;
    } catch (error: any) {
      console.error('Error initiating withdrawal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate withdrawal",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get transaction status
  const getTransactionStatus = useCallback(async (transactionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(`anchor-services/transaction?id=${transactionId}`);
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting transaction status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get transaction status",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Get transaction history
  const getTransactionHistory = useCallback(async (filters?: {
    asset_code?: string;
    kind?: 'deposit' | 'withdraw';
    limit?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.asset_code) params.append('asset_code', filters.asset_code);
      if (filters?.kind) params.append('kind', filters.kind);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const { data, error } = await supabase.functions.invoke(`anchor-services/transactions${query}`);
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting transaction history:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get transaction history",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    isLoading,
    getAnchorInfo,
    submitKYC,
    initiateDeposit,
    initiateWithdraw,
    getTransactionStatus,
    getTransactionHistory
  };
};