const { faker } = require('@faker-js/faker');
const Product = require('../../../src/models/product');
const productService = require('../../../src/services/product');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ProductService', () => {
  describe('getProductById', () => {
    it('should return a product', async () => {
      const objId = faker.string.uuid();
      const price = faker.number.int;
      const quantity = faker.number.int;
      const product = { id: objId, price, quantity };
      jest.spyOn(Product, 'findById').mockImplementation((id) => (objId === id ? product : undefined));
      const result = await productService.getProductById(objId);
      expect(result.id).toEqual(objId);
      expect(result.price).toEqual(price);
      expect(result.quantity).toEqual(quantity);
      expect(Product.findById).toBeCalledWith(objId);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const name = faker.string.uuid();
      const price = faker.number.int;
      const quantity = faker.number.int;
      jest.spyOn(Product, 'create').mockResolvedValue({ name, price, quantity });
      const result = await productService.createProduct(name, price, quantity);
      expect(result.name).toEqual(name);
      expect(result.price).toEqual(price);
      expect(result.quantity).toEqual(quantity);
      expect(Product.create).toBeCalledWith({ name, price, quantity });
    });
  });
});
