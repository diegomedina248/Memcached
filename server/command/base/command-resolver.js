const RetrievalCommandResolver = require('../retrieval')
const StorageCommandResolver = require('../storage')
const { NonExistentCommandError, ClientError } = require('../../exception')

const EMPTY_COMMAND_MESSAGE = 'Empty command'
const INVALID_COMMAND_MESSAGE = 'The command is invalid'

class CommandResolver {
  constructor(store) {
    this.store = store
    this.resolvers = [new RetrievalCommandResolver(), new StorageCommandResolver()]
  }

  parseCommand(data) {
    this.validateCommand(data)

    const parsedCommand = this.resolvers
      .reduce((command, resolver) => command || resolver.resolve(data, this.store), null)
    
    if (!parsedCommand) {
      throw new NonExistentCommandError()
    }

    if (!parsedCommand.isValid()) {
      throw new ClientError(INVALID_COMMAND_MESSAGE)
    }

    return parsedCommand
  }

  validateCommand(data) {
    if (!data || typeof data != 'string') {
      throw new ClientError(EMPTY_COMMAND_MESSAGE)
    }
  }
}

module.exports = CommandResolver
