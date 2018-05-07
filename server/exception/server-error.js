const MESSAGE_SERVER_ERROR = 'SERVER_ERROR'

/** Error class to handle server related errors */
class ServerError extends Error {
  /** @inheritDoc */
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, ServerError)
  }

  /** @inheritDoc */
  toString() {
    return `${MESSAGE_SERVER_ERROR} ${this.message || ''}`
  }
}

module.exports = ServerError
