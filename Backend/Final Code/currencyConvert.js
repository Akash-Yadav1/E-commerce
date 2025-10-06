import axios from "axios";

const CURR_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$', JPY: '¥' };
const SUPPORTED = Object.keys(CURR_SYMBOL);
const cache = {};

export default async function convert(currencyCode, amount) {
  if (!SUPPORTED.includes(currencyCode)) return { value: amount, symbol: '$' };

  const amt = Number(amount);
  if (isNaN(amt)) return { value: amount, symbol: '$' };

  try {
    if (!cache[currencyCode]) {
      const res = await axios.get(`https://api.frankfurter.app/latest?amount=1&from=USD&to=${currencyCode}`);
      cache[currencyCode] = res.data.rates[currencyCode];
    }

    const rate = cache[currencyCode];
    return { value: amt * rate, symbol: CURR_SYMBOL[currencyCode] };
  } catch (err) {
    console.error("Currency conversion failed:", err.message);
    return { value: amount, symbol: '$' };
  }
}
