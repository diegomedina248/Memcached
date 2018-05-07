const StorageCommand = require('./storage-command.js')
const responses = require('./responses.js')

const NO_REPLY = 'noreply'

/** Command to handle cas requests */
class CasCommand extends StorageCommand {
  /** @inheritDoc */
  constructor(structure, store) {
    super(structure, store)

    this.casUnique = this.optionals[0]
    this.reply = this.optionals[1] !== NO_REPLY
  }

  /** @inheritDoc */
  execute(data, handleWrite) {
    if (data.length == 0) {
      return
    }

    super.execute(data, handleWrite)
    const item = this.store.get(this.key)

    if (!item) {
      this.write(handleWrite, responses.notFound)
    } else if (item.getCasUnique() !== this.casUnique) {
      this.write(handleWrite, responses.exists)
    } else {
      this.store.set(this.key, this.toEntity(data[0]))
      this.write(handleWrite, responses.stored)
    }
    
    this.finished = true
  }
}

module.exports = CasCommand
