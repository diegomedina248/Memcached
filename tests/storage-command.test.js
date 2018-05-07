const StorageCommand = require('../server/command/storage/command/storage-command.js')
const { Store } = require('../server/store')
const { ClientError } = require('../server/exception')

jest.mock('../server/store/store.js')

describe('Checking storage commands validity', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command with no key should be invalid', () => {
    let command = new StorageCommand([], store)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command with non numeric flags should be invalid', () => {
    let command = new StorageCommand(['key', 'asd'], store)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command with non numeric exptime should be invalid', () => {
    let command = new StorageCommand(['key', 0, 'asf'], store)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command with non numeric data length (bytes) should be invalid', () => {
    let command = new StorageCommand(['key', 0, 0, 'mx'], store)
    expect(command.isValid()).toBeFalsy()
  })

  test('Command is valid', () => {
    command = new StorageCommand(['key', 0, 0, 4], store)
    expect(command.isValid()).toBeTruthy()
  })

  test('Command execution with multiple data should fail', () => {
    command = new StorageCommand(['key', 0, 0, 4], store)
    expect(() => command.execute(['some', 'data'], null)).toThrowError(ClientError)
  })

  test('Command execution whose data length is different than specified should fail', () => {
    command = new StorageCommand(['key', 0, 0, 4], store)
    expect(() => command.execute(['some longer data than expected'], null)).toThrowError(ClientError)
  })
})
