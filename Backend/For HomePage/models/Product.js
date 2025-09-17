const mongoose = require("mongoose");
const slugify = require("slugify");


const productSchema = new mongoose.Schema({
title: { type: String, required: true, trim: true },
slug: { type: String, unique: true },
description: { type: String },
category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
price: { type: Number, required: true },
oldPrice: { type: Number },
stock: { type: Number, default: 0 },
images: [{ type: String }],
rating: { type: Number, default: 0, min: 0, max: 5 },
ratingCount: { type: Number, default: 0 }
}, { timestamps: true });


productSchema.pre("validate", function(next) {
if (!this.slug && this.title) {
this.slug = slugify(this.title, { lower: true, strict: true });
}
next();
});


module.exports = mongoose.model("Product", productSchema);