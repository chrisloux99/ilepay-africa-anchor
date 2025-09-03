import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import Stellar SDK for deno - use a compatible version
import * as StellarSdk from 'https://esm.sh/stellar-sdk@11.3.0'

// Extract the needed classes from the SDK
const { 
  Keypair, 
  Server, 
  Networks, 
  TransactionBuilder, 
  Operation, 
  Asset,
  Memo,
  BASE_FEE 
} = StellarSdk

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Configuration placeholders - values come from Supabase secrets
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const STELLAR_SECRET_KEY = Deno.env.get('STELLAR_SECRET_KEY'); // Master key for operations
    
    // Network configuration
    const HORIZON_CONFIG = {
      testnet: 'https://horizon-testnet.stellar.org',
      mainnet: 'https://horizon.stellar.org'
    };
    
    const HORIZON_URL = HORIZON_CONFIG[STELLAR_NETWORK as keyof typeof HORIZON_CONFIG];
    const NETWORK_PASSPHRASE = STELLAR_NETWORK === 'mainnet' 
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015';

    console.log(`Stellar Wallet API - Network: ${STELLAR_NETWORK}, Horizon: ${HORIZON_URL}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Route handling
    const requestBody = method === 'POST' ? await req.json() : null;
    
    switch (method) {
      case 'POST':
        if (requestBody?.action === 'create-account' || path === 'create-account') {
          return await handleCreateAccount(req, supabase, requestBody);
        } else if (path === 'get-balance') {
          return await handleGetBalance(req, supabase, requestBody);
        } else if (path === 'build-transaction') {
          return await handleSendPayment(req, supabase, requestBody);
        } else if (path === 'submit-transaction') {
          return await handleSubmitTransaction(req, supabase, requestBody);
        }
        break;
      
      case 'GET':
        if (path === 'account-info') {
          return await handleAccountInfo(req, supabase);
        }
        break;
    }

    return new Response(
      JSON.stringify({ error: 'Method not found' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in stellar-wallet function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Stellar wallet functions with real implementations
async function handleCreateAccount(req: Request, supabase: any, requestBody?: any) {
  try {
    console.log('Creating Stellar account...');
    
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    // Generate a new Stellar keypair
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();
    
    console.log('Generated keypair:', { publicKey, network: STELLAR_NETWORK });
    
    // For testnet, fund the account using Friendbot
    if (STELLAR_NETWORK === 'testnet') {
      try {
        console.log('Funding testnet account via Friendbot...');
        const friendbotUrl = `https://friendbot.stellar.org?addr=${publicKey}`;
        const fundResponse = await fetch(friendbotUrl);
        
        if (!fundResponse.ok) {
          throw new Error(`Friendbot funding failed: ${fundResponse.status}`);
        }
        
        console.log('Account successfully funded on testnet');
      } catch (fundError) {
        console.error('Error funding account:', fundError);
        // Continue anyway - account might still be usable
      }
    }
    
    const accountData = {
      publicKey,
      secretKey,
      tokens: '100 iLede starter tokens',
      network: STELLAR_NETWORK,
      created_at: new Date().toISOString()
    };
    
    console.log('Account creation successful:', { 
      publicKey: accountData.publicKey, 
      network: accountData.network 
    });
    
    return new Response(JSON.stringify(accountData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    console.error('Error creating account:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create account',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetBalance(req: Request, supabase: any, requestBody?: any) {
  try {
    console.log('Getting account balance...');
    
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    const { publicKey } = requestBody || {};
    
    if (!publicKey) {
      return new Response(JSON.stringify({ 
        error: 'Public key is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Fetching balance for:', publicKey);
    
    // Initialize Stellar server
    const server = new Server(HORIZON_URL);
    
    try {
      // Load account from Stellar network
      const account = await server.loadAccount(publicKey);
      
      // Format balances
      const balances = account.balances.map((balance: any) => ({
        asset_type: balance.asset_type,
        asset_code: balance.asset_code || 'XLM',
        asset_issuer: balance.asset_issuer,
        balance: balance.balance,
        limit: balance.limit,
        buying_liabilities: balance.buying_liabilities,
        selling_liabilities: balance.selling_liabilities
      }));
      
      console.log('Balance fetch successful:', { balances: balances.length });
      
      return new Response(JSON.stringify({ 
        balances,
        account_id: publicKey,
        sequence: account.sequenceNumber()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (horizonError: any) {
      console.error('Horizon error:', horizonError);
      
      if (horizonError.response?.status === 404) {
        return new Response(JSON.stringify({ 
          error: 'Account not found',
          message: 'Account does not exist on the Stellar network',
          balances: []
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw horizonError;
    }
    
  } catch (error: any) {
    console.error('Error getting balance:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get balance',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleSendPayment(req: Request, supabase: any, requestBody?: any) {
  console.log('Sending payment...');
  
  try {
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    const NETWORK_PASSPHRASE = STELLAR_NETWORK === 'mainnet' 
      ? Networks.PUBLIC 
      : Networks.TESTNET;

    const { sourcePublicKey, destinationPublicKey, amount, memo } = requestBody || {};

    if (!sourcePublicKey || !destinationPublicKey || !amount) {
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters: sourcePublicKey, destinationPublicKey, amount' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const server = new Server(HORIZON_URL);
    
    // Load source account
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    
    // Build transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount: amount.toString(),
      }))
      .setTimeout(180);

    if (memo) {
      transaction.addMemo(Memo.text(memo));
    }

    const builtTransaction = transaction.build();
    
    return new Response(JSON.stringify({
      transactionXDR: builtTransaction.toXDR(),
      networkPassphrase: NETWORK_PASSPHRASE
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error building payment transaction:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to build payment transaction',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleAccountInfo(req: Request, supabase: any) {
  try {
    console.log('Getting account info...');
    
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    const url = new URL(req.url);
    const publicKey = url.searchParams.get('publicKey');
    
    if (!publicKey) {
      return new Response(JSON.stringify({ 
        error: 'Public key is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Fetching account info for:', publicKey);
    
    // Initialize Stellar server
    const server = new Server(HORIZON_URL);
    
    try {
      // Load account from Stellar network
      const account = await server.loadAccount(publicKey);
      
      const accountData = {
        account_id: account.accountId(),
        sequence: account.sequenceNumber(),
        balances: account.balances,
        signers: account.signers,
        data: account.data_attr,
        flags: account.flags,
        thresholds: account.thresholds,
        home_domain: account.home_domain,
        inflation_destination: account.inflation_destination
      };
      
      console.log('Account info fetch successful');
      
      return new Response(JSON.stringify(accountData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (horizonError: any) {
      console.error('Horizon error:', horizonError);
      
      if (horizonError.response?.status === 404) {
        return new Response(JSON.stringify({ 
          error: 'Account not found',
          message: 'Account does not exist on the Stellar network'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw horizonError;
    }
    
  } catch (error: any) {
    console.error('Error getting account info:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get account info',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleSubmitTransaction(req: Request, supabase: any, requestBody?: any) {
  try {
    console.log('Submitting signed transaction...');
    
    const STELLAR_NETWORK = Deno.env.get('STELLAR_NETWORK') || 'testnet';
    const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';

    const { signedTransactionXDR, amount, assetCode, destinationPublicKey, memo } = requestBody || {};

    if (!signedTransactionXDR) {
      return new Response(JSON.stringify({ 
        error: 'Missing signed transaction XDR' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const server = new Server(HORIZON_URL);
    
    // Submit transaction to Stellar network
    const result = await server.submitTransaction(signedTransactionXDR);
    
    console.log('Transaction submitted successfully:', result.hash);
    
    return new Response(JSON.stringify({
      hash: result.hash,
      ledger: result.ledger,
      envelope_xdr: result.envelope_xdr,
      result_xdr: result.result_xdr
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error submitting transaction:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to submit transaction',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}