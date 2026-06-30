/**
 * Format a date object or string into YYYY-MM-DD
 */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const year = d.getFullYear();
  return [year, month, day].join('-');
};

/**
 * Format a date object or string to Thai local display format
 */
const formatThaiDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

module.exports = {
  formatDate,
  formatThaiDate
};
