import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const ANCHOR_BASE_URL = Deno.env.get('ANCHOR_BASE_URL') || 'https://anchor.example.com';
    
    // Anchor service endpoints configuration
    const ANCHOR_ENDPOINTS = {
      INFO: '/info',
      DEPOSIT: '/sep24/transactions/deposit/interactive',
      WITHDRAW: '/sep24/transactions/withdraw/interactive', 
      TRANSACTION: '/sep24/transaction',
      TRANSACTIONS: '/sep24/transactions',
    };

    // Supported assets configuration
    const SUPPORTED_ASSETS = [
      { code: 'USD', issuer: 'PLACEHOLDER_USD_ISSUER' },
      { code: 'EUR', issuer: 'PLACEHOLDER_EUR_ISSUER' },
      { code: 'GBP', issuer: 'PLACEHOLDER_GBP_ISSUER' },
    ];

    console.log(`Anchor Services API - Base URL: ${ANCHOR_BASE_URL}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Route handling
    switch (method) {
      case 'POST':
        if (path === 'initiate-deposit') {
          return await handleInitiateDeposit(req, supabase);
        } else if (path === 'initiate-withdraw') {
          return await handleInitiateWithdraw(req, supabase);
        } else if (path === 'kyc-submit') {
          return await handleKYCSubmit(req, supabase);
        }
        break;
      
      case 'GET':
        if (path === 'anchor-info') {
          return await handleAnchorInfo(req, supabase);
        } else if (path === 'transaction-status') {
          return await handleTransactionStatus(req, supabase);
        } else if (path === 'transaction-history') {
          return await handleTransactionHistory(req, supabase);
        }
        break;
    }

    return new Response(
      JSON.stringify({ error: 'Method not found' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in anchor-services function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Placeholder functions - to be implemented with actual anchor service integration
async function handleInitiateDeposit(req: Request, supabase: any) {
  try {
    const { asset_code, amount, account } = await req.json();
    console.log('Initiating deposit:', { asset_code, amount, account });
    
    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create anchor transaction record
    const { data: transaction, error: dbError } = await supabase
      .from('anchor_transactions')
      .insert({
        user_id: user.id,
        kind: 'deposit',
        asset_code,
        amount_in: amount,
        status: 'incomplete',
        anchor_id: crypto.randomUUID()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to create transaction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // For testnet, return a mock interactive URL
    const interactiveUrl = `${Deno.env.get('ANCHOR_BASE_URL') || 'https://testanchor.stellar.org'}/sep24/transactions/deposit/interactive?transaction_id=${transaction.id}`;
    
    return new Response(JSON.stringify({
      type: 'interactive_customer_info_needed',
      url: interactiveUrl,
      id: transaction.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error initiating deposit:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to initiate deposit',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleInitiateWithdraw(req: Request, supabase: any) {
  try {
    const { asset_code, amount, dest } = await req.json();
    console.log('Initiating withdrawal:', { asset_code, amount, dest });
    
    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check user balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .eq('asset_code', asset_code)
      .single();

    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create anchor transaction record
    const { data: transaction, error: dbError } = await supabase
      .from('anchor_transactions')
      .insert({
        user_id: user.id,
        kind: 'withdrawal',
        asset_code,
        amount_out: amount,
        status: 'incomplete',
        anchor_id: crypto.randomUUID()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to create transaction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // For testnet, return a mock interactive URL
    const interactiveUrl = `${Deno.env.get('ANCHOR_BASE_URL') || 'https://testanchor.stellar.org'}/sep24/transactions/withdraw/interactive?transaction_id=${transaction.id}`;
    
    return new Response(JSON.stringify({
      type: 'interactive_customer_info_needed',
      url: interactiveUrl,
      id: transaction.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error initiating withdrawal:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to initiate withdrawal',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleKYCSubmit(req: Request, supabase: any) {
  console.log('Submitting KYC information...');
  
  // TODO: Implement KYC submission
  // 1. Validate required KYC fields
  // 2. Submit to anchor's KYC endpoint
  // 3. Store KYC status in database
  // 4. Return verification status
  
  return new Response(
    JSON.stringify({ 
      message: 'KYC submission placeholder',
      // status: 'pending' | 'approved' | 'rejected'
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleAnchorInfo(req: Request, supabase: any) {
  console.log('Getting anchor information...');
  
  // TODO: Implement anchor info fetching
  // 1. Call anchor's info endpoint
  // 2. Return supported currencies and requirements
  
  return new Response(
    JSON.stringify({ 
      message: 'Anchor info placeholder',
      // supportedAssets: SUPPORTED_ASSETS,
      // kycRequired: true
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTransactionStatus(req: Request, supabase: any) {
  console.log('Getting transaction status...');
  
  // TODO: Implement transaction status fetching
  // 1. Get transaction ID from query params
  // 2. Query anchor for transaction status
  // 3. Return current status
  
  return new Response(
    JSON.stringify({ 
      message: 'Transaction status placeholder',
      // status: 'pending' | 'completed' | 'failed'
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTransactionHistory(req: Request, supabase: any) {
  try {
    const url = new URL(req.url);
    const asset_code = url.searchParams.get('asset_code');
    const kind = url.searchParams.get('kind');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let query = supabase
      .from('anchor_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (asset_code) {
      query = query.eq('asset_code', asset_code);
    }
    
    if (kind) {
      query = query.eq('kind', kind);
    }

    const { data: transactions, error: dbError } = await query;

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      transactions: transactions || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error getting transaction history:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get transaction history',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}