import joi from 'joi'
import winston from 'winston'

const schema = joi.object({
  LOGGER_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  LOGGER_ENABLED: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(true)
}).unknown()
  .required()

class Logger {
  build() {
    const { error, value } = joi.validate(process.env, schema)

    if (error)
      throw new Error(`Config error: ${error.message}`)

    const logger = winston.createLogger({
      level: value.LOGGER_LEVEL,
      format: winston.format.json()
    });

    if (value.LOGGER_ENABLED)
      logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }))
    
    return logger
  }
}

export const logger = new Logger().build()