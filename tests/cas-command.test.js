const CasCommand = require('../server/command/storage/command/cas-command.js')
const { Store } = require('../server/store')

describe('Checking set command', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command with no data should do nothing', () => {
    command = new CasCommand(['key', 0, 0, 4, 0], store)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).not.toHaveBeenCalled()
  })

  test('Command with inexistent cas item should do nothing', () => {
    command = new CasCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('NOT_FOUND')
    expect(command.isFinished()).toBeTruthy()
  })

  test('Command with different cas unique should not be stored', () => {
    command = new CasCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    store.set('key', command.toEntity('some'))
    command.casUnique = 0
    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('EXISTS')
    expect(command.isFinished()).toBeTruthy()
  })

  test('Command with same cas unique should be stored', () => {
    command = new CasCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()
    const item = command.toEntity('some')

    store.set('key', item)
    command.casUnique = item.getCasUnique()
    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
  })
})
