const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");


dotenv.config();


const products = [
{ title: "Headphones", price: 99.99, stock: 20, images: ["https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGVhZHBob25lfGVufDB8fDB8fHww"] },
{ title: "Camera", price: 299.99, stock: 15, images: ["https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtZXJhfGVufDB8fDB8fHww"] }
];


async function seed() {
try {
await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany({});
await Product.insertMany(products);
console.log("✅ Seeded products");
process.exit();
} catch (err) {
console.error(err);
process.exit(1);
}
}


seed();