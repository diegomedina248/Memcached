const { Command } = require('../../base')
const { Item } = require('../../../store')
const { ClientError } = require('../../../exception')

const NO_REPLY = 'noreply'
const LENGTH_MESSAGE = 'The length of the data is different than specified'
const MALFORMED_DATA_MESSAGE = 'More than one value received'

/** Generic `storage` command to be extended by the actual commands */
class StorageCommand extends Command {
  /** @inheritDoc */
  constructor(structure, store) {
    super(structure, store)
    const [key, flags, exptime, bytes, ...optionals] = structure
    this.key = key
    this.flags = Number.parseInt(flags)
    this.exptime = Number.parseInt(exptime)
    this.bytes = Number.parseInt(bytes)
    this.optionals = optionals
    this.finished = false
    this.reply = optionals[0] !== NO_REPLY
  }

  /** @inheritDoc */
  isValid() {
    return this.key && !Number.isNaN(this.flags)
      && !Number.isNaN(this.exptime) && !Number.isNaN(this.bytes)
  }

  /** @inheritDoc */
  execute(data, handleWrite) {
    if (!Array.isArray(data) || data.length > 1) {
      throw new ClientError(MALFORMED_DATA_MESSAGE)
    }

    if (data[0].length != this.bytes) {
      throw new ClientError(LENGTH_MESSAGE)
    }
  }

  /** @inheritDoc */
  isFinished() {
    return this.finished
  }

  /**
   * Creates an item object from the data sent by the client
   * @param {string} data the data sent by the client
   * @return {Item} the created item
   */
  toEntity(data) {
    return new Item(this.key, this.flags, this.exptime, this.bytes, data)
  }
}

module.exports = StorageCommand
