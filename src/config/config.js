const dotenv = require('dotenv');
const joi = require('joi');

const envVarsSchema = joi.object()
  .keys({
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(19009),
    MONGODB_URL: joi.string().required().description('MongoDB Url'),
    LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'debug').default('info'),

  }).unknown();

function createConfig(configPath) {
  dotenv.config({
    path: configPath,
  });
  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongo: {
      url: envVars.MONGODB_URL,
    },
    logLevel: envVars.LOG_LEVEL,
  };
}

module.exports = {
  createConfig,
};
