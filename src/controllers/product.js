const productService = require('../services/product');
const catchAsync = require('../middlewares/catchAsync');

function productDto(task) {
  const {
    id, name, price, quantity, createdAt, updatedAt,
  } = product;

  return {
    id,
    name,
    price,
    quantity,
    createdAt,
    updatedAt,
  };
}

const getProductById = catchAsync(async (req, res) => {
  const result = await productService.getProductById(req.params.id);

  if (result) {
    res.status(200).json({ success: true, product: productDto(result) });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

const createProduct = catchAsync(async (req, res) => {
  const result = await productService.createProduct(req.body.name, req.body.price,req.body.quantity);

  res.status(201).json({
    success: true,
    product: productDto(result),
  });
});

const updateProductById = catchAsync(async (req, res) => {
  const result = await productService.updateProductById(req.params.id, req.body);
  if (result.error) {
    switch (result.code) {
      case productService.errorCodes.AT_LEAST_ONE_UPDATE_REQUIRED_CODE:
        res.status(400).json({ success: false, message: 'at least one update required' });
        return;
      case productService.errorCodes.INVALID_STATUS_CODE:
        res.status(400).json({ success: false, message: 'invalid status' });
        return;
      case productService.errorCodes.INVALID_STATUS_TRANSITION_CODE:
        res.status(404).json({ success: false, message: 'task not found' });
        return;
      case productService.errorCodes.TASK_NOT_FOUND_CODE:
        res.status(400).json({ success: false, message: result.error });
        return;
      case productService.errorCodes.CONCURRENCY_ERROR_CODE:
        res.status(500).json({ success: false, message: 'concurrency error' });
        return;
      default:
        res.status(500).json({ success: false, message: 'internal server error' });
        return;
    }
  }

  res.status(200).json({
    success: true,
    product: productDto(result),
  });
});

module.exports = {
  getProductById,
  createProduct,
  updateProductById,
};