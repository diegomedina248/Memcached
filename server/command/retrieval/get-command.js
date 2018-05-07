const Command = require('../base/command.js')
const { ClientError } = require('../../exception')

const END_MESSAGE = 'END'
const MALFORMED_DATA_MESSAGE = 'Command does not requires extra data'

/** Command to handle get requests */
class GetCommand extends Command {
  /**
   * Constructs the object
   * @param {Array} structure the space-separated parts of the command, not including it's name
   * @param {Store} store the in-memory storage
   * @param {boolean} secure if true, it will be interpreted as `gets` command instead
   */
  constructor(structure, store, secure) {
    super(structure, store)
    this.keys = [...(new Set(structure))].filter(item => item)
    this.secure = secure
    this.finished = false
  }

  /** @inheritDoc */
  isValid() {
    return this.keys && this.keys.length > 0
  }

  /** @inheritDoc */
  execute(data, handleWrite) {
    if (!Array.isArray(data) || data.length > 0) {
      throw new ClientError(MALFORMED_DATA_MESSAGE)
    }

    const items = this.keys.map(key => this.store.get(key)).filter(item => item)
    items.forEach(item => {
      handleWrite(item.getDescription(this.secure))
      handleWrite(item.data)
    })
    handleWrite(END_MESSAGE)

    this.finished = true
  }

  /** @inheritDoc */
  isFinished() {
    return this.finished
  }
}

module.exports = GetCommand
