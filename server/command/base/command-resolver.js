const RetrievalCommandResolver = require('../retrieval')
const StorageCommandResolver = require('../storage')
const { NonExistentCommandError, ClientError } = require('../../exception')

const EMPTY_COMMAND_MESSAGE = 'Empty command'
const INVALID_COMMAND_MESSAGE = 'The command is invalid'

/** Resolves the command to execute based on the request from the client */
class CommandResolver {
  /**
   * Constructs the object
   * @param {Store} store the in-memory storage
   */
  constructor(store) {
    this.store = store
    this.resolvers = [new RetrievalCommandResolver(), new StorageCommandResolver()]
  }

  /**
   * Parses the request received in search for a valid command to execute
   * @param {string} data the request from the client
   * @throws {NonExistentCommandError} if no command is found
   * @throws {ClientError} if the command is malformed
   * @return {Command} the parsed command
   */
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

  /**
   * Validates that the data is a string
   * @param {Object} data the request from the client
   */
  validateCommand(data) {
    if (!data || typeof data != 'string') {
      throw new ClientError(EMPTY_COMMAND_MESSAGE)
    }
  }
}

module.exports = CommandResolver
