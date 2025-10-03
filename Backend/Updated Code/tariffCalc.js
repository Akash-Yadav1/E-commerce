import main from "./connectDb.js";
import Tariff from "./models/Tariff.js";

// Get number of countries

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.error(err));

async function tariffCalc(country, price) {
  let countryTariff = await Tariff.findOne({ country: country });
  const tariffCost = (price * countryTariff.tariff) / 100;
  const finalCost = price + tariffCost;
  console.log(finalCost);
  return finalCost;
}

export default tariffCalc;
