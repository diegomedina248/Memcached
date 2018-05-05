const GetCommand = require('./get-command.js')

const COMMAND_GET = 'get'
const COMMAND_GETS = 'gets'

class RetrievalCommandResolver {
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
