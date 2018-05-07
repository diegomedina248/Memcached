const Client = require('../../server/base/client')
const Store = require('../../server/store/store.js')

describe('Checking client correctly responds to requests', () => {
  let client
  let socketMock

  beforeEach(() => {
    socketMock = {
      write: jest.fn().mockImplementation(text => text),
    }

    client = new Client(socketMock, new Store())
    
    global.console = {
      log: jest.fn(),
    }
  })

  test('Setting and getting an item', () => {
    client.handleData('set a 0 0 4\r\nasdf\r\n')
    client.handleData('get a\r\n')

    expect(socketMock.write.mock.calls).toEqual([
      ['STORED\r\n'],
      [`VALUE a 0 0 4\r\n`],
      ['asdf\r\n'],
      ['END\r\n'],
    ])
  })

  test('Setting and getting an item with errors in between', () => {
    client.handleData('get a\r\n')
    client.handleData('set a 0 0 4\r\nasdf\r\n')
    client.handleData('command\r\n')
    client.handleData('get a\r\n')

    expect(socketMock.write.mock.calls).toEqual([
      ['END\r\n'],
      ['STORED\r\n'],
      ['ERROR\r\n'],
      [`VALUE a 0 0 4\r\n`],
      ['asdf\r\n'],
      ['END\r\n'],
    ])
  })

  test('Storing elements with TTL and getting them', () => {
    client.handleData('set a 0 10 4 noreply\r\nasdf\r\n')
    client.handleData('get a\r\n')

    setTimeout(() => client.handleData('get a\r\n'), 100)

    setTimeout(() => {
      expect(socketMock.write.mock.calls).toEqual([
        [`END\r\n`],
        [`VALUE a 0 0 4\r\n`],
        ['asdf\r\n'],
        ['END\r\n'],
      ])
    }, 120)
  })

  test('Storage commands', () => {
    client.handleData('replace a 10 0 6\r\nqwerty\r\n')
    client.handleData('add a 10 0 6\r\nqwerty\r\n')
    client.handleData('set a 0 0 4 noreply\r\nasdf\r\n')
    client.handleData('add a 10 0 6\r\nqwerty\r\n')
    client.handleData('replace a 10 0 6\r\nqwerty\r\n')
    client.handleData('append a 0 0 2\r\n q\r\n')
    client.handleData('prepend a 0 0 2 noreply\r\ns \r\n')
    client.handleData('get a\r\n')

    expect(socketMock.write.mock.calls).toEqual([
      ['NOT_STORED\r\n'],
      ['STORED\r\n'],
      ['NOT_STORED\r\n'],
      ['STORED\r\n'],
      ['STORED\r\n'],
      [`VALUE a 10 0 10\r\n`],
      ['s qwerty q\r\n'],
      ['END\r\n'],
    ])
  })

  test('Storing and getting multiple items', () => {
    Array.from(Array(50), (_, i) => i)
      .forEach((_, index) => client.handleData(`add data${index} 0 0 5 noreply\r\nasdfg\r\n`))
    
    const keys = Array.from(Array(5), (_, i) => `data${i*10}`)
    client.handleData(`get ${keys.join(' ')}\r\n`)

    const expectedValues = keys
      .map(key => [[`VALUE ${key} 0 0 5\r\n`], ['asdfg\r\n']])
      .reduce((acc, current) => [...acc, ...current], [])

      expect(socketMock.write.mock.calls).toEqual([
        ...expectedValues,
        ['END\r\n'],
      ])
  })
})
