const StorageCommand = require('./storage-command.js')
const responses = require('./responses.js')

/** Command to handle set requests */
class SetCommand extends StorageCommand {
  /** @inheritDoc */
  execute(data, handleWrite) {
    if (data.length == 0) {
      return
    }

    super.execute(data, handleWrite)

    this.store.set(this.key, this.toEntity(data[0]))
    this.finished = true
    this.write(handleWrite, responses.stored)
  }
}

module.exports = SetCommand
