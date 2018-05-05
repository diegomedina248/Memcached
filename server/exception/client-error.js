const MESSAGE_CLIENT_ERROR = 'CLIENT_ERROR'

class ClientError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, ClientError)
  }

  toString() {
    return `${MESSAGE_CLIENT_ERROR} ${this.message || ''}`
  }
}

module.exports = ClientError
