/**
 * Utility functions for image URL processing
 */

export function isImgurUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('imgur.com') || url.includes('i.imgur.com');
}

/**
 * Resolves an image URL from Google Sheets
 * Handles [img]...[/img] format and relative paths
 * @param {string} rawUrl - The raw URL from Google Sheets
 * @param {string} baseUrl - Base URL for relative paths (e.g., import.meta.env.BASE_URL)
 * @returns {string} - Resolved URL ready to use in <img src>
 */
export function resolveImageUrl(rawUrl, baseUrl = '') {
  if (!rawUrl) return '';

  let cleanUrl = rawUrl.trim();
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  if (match) {
    cleanUrl = match[1].trim();
  }

  if (!cleanUrl) return '';

  if (cleanUrl.startsWith('http')) {
    return cleanUrl;
  }

  return `${baseUrl}${cleanUrl.replace(/^\//, '')}`;
}

