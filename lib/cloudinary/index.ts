/**
 * Client-safe helper: builds Cloudinary transformed image URLs without SDK calls.
 */
export function thumbnailUrl(publicId: string, width = 600, height = 400): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) {
    return '';
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${publicId}`;
}

