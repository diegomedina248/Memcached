const Resolver = require('../server/base/resolver.js')
const { CommandResolver, Command } = require('../server/command/base')

jest.mock('../server/command/base/command-resolver.js')
jest.mock('../server/command/base/command.js')

describe('Checking correct command and data parsing', () => {
  let resolver
  let commandResolver
  let command

  beforeEach(() => {
    command = new Command()

    commandResolver = new CommandResolver()
    commandResolver.parseCommand = jest.fn().mockImplementation(data => command)

    resolver = new Resolver(null, null)
    resolver.commandResolver = commandResolver

    CommandResolver.mockClear()
  })

  test('Single non ending data should be buffered', () => {
    resolver.handleRequest('some')
    expect(CommandResolver).not.toHaveBeenCalled()
    expect(resolver.buffer).toBe('some')
  })

  test('Multiple non ending data should be buffered', () => {
    const data = ['first', 'second', 'third']

    data.reduce((acc, current) => {
      resolver.handleRequest(current)
      expect(CommandResolver).not.toHaveBeenCalled()
      expect(resolver.buffer).toBe(acc + current)
      return acc + current
    }, '')
  })

  test('Single data with ending should trigger the command parsing', () => {
    const line = 'some'

    resolver.handleRequest(line + '\r\n')

    expect(resolver.buffer).toBe('')
    expect(commandResolver.parseCommand).toHaveBeenCalledWith(line)
    expect(command.execute).toHaveBeenCalledWith([], null)
  })

  test('Single data with ending plus buffered info should trigger the command parsing', () => {
    const bufferedLine = 'some'
    const endingLine = ' test'

    resolver.handleRequest(bufferedLine)
    expect(resolver.buffer).toBe(bufferedLine)

    resolver.handleRequest(endingLine + '\r\n')
    expect(resolver.buffer).toBe('')
    expect(commandResolver.parseCommand).toHaveBeenCalledWith(bufferedLine + endingLine)
    expect(command.execute).toHaveBeenCalledWith([], null)
  })

  test('Multiline data with ending should trigger command parsing and command execution with data', () => {
    const line = 'some\r\ndata\r\n'

    resolver.handleRequest(line)

    expect(resolver.buffer).toBe('')
    expect(commandResolver.parseCommand).toHaveBeenCalledWith('some')
    expect(command.execute).toHaveBeenCalledWith(['data'], null)
  })
})
