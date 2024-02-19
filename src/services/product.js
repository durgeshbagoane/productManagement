const logger = require('../config/logger');
const Product = require('../models/product');

function getProductById(id) {
  return Product.findById(id);
}

function createProduct(name, price, quantity) {
  return Product.create({ name, price, quantity });
}

const AT_LEAST_ONE_UPDATE_REQUIRED_CODE = 0;
const TASK_NOT_FOUND_CODE = 3;
const CONCURRENCY_ERROR_CODE = 4;

async function updateProductById(id, { name, price, quantity }) {
  if (!name && !price && !quantity) {
    return { error: 'at least one update required', code: AT_LEAST_ONE_UPDATE_REQUIRED_CODE };
  }

  for (let retry = 0; retry < 3; retry += 1) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findById(id);
    if (!product) {
      return { error: 'product not found', code: INVALID_STATUS_TRANSITION_CODE };
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.updatedAt = Date.now();

    try {
      // eslint-disable-next-line no-await-in-loop
      await product.save();
    } catch (error) {
      logger.warn('error during save', { error });
      if (error.name === 'VersionError') {
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    return product;
  }

  return { error: 'concurrency error', code: CONCURRENCY_ERROR_CODE };
}

module.exports = {
  getProductById,
  createProduct,
  updateProductById,

  errorCodes: {
    AT_LEAST_ONE_UPDATE_REQUIRED_CODE,
    TASK_NOT_FOUND_CODE,
    CONCURRENCY_ERROR_CODE,
  },
};
