-- Enable Row Level Security
alter table certificates enable row level security;
alter table arena_enquiries enable row level security;
alter table internship_applications enable row level security;
alter table contact_messages enable row level security;
alter table gallery enable row level security;

-- CERTIFICATES POLICIES
drop policy if exists "Allow public read access" on certificates;
create policy "Allow public read access" on certificates
  for select using (true);

drop policy if exists "Allow admin write access" on certificates;
create policy "Allow admin write access" on certificates
  for all to authenticated using (true) with check (true);

-- ARENA ENQUIRIES POLICIES
drop policy if exists "Allow public insert access" on arena_enquiries;
create policy "Allow public insert access" on arena_enquiries
  for insert with check (true);

drop policy if exists "Allow admin access" on arena_enquiries;
create policy "Allow admin access" on arena_enquiries
  for all to authenticated using (true) with check (true);

-- INTERNSHIP APPLICATIONS POLICIES
drop policy if exists "Allow public insert access" on internship_applications;
create policy "Allow public insert access" on internship_applications
  for insert with check (true);

drop policy if exists "Allow admin access" on internship_applications;
create policy "Allow admin access" on internship_applications
  for all to authenticated using (true) with check (true);

-- CONTACT MESSAGES POLICIES
drop policy if exists "Allow public insert access" on contact_messages;
create policy "Allow public insert access" on contact_messages
  for insert with check (true);

drop policy if exists "Allow admin access" on contact_messages;
create policy "Allow admin access" on contact_messages
  for all to authenticated using (true) with check (true);

-- GALLERY POLICIES
drop policy if exists "Allow public read visible access" on gallery;
create policy "Allow public read visible access" on gallery
  for select using (is_visible = true);

drop policy if exists "Allow admin access" on gallery;
create policy "Allow admin access" on gallery
  for all to authenticated using (true) with check (true);

-- MACHINING ENQUIRIES POLICIES
alter table machining_enquiries enable row level security;

drop policy if exists "Allow public insert access" on machining_enquiries;
create policy "Allow public insert access" on machining_enquiries
  for insert with check (true);

drop policy if exists "Allow admin access" on machining_enquiries;
create policy "Allow admin access" on machining_enquiries
  for all to authenticated using (true) with check (true);

-- PROJECTS POLICIES
alter table projects enable row level security;

drop policy if exists "Allow public read published" on projects;
create policy "Allow public read published" on projects
  for select using (is_published = true);

drop policy if exists "Allow admin access" on projects;
create policy "Allow admin access" on projects
  for all to authenticated using (true) with check (true);

-- FINANCE RECORDS POLICIES
alter table finance_records enable row level security;

drop policy if exists "Allow admin access" on finance_records;
create policy "Allow admin access" on finance_records
  for all to authenticated using (true) with check (true);
