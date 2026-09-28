/**
 * Validates standard email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Validates student register number format (e.g., 21IT1001).
 * @param {string} regNo
 * @returns {boolean}
 */
export const isValidRegNo = (regNo) => {
  if (!regNo) return false;
  return /^[0-9]{2}[A-Z]{2,4}[0-9]{3,5}$/i.test(regNo.trim());
};

/**
 * Validates phone numbers (10 digits).
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length >= 10 && clean.length <= 15;
};

/**
 * Validates that an academic mark is within range (0 to maxMarks).
 * @param {number|string} mark
 * @param {number} maxMarks
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateMark = (mark, maxMarks = 100) => {
  if (mark === '' || mark === null || mark === undefined) {
    return { valid: false, error: 'Mark is required' };
  }
  const num = Number(mark);
  if (Number.isNaN(num)) {
    return { valid: false, error: 'Mark must be a numeric value' };
  }
  if (num < 0 || num > maxMarks) {
    return { valid: false, error: `Mark must be between 0 and ${maxMarks}` };
  }
  return { valid: true };
};
