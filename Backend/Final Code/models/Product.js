import mongoose from "mongoose";
import slugify from "slugify"; // install with: npm install slugify

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  prime: { type: Boolean, default: false },
  img: { type: String },
  slug: { type: String, unique: true } // keep unique slug
});

// Middleware: generate slug automatically
productSchema.pre("save", function(next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
