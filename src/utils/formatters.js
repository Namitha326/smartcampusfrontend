/**
 * Formats an ISO date string or date object into a human-readable date.
 * @param {string|Date} date Date value
 * @param {object} options Intl.DateTimeFormat options
 * @returns {string} Formatted date (e.g. "Sep 28, 2026")
 */
export const formatDate = (date, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options).format(d);
  } catch {
    return date;
  }
};

/**
 * Formats a percentage value.
 * @param {number} value
 * @param {number} decimals
 * @returns {string} e.g. "85.5%"
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === undefined || value === null) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Calculates letter grade based on numeric score out of 100.
 * @param {number} score
 * @returns {string} Grade (O, A+, A, B+, B, C, RA)
 */
export const getLetterGrade = (score) => {
  const num = Number(score) || 0;
  if (num >= 90) return 'O';
  if (num >= 80) return 'A+';
  if (num >= 70) return 'A';
  if (num >= 60) return 'B+';
  if (num >= 50) return 'B';
  if (num >= 45) return 'C';
  return 'RA'; // Re-appear
};

/**
 * Formats bytes into a human-readable size string.
 * @param {number} bytes
 * @returns {string} e.g. "2.4 MB"
 */
export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Capitalizes the first letter of each word.
 * @param {string} str
 * @returns {string}
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};
