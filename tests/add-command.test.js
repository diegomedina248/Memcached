const AddCommand = require('../server/command/storage/command/add-command.js')
const { Store } = require('../server/store')

describe('Checking set command', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command with no data should do nothing', () => {
    command = new AddCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).not.toHaveBeenCalled()
  })

  test('Command to store existing data should not store it', () => {
    command = new AddCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    store.set('key', command.toEntity('some'))
    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('NOT_STORED')
    expect(command.isFinished()).toBeTruthy()
  })
  
  test('Command to store item that doesn\'t exist should store it', () => {
    command = new AddCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
  })
})
