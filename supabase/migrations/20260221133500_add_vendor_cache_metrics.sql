alter table if exists vendor_page_cache
  add column if not exists hit_count integer not null default 0,
  add column if not exists last_hit_at timestamptz;

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
