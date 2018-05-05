const { Command } = require('../../base')
const { Item } = require('../../../store')
const { ClientError } = require('../../../exception')

const NO_REPLY = 'noreply'
const LENGTH_MESSAGE = 'The length of the data is different than specified'
const MALFORMED_DATA_MESSAGE = 'More than one value received'

class StorageCommand extends Command {
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

  isValid() {
    return this.key && !Number.isNaN(this.flags) 
      && !Number.isNaN(this.exptime) && !Number.isNaN(this.bytes) 
  }

  execute(data, handleWrite) {
    if (!Array.isArray(data) || data.length > 1) {
      throw new ClientError(MALFORMED_DATA_MESSAGE)
    }

    if (data[0].length != this.bytes) {
      throw new ClientError(LENGTH_MESSAGE)
    }
  }

  isFinished() {
    return this.finished
  }

  toEntity(data) {
    return new Item(this.key, this.flags, this.exptime, this.bytes, Date.now(), data)
  }
}

module.exports = StorageCommand
