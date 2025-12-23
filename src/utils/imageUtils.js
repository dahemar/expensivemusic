/**
 * Utility functions for image URL processing
 * Handles imgur blocking issues by using a proxy
 */

/**
 * Detects if a URL is from imgur
 */
export function isImgurUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('imgur.com') || url.includes('i.imgur.com');
}

/**
 * Converts imgur URLs to use a proxy service to avoid blocking
 * Uses images.weserv.nl as a free proxy service
 */
export function proxyImgurUrl(url) {
  if (!isImgurUrl(url)) return url;
  
  // Extract the actual image URL from imgur
  // imgur.com/abc123 -> i.imgur.com/abc123.jpg
  // i.imgur.com/abc123.jpg -> i.imgur.com/abc123.jpg
  let imgurImageUrl = url;
  
  // Convert imgur.com/ID to i.imgur.com/ID.jpg
  if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
    const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)/);
    if (match) {
      imgurImageUrl = `https://i.imgur.com/${match[1]}.jpg`;
    }
  }
  
  // Use images.weserv.nl as proxy
  // This service proxies images and can help bypass geoblocking
  return `https://images.weserv.nl/?url=${encodeURIComponent(imgurImageUrl)}`;
}

/**
 * Resolves an image URL, applying proxy if needed
 * @param {string} rawUrl - The raw URL from Google Sheets
 * @param {string} baseUrl - Base URL for relative paths (e.g., import.meta.env.BASE_URL)
 * @returns {string} - Resolved URL ready to use in <img src>
 */
export function resolveImageUrl(rawUrl, baseUrl = '') {
  if (!rawUrl) return '';
  
  // Extract URL from [img]...[/img] format if present
  let cleanUrl = rawUrl.trim();
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  if (match) {
    cleanUrl = match[1].trim();
  }
  
  if (!cleanUrl) return '';
  
  // If it's an HTTP(S) URL, check if it's imgur and proxy if needed
  if (cleanUrl.startsWith('http')) {
    return isImgurUrl(cleanUrl) ? proxyImgurUrl(cleanUrl) : cleanUrl;
  }
  
  // Relative path - resolve with base URL
  return `${baseUrl}${cleanUrl.replace(/^\//, '')}`;
}

