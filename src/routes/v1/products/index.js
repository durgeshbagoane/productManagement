const { Router } = require('express');
const productController = require('../../../controllers/product');
const productValidation = require('../../../validation/product');
const validate = require('../../../middlewares/validate');

const router = Router();

router.get('/:id', validate(productValidation.getProductById), productController.getProductById);
router.put('/', validate(productValidation.createProduct), productController.createProduct);
router.post('/:id', validate(productValidation.updateProductById), productController.updateProductById);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Product management and retrieval
 * /v1/products/{id}:
 *  get:
 *   summary: Get a product by id
 *   tags: [Products]
 *   description: Get a product by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       required: true
 *       description: Product id
 *       example: 5f0a3d9a3e06e52f3c7a6d5c
 *   responses:
 *    200:
 *     description: Product Retrieved
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductResult'
 *    404:
 *     description: Product not found
 *    500:
 *     description: Internal Server Error
 *  post:
 *   summary: Update a product by id
 *   tags: [Products]
 *   description: Update a product by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       required: true
 *       description: Product id
 *       example: 5f0a3d9a3e06e52f3c7a6d5c
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateProduct'
 *   responses:
 *    200:
 *     description: Product Updated
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductResult'
 *     404:
 *      description: Product not found
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ProductResult'
 *     500:
 *      description: Internal Server Error
 * /v1/products:
 *  put:
 *   summary: Create a product
 *   tags: [Products]
 *   description: Create a products
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateProduct'
 *   responses:
 *    201:
 *     description: Product Created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductResult'
 *    500:
 *     description: Internal Server Error
 */