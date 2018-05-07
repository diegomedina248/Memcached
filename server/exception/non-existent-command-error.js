const MESSAGE = 'ERROR'

/** Error class to handle unidentified requests */
class NonExistentCommandError extends Error {
  /** @inheritDoc */
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, NonExistentCommandError)
  }

  /** @inheritDoc */
  toString() {
    return MESSAGE
  }
}

module.exports = NonExistentCommandError
