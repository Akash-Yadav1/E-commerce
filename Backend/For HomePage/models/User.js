const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true, lowercase: true },
name: { type: String, required: true },
passwordHash: { type: String, required: true },
role: { type: String, enum: ["customer", "staff", "admin"], default: "customer" }
}, { timestamps: true });


userSchema.virtual("password").set(function(password) {
this._plainPassword = password;
});


userSchema.pre("save", async function(next) {
if (this._plainPassword) {
const salt = await bcrypt.genSalt(10);
this.passwordHash = await bcrypt.hash(this._plainPassword, salt);
}
next();
});


userSchema.methods.verifyPassword = function(plain) {
return bcrypt.compare(plain, this.passwordHash);
};


module.exports = mongoose.model("User", userSchema);