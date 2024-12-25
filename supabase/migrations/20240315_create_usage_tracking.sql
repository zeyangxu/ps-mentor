-- Create the usage_tracking table
create table public.usage_tracking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null unique,
  usage_count int not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  email text not null
);

-- Enable Row Level Security
alter table public.usage_tracking enable row level security;

-- Create policies
create policy "Users can read their own usage"
  on public.usage_tracking
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own usage"
  on public.usage_tracking
  for update
  using (auth.uid() = user_id);

create policy "Users can insert their own usage"
  on public.usage_tracking
  for insert
  with check (auth.uid() = user_id);

-- Create an updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_usage_tracking_updated_at
  before update on public.usage_tracking
  for each row
  execute procedure public.handle_updated_at();

-- Grant access to authenticated users
grant usage on schema public to authenticated;
grant all on public.usage_tracking to authenticated;
grant usage on all sequences in schema public to authenticated;