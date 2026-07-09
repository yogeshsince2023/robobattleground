# Supabase Storage Bucket Setup Instructions

Follow these instructions in the Supabase Dashboard to create the storage bucket for the battle gallery:

1. Navigate to the **Storage** page from the left sidebar of your Supabase project dashboard.
2. Click the **New bucket** button.
3. Configure the new bucket settings:
   *   **Name**: `gallery`
   *   **Public bucket**: Enable (Toggle **ON**) — This allows anyone to view/load the uploaded images directly via public URLs.
4. Click **Create bucket**.
5. Once created, click on the three dots (`...`) next to the `gallery` bucket under the sidebar list and select **Edit bucket settings** (or select **Policies** if you want custom storage rules):
   *   **File size limit**: Set to `10MB` (or enter `10485760` bytes).
   *   **Allowed MIME types**: Specify the following list:
       *   `image/jpeg`
       *   `image/png`
       *   `image/webp`
6. Click **Save** to apply the configuration.
