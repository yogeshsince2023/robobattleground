import { supabase } from './supabase.js';

// --- PUBLIC QUERIES ---

export const getCertificate = async (certId) => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', certId.toUpperCase().trim())
    .eq('status', 'valid')
    .single();
  return { data, error };
};

export const submitArenaEnquiry = async (formData) => {
  const { data, error } = await supabase
    .from('arena_enquiries')
    .insert([formData]);
  return { data, error };
};

export const submitInternshipApplication = async (formData) => {
  const { data, error } = await supabase
    .from('internship_applications')
    .insert([formData]);
  return { data, error };
};

export const submitContactMessage = async (formData) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([formData]);
  return { data, error };
};

export const submitMachiningEnquiry = async (formData) => {
  const { data, error } = await supabase
    .from('machining_enquiries')
    .insert([formData]);
  return { data, error };
};

export const getGallery = async (category = null) => {
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  return { data, error };
};


// --- ADMIN PANELS QUERIES ---

export const getAdminStats = async () => {
  const certs = supabase.from('certificates').select('*', { count: 'exact', head: true });
  const enquiries = supabase.from('arena_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const apps = supabase.from('internship_applications').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const msgs = supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread');
  const machining = supabase.from('machining_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const projects = supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true);
  
  const [certsRes, enquiriesRes, appsRes, msgsRes, machiningRes, projectsRes] = await Promise.all([certs, enquiries, apps, msgs, machining, projects]);
  return {
    certsCount: certsRes.count || 0,
    enquiriesCount: enquiriesRes.count || 0,
    appsCount: appsRes.count || 0,
    msgsCount: msgsRes.count || 0,
    machiningCount: machiningRes.count || 0,
    projectsCount: projectsRes.count || 0,
    error: certsRes.error || enquiriesRes.error || appsRes.error || msgsRes.error || machiningRes.error || projectsRes.error
  };
};

export const getCertificates = async () => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getMaxCertificateId = async () => {
  const { data, error } = await supabase
    .from('certificates')
    .select('id')
    .order('id', { ascending: false });
  return { data, error };
};

export const issueCertificate = async (certData) => {
  const { data, error } = await supabase
    .from('certificates')
    .insert([certData])
    .select()
    .single();
  return { data, error };
};

export const revokeCertificate = async (id) => {
  const { data, error } = await supabase
    .from('certificates')
    .update({ status: 'revoked' })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getArenaEnquiries = async () => {
  const { data, error } = await supabase
    .from('arena_enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateArenaEnquiry = async (id, updates) => {
  const { data, error } = await supabase
    .from('arena_enquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getInternshipApplications = async () => {
  const { data, error } = await supabase
    .from('internship_applications')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateInternshipApplication = async (id, updates) => {
  const { data, error } = await supabase
    .from('internship_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const markContactMessageRead = async (id) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status: 'read' })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteContactMessage = async (id) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  return { data, error };
};

export const getAllGallery = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  return { data, error };
};

export const insertGalleryItem = async (item) => {
  const { data, error } = await supabase
    .from('gallery')
    .insert([item])
    .select()
    .single();
  return { data, error };
};

export const updateGalleryItem = async (id, updates) => {
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteGalleryItem = async (id) => {
  const { data, error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  return { data, error };
};

export const getMachiningEnquiries = async () => {
  const { data, error } = await supabase
    .from('machining_enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateMachiningEnquiry = async (id, updates) => {
  const { data, error } = await supabase
    .from('machining_enquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// --- PROJECTS ---

export const getProjects = async (category = null) => {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  return { data, error };
};

export const getFeaturedProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(3);
  return { data, error };
};

export const getProjectBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return { data, error };
};

export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  return { data, error };
};

export const upsertProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
};

export const deleteProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  return { data, error };
};

export const toggleProjectStatus = async (id, field, value) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ [field]: value })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};
