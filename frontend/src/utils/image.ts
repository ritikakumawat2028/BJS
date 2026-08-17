/**
 * Transforms a raw Cloudinary URL to include optimization parameters.
 * @param url The raw Cloudinary secure_url
 * @returns The optimized Cloudinary URL
 */
export const optimizeImage = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // If it's already a Cloudinary URL, inject f_auto,q_auto
  if (url.includes('res.cloudinary.com')) {
    // If it already has transformations, skip or append
    if (url.includes('upload/f_auto,q_auto')) return url;
    
    // Inject f_auto,q_auto after /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  return url;
};
