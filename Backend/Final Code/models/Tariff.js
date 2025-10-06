import mongoose from "mongoose";
import { Schema } from "mongoose";

const tariffSchema = new Schema({
  country: Schema.Types.String,
  tariff: Schema.Types.Decimal128,
});

const Tariff = mongoose.model("Tariff", tariffSchema);

export default Tariff;