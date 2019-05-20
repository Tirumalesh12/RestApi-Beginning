const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String }
});

module.exports = Product = mongoose.model("Product", productSchema);