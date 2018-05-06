const GetCommand = require('./get-command.js')

const COMMAND_GET = 'get'
const COMMAND_GETS = 'gets'

/** Class that handles get and gets commands */
class RetrievalCommandResolver {
  /**
   * Parses the data and returns the appropiate command if get or gets is detected
   * @param {Array} data the data sent by the client
   * @param {Store} store the in-memory storage
   * @return {Command} the parsed command, or null if none was found
   */
  resolve(data, store) {
    const [command, ...params] = data.split(' ')

    switch (command) {
      case COMMAND_GET: return new GetCommand(params, store, false)
      case COMMAND_GETS: return new GetCommand(params, store, true)
      default: return null
    }
  }
}

module.exports = RetrievalCommandResolver
