create extension if not exists pgcrypto;

create table if not exists shortlists (
  id uuid primary key default gen_random_uuid(),
  need text not null,
  requirements jsonb not null,
  results jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_shortlists_created_at on shortlists (created_at desc);

create table if not exists vendor_page_cache (
  url text primary key,
  content text not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null,
  hit_count integer not null default 0,
  last_hit_at timestamptz
);

create index if not exists idx_vendor_page_cache_expires_at on vendor_page_cache (expires_at);

create or replace function increment_vendor_cache_hit(cache_url text)
returns void
language plpgsql
as $$
begin
  update vendor_page_cache
  set hit_count = hit_count + 1,
      last_hit_at = now()
  where url = cache_url;
end;
$$;
