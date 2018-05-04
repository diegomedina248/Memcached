import joi from 'joi'
import winston from 'winston'

const schema = joi.object({
  LOGGER_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
}).unknown()
  .required()

/** Class that initializes the system logger */
class Logger {
  /**
   * Initializes and builds the logger
   * @return {winston.Logger} The initialized logger instance
   */
  build() {
    const { error, value } = joi.validate(process.env, schema)

    if (error) {
      throw new Error(`Config error: ${error.message}`)
    }

    const logger = winston.createLogger({
      level: value.LOGGER_LEVEL,
      format: winston.format.json(),
    })

    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }))

    return logger
  }
}

export const logger = new Logger().build()
