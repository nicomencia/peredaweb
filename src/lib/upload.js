const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;
const UPLOAD_TOKEN = import.meta.env.VITE_UPLOAD_TOKEN;

export async function uploadImage(file, folder = 'uploads') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch(`${UPLOAD_URL}/api/upload.php`, {
    method: 'POST',
    headers: {
      'X-Upload-Token': UPLOAD_TOKEN,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  return data.url;
}
