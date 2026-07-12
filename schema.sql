-- CERTIFICATES TABLE
create table if not exists certificates (
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
create table if not exists arena_enquiries (
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
create table if not exists internship_applications (
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
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread',
  created_at timestamp default now()
);

-- GALLERY TABLE
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  category text,
  storage_path text not null,
  public_url text not null,
  sort_order integer default 0,
  is_visible boolean default true,
  created_at timestamp default now()
);

-- MACHINING ENQUIRIES TABLE
create table if not exists machining_enquiries (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  team_name text,
  services text[],
  material text,
  weight_class text,
  description text,
  urgency text,
  status text default 'new',
  notes text,
  created_at timestamp default now()
);

-- PROJECTS TABLE
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  description text not null,
  full_content text,
  team_name text,
  college text,
  weight_class text,
  competition text,
  result text,
  cover_image_url text,
  gallery_urls text[],
  tags text[],
  is_featured boolean default false,
  is_published boolean default false,
  sort_order integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
