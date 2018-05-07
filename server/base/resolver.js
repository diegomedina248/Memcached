const CommandResolver = require('../command')
const { NonExistentCommandError, ClientError, ServerError } = require('../exception')

const SERVER_ERROR_MESSAGE = 'There was a problem handling your request. Please try again later'
const END_LINE = '\r\n'

/** Class that handle the requests from the client and sends back the appropiate response */
class Resolver {
  /**
   * Constructs the object
   * @param {Function} handleWrite callback function to write the responses
   * @param {Store} store in-memory storage
   */
  constructor(handleWrite, store) {
    this.handleWrite = handleWrite
    this.store = store
    this.commandResolver = new CommandResolver(store)
    this.buffer = ''
    this.command = null
  }

  /**
   * Handles the request from the client and decides how to respond based on the command received, if any
   * @param {string} info the received request
   */
  handleRequest(info) {
    const hasEndLine = info.includes(END_LINE)
    
    if (!hasEndLine) {
      this.buffer += info
    } else {
      const commands = info.split(END_LINE)
      this.parseRequest(commands)
    }
  }

  /**
   * Parses the request and, if a command is present, writes the appropiate response
   * @param {Array} lines the request received (one for each line terminated in \r\n)
   */
  parseRequest(lines) {
    this.addBufferToFirstLine(lines)
    this.addLastLineToBufferIfNeeded(lines)
    this.parseCommand(lines)
    this.executeCommand(lines)
  }

  /**
   * If the last request didn't finish with \r\n, add that to the first request received
   * @param {Array} lines the current requests
   */
  addBufferToFirstLine(lines) {
    lines[0] = this.buffer + lines[0]
    this.buffer = ''
  }

  /**
   * If the last line contains text, add it to the buffer (since it doesn't have \r\n ending)
   * @param {Array} lines the current requests
   */
  addLastLineToBufferIfNeeded(lines) {
    const lastLine = lines.pop()
    if (lastLine) {
      this.buffer = lastLine
    }
  }

  /**
   * Remove the first line and parse it to obtain, if possible, a valid command to execute
   * @param {Array} lines the current Request
   */
  parseCommand(lines) {
    if (!this.command) {
      const commandLine = lines.shift()
      this.command = this.commandResolver.parseCommand(commandLine)
    }
  }

  /**
   * Executes the current command with the received data
   * @param {Array} lines the data received
   */
  executeCommand(lines) {
    try {
      this.command.execute(lines, this.handleWrite)
      if (this.command.isFinished()) {
        this.command = null
      }
    } catch (exception) {
      this.command = null
      
      if (exception instanceof ClientError || exception instanceof NonExistentCommandError) {
        throw exception
      }

      throw new ServerError(SERVER_ERROR_MESSAGE)
    }
  }
}

module.exports = Resolver
