import axios from "axios";

async function convert(country, amount) {
  const countryCode = await code(country);
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=USD&to=${countryCode}`;
  try {
    const result = await axios.get(url);
    const convertedAmount = result.data.rates[countryCode];
    return convertedAmount;
  } catch (error) {
    console.error("Error fetching exchange rate:", error.message);
    return 0.0;
  }
}

async function code(country) {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const currencyCode = Object.keys(response.data[0].currencies)[0];
    return currencyCode;
  } catch (error) {
    console.error("Error fetching currency code:", error.message);
  }
  return "USD";
}

export default convert;
