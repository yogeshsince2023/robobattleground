-- Enable Row Level Security
alter table certificates enable row level security;
alter table arena_enquiries enable row level security;
alter table internship_applications enable row level security;
alter table contact_messages enable row level security;
alter table gallery enable row level security;

-- CERTIFICATES POLICIES
create policy "Allow public read access" on certificates
  for select using (true);

create policy "Allow admin write access" on certificates
  for all to authenticated using (true) with check (true);

-- ARENA ENQUIRIES POLICIES
create policy "Allow public insert access" on arena_enquiries
  for insert with check (true);

create policy "Allow admin access" on arena_enquiries
  for all to authenticated using (true) with check (true);

-- INTERNSHIP APPLICATIONS POLICIES
create policy "Allow public insert access" on internship_applications
  for insert with check (true);

create policy "Allow admin access" on internship_applications
  for all to authenticated using (true) with check (true);

-- CONTACT MESSAGES POLICIES
create policy "Allow public insert access" on contact_messages
  for insert with check (true);

create policy "Allow admin access" on contact_messages
  for all to authenticated using (true) with check (true);

-- GALLERY POLICIES
create policy "Allow public read visible access" on gallery
  for select using (is_visible = true);

create policy "Allow admin access" on gallery
  for all to authenticated using (true) with check (true);
