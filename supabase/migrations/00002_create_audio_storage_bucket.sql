-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true);

-- Create storage policies for audio files
CREATE POLICY "Anyone can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio-files');

CREATE POLICY "Admins can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-files' AND
    (SELECT is_admin(auth.uid()))
  );

CREATE POLICY "Admins can update audio files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'audio-files' AND
    (SELECT is_admin(auth.uid()))
  );

CREATE POLICY "Admins can delete audio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'audio-files' AND
    (SELECT is_admin(auth.uid()))
  );