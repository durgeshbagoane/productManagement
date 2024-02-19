const { version } = require('../../package.json');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product Management API',
    version,
    description: 'Product Management API',
    license: {
      name: 'MIT',
    },
    contact: {
      name: 'Product Management API',
    },
  },
};

module.exports = swaggerDefinition;
