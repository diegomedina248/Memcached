import joi from 'joi'

const schema = joi.object({
  PORT: joi.number()
    .default(4000),
  ADDRESS: joi.string()
    .default('127.0.0.1'),
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .required(),
}).unknown()
  .required()

/** Class that validates there's a env and port environment variables defined */
class Server {
  /**
   * Checks whether the PORT and NODE_ENV variables are present in the environment
   * @return {Object} a { port, env } object containing their value
   */
  build() {
    const { error, value } = joi.validate(process.env, schema)

    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
        
    return {
      port: value.PORT,
      env: value.NODE_ENV,
    }
  }
}

export const server = new Server().build()
