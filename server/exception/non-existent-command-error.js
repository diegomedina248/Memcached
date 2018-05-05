const MESSAGE = 'ERROR'

class NonExistentCommandError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, NonExistentCommandError)
  }

  toString() {
    return MESSAGE
  }
}

module.exports = NonExistentCommandError
