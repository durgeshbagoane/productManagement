const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const getProductById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
  }),
};

const updateProductById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    quantity: Joi.number().optional(),
  }),
};

module.exports = {
  getProductById,
  createProduct,
  updateProductById,
};