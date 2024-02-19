const { faker } = require('@faker-js/faker');
const fetch = require('node-fetch');
const { setupServer } = require('./server');

setupServer();

describe('Product', () => {
  const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/v1/products`;

  describe('get', () => {
    it('should return 404', async () => {
      const response = await fetch(`${baseUrl}/${faker.database.mongodbObjectId()}`);
      expect(response.status).toEqual(404);

      const result = await response.json();
      expect(result).toEqual({ success: false, message: 'product not found' });
    });

    describe('should return 400', () => {
      const data = [
        {
          name: 'number',
          id: '1234567890',
        },
        {
          name: 'uuid',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        {
          name: 'string',
          id: 'abc',
        },
      ];

      data.forEach(({ name, id }) => {
        it(name, async () => {
          const response = await fetch(`${baseUrl}/${id}`);
          expect(response.status).toEqual(400);

          const result = await response.json();
          expect(result).toEqual({
            success: false,
            message: `"id" with value "${id}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`,
          });
        });
      });
    });
  });

  describe('create & update', () => {
    describe('update', () => {
      it('should return 404', async () => {
        const response = await fetch(`${baseUrl}/${faker.database.mongodbObjectId()}`, {
          method: 'post',
          body: JSON.stringify({
            name: faker.lorem.word(),
            price: faker.number.int,
            quantity: faker.number.int,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        expect(response.status).toEqual(404);

        const result = await response.json();

        expect(result).toEqual({ success: false, message: 'product not found' });
      });

      describe('should return 400', () => {
        it('no updates', async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: 'product 1',
              price: 2,
              quantity:4,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.success).toEqual(true);
          expect(result.product).not.toBeNull();
          expect(result.product.id).not.toBeNull();

          response = await fetch(`${baseUrl}/${result.product.id}`, {
            method: 'post',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(400);

          const result2 = await response.json();

          expect(result2).toEqual({
            success: false,
            message: 'at least one update required',
          });
        });

        it('invalid status', async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: 'Product 1',
              price: 1,
              quantity:1,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.product).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.product.id).not.toBeNull();
        });
      });
    });

    describe('should create & update a product', () => {
      const data = [
        {
          name: 'only status update',
          productName: 'product 1',
          price: 1,
          quantity: 2,
        },
        {
          name: 'english full update',
          productName: 'product 1',
          newProductName: 'Product 1 New',
          newprice: 3,
          newQuantity: 4,
        },
        {
          name: 'english only name update',
          productName: 'Product 1',
          price:1,
          newProductName: 'Product 1 New',
        },
        {
          name: 'english only description update',
          productName: ' 1',
          price: 2,
          newPrice: 35,
        },
      ];

      data.forEach(({
        name, productName, price, newProductName, newPrice,quantity, newQuantity,
      }) => {
        it(name, async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: productName,
              price,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.product).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.product.id).not.toBeNull();

          response = await fetch(`${baseUrl}/${result.product.id}`, {
            method: 'post',
            body: JSON.stringify({
              name: newProductName,
              price: newPrice,
              quantity: newQuantity,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(200);

          const result2 = await response.json();

          expect(result2).toEqual({
            success: true,
            product: {
              id: result.product.id,
              name: newProductName ?? productName,
              price: newPrice ?? price,
              quantity: newQuantity ?? 1,
              createdAt: result.product.createdAt,
              updatedAt: expect.any(String),
            },
          });

          expect(new Date() - new Date(result2.product.updatedAt)).toBeLessThan(1000);
        });
      });
    });

    describe('concurrent updates', () => {
      it('one should 200, another 400', async () => {
        for (let i = 0; i < 20; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: faker.lorem.word(),
              price: faker.number.int,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          // eslint-disable-next-line no-await-in-loop
          const result = await response.json();

          expect(result.product).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.product.id).not.toBeNull();

          // eslint-disable-next-line no-await-in-loop
          response = await fetch(`${baseUrl}/${result.product.id}`, {
            method: 'post',
            body: JSON.stringify({
              quantity: 1,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(200);

          const promise1 = fetch(`${baseUrl}/${result.product.id}`, {
            method: 'post',
            body: JSON.stringify({
              quantity: 3,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const promise2 = fetch(`${baseUrl}/${result.product.id}`, {
            method: 'post',
            body: JSON.stringify({
              quantity: 4,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          // eslint-disable-next-line no-await-in-loop
          const [response1, response2] = await Promise.all([promise1, promise2]);

          if (response1.status === 200) {
            expect(response1.status).toEqual(200);
            expect(response2.status).toEqual(400);
          } else {
            expect(response2.status).toEqual(200);
            expect(response1.status).toEqual(400);
          }
        }
      });
    });
  });
});