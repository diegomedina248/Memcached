const GetCommand = require('../server/command/retrieval/get-command.js')
const { Store, Item } = require('../server/store')
const { ClientError } = require('../server/exception')

jest.mock('../server/store/store.js')

describe('Checking get and gets commands', () => {
  let store
  let item

  beforeEach(() => {
    item = new Item('test', 3, 0, 4, 'asdf')

    store = new Store()
    store.get = jest.fn().mockImplementation(key => item.key === key && item)
  })

  test('Command is invalid', () => {
    const command = new GetCommand([], store, false)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command is valid', () => {
    const command = new GetCommand(['some'], store, false)
    expect(command.isValid()).toBeTruthy()
  })

  test('Command execution is invalid', () => {
    const command = new GetCommand(['some'], store, false)
    expect(() => command.execute(['data'], null)).toThrowError(ClientError)
  })

  test('Command execution should result with no items', () => {
    const command = new GetCommand(['some'], store, false)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).toHaveBeenLastCalledWith('END')
  })

  test('Command get execution should result in single item', () => {
    const command = new GetCommand([item.key], store, false)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite.mock.calls).toEqual([
      ['VALUE test 3 0 4'],
      ['asdf'],
      ['END'],
    ])
  })

  test('Command gets execution should result in single item', () => {
    const command = new GetCommand([item.key], store, true)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite.mock.calls).toEqual([
      [`VALUE test 3 0 4 ${item.getCasUnique()}`],
      ['asdf'],
      ['END'],
    ])
  })

  test('Command get execution with repeated key should result in single item', () => {
    const command = new GetCommand([item.key, item.key], store, false)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite.mock.calls).toEqual([
      [`VALUE test 3 0 4`],
      ['asdf'],
      ['END'],
    ])
  })

  test('Command get execution with multiple keys should result in multiple items', () => {
    const secondItem = new Item('secondTest', 3, 0, 2, 'AX')
    store.get = jest.fn().mockImplementation(key => [item, secondItem].find(element => element.key === key))

    const command = new GetCommand([item.key, secondItem.key], store, false)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite.mock.calls).toEqual([
      [`VALUE test 3 0 4`],
      ['asdf'],
      [`VALUE secondTest 3 0 2`],
      ['AX'],
      ['END'],
    ])
  })
})
