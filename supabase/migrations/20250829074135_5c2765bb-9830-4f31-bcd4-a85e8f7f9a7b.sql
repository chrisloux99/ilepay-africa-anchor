-- 1) Anchor transactions table to track SEP-24 flows
create table if not exists public.anchor_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,                            -- 'deposit' | 'withdraw'
  asset_code text not null,
  asset_issuer text,
  anchor_id text,                                -- anchor-provided transaction id
  status text not null default 'incomplete',     -- per SEP-24 lifecycle
  status_message text,
  sep24_interactive_url text,
  more_info_url text,
  external_tx_id text,
  amount_in numeric,
  amount_out numeric,
  amount_fee numeric,
  memo text,
  memo_type text,
  refunds jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.anchor_transactions enable row level security;

create policy "Users can view their own anchor transactions"
  on public.anchor_transactions for select
  using (auth.uid() = user_id);

create policy "Users can create their own anchor transactions"
  on public.anchor_transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own anchor transactions"
  on public.anchor_transactions for update
  using (auth.uid() = user_id);

-- Updated-at trigger
drop trigger if exists trg_anchor_transactions_set_updated_at on public.anchor_transactions;
create trigger trg_anchor_transactions_set_updated_at
  before update on public.anchor_transactions
  for each row
  execute function public.update_updated_at_column();

-- 2) KYC status table to store per-user KYC state and anchor customer ids
create table if not exists public.kyc_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  status text not null default 'unknown',        -- unknown | pending | needs_info | approved | rejected
  fields jsonb,                                  -- last submitted fields (do not include sensitive docs here)
  anchor_customer_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.kyc_status enable row level security;

create policy "Users can view their own kyc status"
  on public.kyc_status for select
  using (auth.uid() = user_id);

create policy "Users can create their own kyc status"
  on public.kyc_status for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own kyc status"
  on public.kyc_status for update
  using (auth.uid() = user_id);

-- Updated-at trigger
drop trigger if exists trg_kyc_status_set_updated_at on public.kyc_status;
create trigger trg_kyc_status_set_updated_at
  before update on public.kyc_status
  for each row
  execute function public.update_updated_at_column();

-- 3) Allow users to update their own transactions (to move from pending -> completed/error via edge funcs)
do $$
begin
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'transactions'
      and p.policyname = 'Users can update their own transactions'
  ) then
    create policy "Users can update their own transactions"
      on public.transactions for update
      using (auth.uid() = user_id);
  end if;
end $$;