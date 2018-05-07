const SetCommand = require('../../server/command/storage/command/set-command.js')
const { Store } = require('../../server/store')

jest.mock('../../server/store/store.js')

describe('Checking set command', () => {
  let store

  beforeEach(() => {
    store = new Store()
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
