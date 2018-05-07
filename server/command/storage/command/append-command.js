const StorageCommand = require('./storage-command.js')
const responses = require('./responses.js')

/** Command to handle append and prepend requests */
class AppendCommand extends StorageCommand {
  /**
   * Constructs the object
   * @param {Array} structure the space-separated parts of the command, not including it's name
   * @param {Store} store the in-memory storage
   * @param {boolean} prepend if true, it will add the new data before the existing one
   */
  constructor(structure, store, prepend) {
    super(structure, store)
    this.prepend = prepend
  }

  /** @inheritDoc */
  execute(data, handleWrite) {
    if (data.length == 0) {
      return
    }

    super.execute(data, handleWrite)
    const item = this.store.get(this.key)

    if (!item) {
      this.write(handleWrite, responses.notStored)
    } else {
      item.bytes += this.bytes
      item.data = this.prepend ? data[0] + item.data : item.data + data[0]
      
      this.store.set(this.key, item)
      this.write(handleWrite, responses.stored)
    }
    
    this.finished = true
  }
}

module.exports = AppendCommand
