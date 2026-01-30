/**
 * Convert number to words in Indian numbering system
 * Example: 1,23,456 = "One Lakh Twenty Three Thousand Four Hundred Fifty Six"
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

/**
 * Convert a number less than 100 to words
 */
function convertLessThanHundred(num: number): string {
  if (num < 20) {
    return ones[num];
  }
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return tens[ten] + (one > 0 ? " " + ones[one] : "");
}

/**
 * Convert a number less than 1000 to words
 */
function convertLessThanThousand(num: number): string {
  if (num < 100) {
    return convertLessThanHundred(num);
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return (
    ones[hundred] +
    " Hundred" +
    (remainder > 0 ? " " + convertLessThanHundred(remainder) : "")
  );
}

/**
 * Convert amount to words in Indian format
 * @param amount - The amount to convert (can include decimals)
 * @returns Amount in words with "Rupees" and "Paise"
 */
export function convertAmountToWords(amount: number): string {
  if (amount === 0) {
    return "Zero Rupees Only";
  }

  if (amount < 0) {
    return "Minus " + convertAmountToWords(Math.abs(amount));
  }

  // Split into rupees and paise
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = "";

  if (rupees > 0) {
    words = convertToWords(rupees) + " Rupees";
  }

  if (paise > 0) {
    if (words) {
      words += " and ";
    }
    words += convertToWords(paise) + " Paise";
  }

  return words + " Only";
}

/**
 * Convert a number to words (without Rupees/Paise)
 */
export function convertToWords(num: number): string {
  if (num === 0) {
    return "Zero";
  }

  if (num < 0) {
    return "Minus " + convertToWords(Math.abs(num));
  }

  // Handle decimal values by rounding
  num = Math.floor(num);

  // Indian numbering: Crore, Lakh, Thousand, Hundred
  // 1 Crore = 100 Lakh = 10,000,000
  // 1 Lakh = 100,000
  // 1 Thousand = 1,000

  let words = "";

  // Crores (10,000,000)
  if (num >= 10000000) {
    words += convertLessThanThousand(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }

  // Lakhs (100,000)
  if (num >= 100000) {
    words += convertLessThanHundred(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  // Thousands (1,000)
  if (num >= 1000) {
    words += convertLessThanHundred(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  // Hundreds and below
  if (num > 0) {
    words += convertLessThanThousand(num);
  }

  return words.trim();
}

/**
 * Format amount for display with Indian numbering system
 * Example: 123456 -> "1,23,456"
 */
export function formatIndianNumber(num: number): string {
  const numStr = Math.abs(num).toFixed(2);
  const [intPart, decPart] = numStr.split(".");

  // Indian formatting: last 3 digits, then groups of 2
  let formatted = "";
  let count = 0;

  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      formatted = "," + formatted;
    }
    formatted = intPart[i] + formatted;
    count++;
  }

  const sign = num < 0 ? "-" : "";
  return sign + formatted + (decPart !== "00" ? "." + decPart : "");
}

/**
 * Format as Indian Rupees
 */
export function formatIndianRupees(amount: number): string {
  return "₹" + formatIndianNumber(amount);
}
