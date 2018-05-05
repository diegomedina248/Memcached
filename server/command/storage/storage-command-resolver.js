const { SetCommand } = require('./command')

const COMMAND_SET = 'set'
const COMMAND_ADD = 'add'
const COMMAND_REPLACE = 'replace'
const COMMAND_APPEND = 'append'
const COMMAND_PREPEND = 'prepend'
const COMMAND_CAS = 'cas'

class StorageCommandResolver {
  resolve(data, store) {
    const [command, ...params] = data.split(' ')

    switch(command) {
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
