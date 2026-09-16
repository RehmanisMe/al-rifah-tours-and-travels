/** Formats a number as Indian rupees, rounded to whole rupees. */
export function formatCurrency(amount) {
  return '\u20B9' + Math.round(amount).toLocaleString('en-IN');
}
