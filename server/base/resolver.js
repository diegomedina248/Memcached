const { logger } = require('../../config')
const CommandResolver = require('../command')

const END_LINE = '\r\n'

class Resolver {
  constructor(handleWrite, store) {
    this.handleWrite = handleWrite
    this.store = store
    this.commandResolver = new CommandResolver(store)
    this.buffer = ''
    this.command = null
  }

  handleRequest(info) {
    const hasEndLine = info.includes(END_LINE)
    
    if (!hasEndLine) {
      this.buffer += info
    } else {
      const commands = info.split(END_LINE)
      this.parseRequest(commands)
    }
  }

  parseRequest(lines) {
    this.addBufferToFirstLine(lines)
    this.addLastLineToBufferIfNeeded(lines)
    this.parseCommand(lines)
    this.executeCommand(lines)
  }

  addBufferToFirstLine(lines) {
    lines[0] = this.buffer + lines[0]
    this.buffer = ''
  }

  addLastLineToBufferIfNeeded(lines) {
    const lastLine = lines.pop()
    if (lastLine) {
      this.buffer = lastLine
    }
  }

  parseCommand(lines) {
    if (!this.command) {
      const commandLine = lines.shift()
      this.command = this.commandResolver.parseCommand(commandLine)
    }
  }

  executeCommand(lines) {
    try {
      this.command.execute(lines, this.handleWrite)
      if (this.command.isFinished()) {
        this.command = null
      }
    } catch (exception) {
      this.command = null
      throw exception
    }
  }
}

module.exports = Resolver
