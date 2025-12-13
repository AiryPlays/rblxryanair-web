
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension (optional, using text IDs for simplicity based on current code)

-- 1. FLIGHTS
create table flights (
  id text primary key,
  day text,
  "flightNumber" text,
  time text,
  departure text,
  arrival text,
  "departureTime" text,
  "arrivalTime" text,
  duration text,
  operator text,
  aircraft text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. BOOKINGS
create table bookings (
  id text primary key,
  flight_id text references flights(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. PASSENGERS
create table passengers (
  id text primary key,
  booking_id text references bookings(id),
  username text,
  roblox_user_id bigint,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. SEATS
create table seats (
  id text primary key,
  flight_id text references flights(id),
  seat_number text,
  booking_id text references bookings(id), -- Nullable, set when booked
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. FARES
create table fares (
  id text primary key,
  booking_id text references bookings(id),
  type text,
  gamepass_id bigint,
  has_gamepass boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. EXTRAS
create table extras (
  id text primary key,
  booking_id text references bookings(id),
  type text,
  gamepass_id bigint,
  has_gamepass boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. STAFF
create table staff (
  id text primary key,
  username text,
  role text,
  description text,
  pfp_url text,
  is_on_duty boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- For simplicity in this demo, we will enable public access. 
-- IN PRODUCTION: You should restrict Write access!
alter table flights enable row level security;
create policy "Public flights read" on flights for select using (true);
create policy "Public flights write" on flights for insert with check (true);
create policy "Public flights update" on flights for update using (true);
create policy "Public flights delete" on flights for delete using (true);

alter table bookings enable row level security;
create policy "Public bookings read" on bookings for select using (true);
create policy "Public bookings write" on bookings for insert with check (true);

alter table passengers enable row level security;
create policy "Public passengers read" on passengers for select using (true);
create policy "Public passengers write" on passengers for insert with check (true);

alter table seats enable row level security;
create policy "Public seats read" on seats for select using (true);
create policy "Public seats write" on seats for insert with check (true);
create policy "Public seats update" on seats for update using (true);

alter table fares enable row level security;
create policy "Public fares read" on fares for select using (true);
create policy "Public fares write" on fares for insert with check (true);

alter table extras enable row level security;
create policy "Public extras read" on extras for select using (true);
create policy "Public extras write" on extras for insert with check (true);

alter table staff enable row level security;
create policy "Public staff read" on staff for select using (true);
create policy "Public staff write" on staff for insert with check (true);
create policy "Public staff update" on staff for update using (true);
create policy "Public staff delete" on staff for delete using (true);

