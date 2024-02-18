const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: double,
      required: false,
    },
    quantity: {
        type: integer,
        required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { optimisticConcurrency: true },
);

module.exports = mongoose.model('product', ProductSchema);
