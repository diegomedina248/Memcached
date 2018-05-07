const StorageCommand = require('./storage-command.js')
const responses = require('./responses.js')

/** Command to handle add requests */
class AddCommand extends StorageCommand {
  /** @inheritDoc */
  execute(data, handleWrite) {
    if (data.length == 0) {
      return
    }

    super.execute(data, handleWrite)

    if (this.store.get(this.key)) {
      this.write(handleWrite, responses.notStored)
    } else {
      this.store.set(this.key, this.toEntity(data[0]))
      this.write(handleWrite, responses.stored)
    }
    
    this.finished = true
  }
}

module.exports = AddCommand
