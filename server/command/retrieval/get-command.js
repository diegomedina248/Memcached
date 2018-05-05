const { Command } = require('../base')
const { Item } = require('../../store')
const { ClientError } = require('../../exception')

const END_MESSAGE = 'END'
const MALFORMED_DATA_MESSAGE = 'Command does not requires extra data'

class GetCommand extends Command {
  constructor(structure, store, secure) {
    super(structure, store)
    this.keys = structure.filter(item => item)
    this.secure = secure
    this.finished = false
  }

  isValid() {
    return this.keys && this.keys.length > 0
  }

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

  isFinished() {
    return this.finished
  }
}

module.exports = GetCommand
