create table if not exists public.payment_records (
  id uuid default gen_random_uuid() primary key,
  payment_id text not null,
  user_id uuid references auth.users(id) not null,
  amount numeric(10,2) not null,
  trade_no text not null,
  trade_status text not null,
  payment_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index on payment_id to optimize lookups
create index if not exists payment_records_payment_id_idx on public.payment_records(payment_id);

-- Add RLS policies
alter table public.payment_records enable row level security;

create policy "Users can view their own payment records"
  on public.payment_records for select
  using (auth.uid() = user_id);

create policy "Anyone can insert payment records"
  on public.payment_records for insert
  with check (true);