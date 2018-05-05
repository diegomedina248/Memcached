const MESSAGE_SERVER_ERROR = 'SERVER_ERROR'

class ServerError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, ServerError)
  }

  toString() {
    return `${MESSAGE_SERVER_ERROR} ${this.message || ''}`
  }
}

module.exports = ServerError
