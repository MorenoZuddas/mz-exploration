// Utility pure per Cloudinary — NESSUN import del SDK
// Utilizzabile sia da Client che da Server Component

/**
 * Genera l'URL di una thumbnail Cloudinary tramite manipolazione stringa.
 * Non effettua nessuna chiamata API.
 */
export function thumbnailUrl(publicId: string, w = 600, h = 400): string {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
  if (!cloudName) {
    return '';
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_fill,f_auto,q_auto/${publicId}`;
}

