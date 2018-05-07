const ReplaceCommand = require('../../server/command/storage/command/replace-command.js')
const { Store } = require('../../server/store')

describe('Checking replace command', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command with no data should do nothing', () => {
    command = new ReplaceCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).not.toHaveBeenCalled()
  })

  test('Command to store existing data should replace it', () => {
    command = new ReplaceCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    store.set('key', command.toEntity('some'))
    command.bytes = 6
    command.execute(['asdfjk'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
    expect(store.get('key').data).toBe('asdfjk')
  })
  
  test('Command to store item that doesn\'t exist should not store it', () => {
    command = new ReplaceCommand(['key', 0, 0, 4], store)
    const handleWrite = jest.fn()

    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('NOT_STORED')
    expect(command.isFinished()).toBeTruthy()
  })
})
