import mongoose from "mongoose";

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e_commerce");
}

export default main;
