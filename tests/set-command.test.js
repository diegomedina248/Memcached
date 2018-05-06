const SetCommand = require('../server/command/storage/command/set-command.js')
const { Store } = require('../server/store')
const { ClientError } = require('../server/exception')

jest.mock('../server/store/store.js')

describe('Checking set command', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command is invalid', () => {
    let command = new SetCommand([], store)
    expect(command.isValid()).toBeFalsy()

    command = new SetCommand(['key'], store)
    expect(command.isValid()).toBeFalsy()

    command = new SetCommand(['key', 'asd'], store)
    expect(command.isValid()).toBeFalsy()

    command = new SetCommand(['key', 0, 'asf'], store)
    expect(command.isValid()).toBeFalsy()

    command = new SetCommand(['key', 0, 0, 'mx'], store)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command is valid', () => {
    command = new SetCommand(['key', 0, 0, 4], store)
    expect(command.isValid()).toBeTruthy()
  })

  test('Command execution with multiple data should fail', () => {
    command = new SetCommand(['key', 0, 0, 4], store)
    expect(() => command.execute(['some', 'data'], null)).toThrowError(ClientError)
  })

  test('Command execution whose data length is different than specified should fail', () => {
    command = new SetCommand(['key', 0, 0, 4], store)
    expect(() => command.execute(['some longer data than expected'], null)).toThrowError(ClientError)
  })

  test('Command with no data should do nothing', () => {
    command = new SetCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).not.toHaveBeenCalled()
  })

  test('Command with data should store it', () => {
    command = new SetCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute(['asdf'], handleWrite)

    expect(store.set).toHaveBeenCalled()
    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
  })
})
