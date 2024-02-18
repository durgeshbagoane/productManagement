const { Router } = require('express');
const productRouter = require('./products');

const router = Router();

router.use('/products', productRouter);

module.exports = router;