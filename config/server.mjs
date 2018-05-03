import joi from 'joi'

const schema = joi.object({
  PORT: joi.number()
    .default(4000),
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .required()
}).unknown()
  .required()

class Server {
  build() {
    const { error, value } = joi.validate(process.env, schema)

    if (error)
      throw new Error(`Config validation error: ${error.message}`)
        
    return {
      port: value.PORT,
      env: value.NODE_ENV
    }
  }
}

export const server = new Server().build()