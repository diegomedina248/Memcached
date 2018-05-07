const { SetCommand, AddCommand, ReplaceCommand, AppendCommand, CasCommand } = require('./command')

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
      case COMMAND_ADD: return new AddCommand(params, store)
      case COMMAND_REPLACE: return new ReplaceCommand(params, store)
      case COMMAND_APPEND: return new AppendCommand(params, store, false)
      case COMMAND_PREPEND: return new AppendCommand(params, store, true)
      case COMMAND_CAS: return new CasCommand(params, store)
      default: return null
    }
  }
}

module.exports = StorageCommandResolver
