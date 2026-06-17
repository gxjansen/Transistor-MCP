/**
 * Date format utilities for the Transistor API.
 *
 * The Transistor API expects dates in dd-mm-yyyy format, but ISO yyyy-mm-dd
 * is far more natural for LLMs and less error-prone. These helpers detect
 * which format was provided and convert to the API's expected format.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TRANSISTOR_DATE_RE = /^\d{2}-\d{2}-\d{4}$/;

/**
 * Verify that y/m/d form a real calendar date (e.g. reject 2025-13-40 or
 * 2025-02-30). Returns true only when the numbers round-trip through Date.
 */
function isRealDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

/**
 * Convert a date string to Transistor's dd-mm-yyyy format.
 * Accepts either ISO (yyyy-mm-dd) or already-correct (dd-mm-yyyy).
 * Returns undefined for undefined input.
 * Throws on a syntactically-ISO string that is not a real calendar date.
 */
export function toTransistorDate(date: string | undefined): string | undefined {
  if (!date) return undefined;

  if (ISO_DATE_RE.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    if (!isRealDate(year, month, day)) {
      throw new Error(
        `Invalid date "${date}": expected a real calendar date in yyyy-mm-dd format.`
      );
    }
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  }

  if (TRANSISTOR_DATE_RE.test(date)) {
    // Already in Transistor dd-mm-yyyy format (ambiguous: dd-mm vs mm-dd is
    // not validated here — passed through and resolved server-side).
    return date;
  }

  // Unknown format — pass through and let the API reject if invalid
  return date;
}

/**
 * Convert a Transistor dd-mm-yyyy date string to ISO yyyy-mm-dd.
 */
export function toIsoDate(date: string): string {
  if (ISO_DATE_RE.test(date)) return date;

  if (TRANSISTOR_DATE_RE.test(date)) {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  }

  return date;
}
