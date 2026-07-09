-- CERTIFICATES TABLE
create table certificates (
  id text primary key,
  name text not null,
  track text not null,
  duration text not null,
  issue_date text not null,
  grade text not null,
  status text default 'valid',
  created_at timestamp default now()
);

-- ARENA ENQUIRIES TABLE  
create table arena_enquiries (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  team_name text,
  weight_class text,
  preferred_date date,
  bot_description text,
  heard_from text,
  status text default 'new',
  notes text,
  created_at timestamp default now()
);

-- INTERNSHIP APPLICATIONS TABLE
create table internship_applications (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  branch_year text,
  duration text,
  track text,
  portfolio_url text,
  motivation text,
  status text default 'new',
  notes text,
  created_at timestamp default now()
);

-- CONTACT MESSAGES TABLE
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread',
  created_at timestamp default now()
);

-- GALLERY TABLE
create table gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  category text,
  storage_path text not null,
  public_url text not null,
  sort_order integer default 0,
  is_visible boolean default true,
  created_at timestamp default now()
);
