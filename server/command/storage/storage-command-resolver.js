const { SetCommand } = require('./command')

const COMMAND_SET = 'set'
const COMMAND_ADD = 'add'
const COMMAND_REPLACE = 'replace'
const COMMAND_APPEND = 'append'
const COMMAND_PREPEND = 'prepend'
const COMMAND_CAS = 'cas'

/** Class that handles the `storage` command category */
class StorageCommandResolver {
  /**
   * Parses the data and returns the appropiate command for any of the `storage` category
   * @param {Array} data the data sent by the client
   * @param {Store} store the in-memory storage
   * @return {Command} the parsed command, or null if none was found
   */
  resolve(data, store) {
    const [command, ...params] = data.split(' ')

    switch (command) {
      case COMMAND_SET: return new SetCommand(params, store)
      case COMMAND_ADD: return null
      case COMMAND_REPLACE: return null
      case COMMAND_APPEND: return null
      case COMMAND_PREPEND: return null
      case COMMAND_CAS: return null
      default: return null
    }
  }
}

module.exports = StorageCommandResolver
