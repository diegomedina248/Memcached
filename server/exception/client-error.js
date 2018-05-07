const MESSAGE_CLIENT_ERROR = 'CLIENT_ERROR'

/** Error class to handle client related errors */
class ClientError extends Error {
  /** @inheritDoc */
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, ClientError)
  }

  /** @inheritDoc */
  toString() {
    return `${MESSAGE_CLIENT_ERROR} ${this.message || ''}`
  }
}

module.exports = ClientError
