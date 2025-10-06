import Tariff from "./models/Tariff.js";
import convert from "./currencyConvert.js";

// Get number of countries


export const tariffCalc = async (country, price) => {
  let countryTariff = await Tariff.findOne({ country: country });
  if (countryTariff && countryTariff.tariff) {
    const tariffCost = (price * countryTariff.tariff) / 100;
    const finalCost = price + tariffCost;
    console.log(finalCost);
    return finalCost;
  } else {
    return price;
  }
};

export const finalCost = async (country, priceUS) => {
  const tariffCost = await tariffCalc(country, priceUS);
  const totalCost = await convert(country, tariffCost);
  // console.log(totalCost.toFixed(2));
};

finalCost("Canada", 100);
export default tariffCalc;