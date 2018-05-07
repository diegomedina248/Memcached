const AppendCommand = require('../../server/command/storage/command/append-command.js')
const { Store } = require('../../server/store')

describe('Checking replace command', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Command with no data should do nothing', () => {
    command = new AppendCommand(['key', 0, 0, 4], store, false)
    const handleWrite = jest.fn()

    command.execute([], handleWrite)

    expect(handleWrite).not.toHaveBeenCalled()
  })

  test('Command to append data to existing item should be added', () => {
    command = new AppendCommand(['key', 0, 0, 4], store, false)
    const handleWrite = jest.fn()
    store.set('key', command.toEntity('some'))

    command.flags = 8
    command.exptime = 30
    command.bytes = 5
    command.execute([' test'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
    expect(store.get('key').data).toBe('some test')
    expect(store.get('key').flags).toBe(0)
    expect(store.get('key').exptime).toBe(0)
    expect(store.get('key').bytes).toBe(9)
  })

  test('Command to prepend data to existing item should be added', () => {
    command = new AppendCommand(['key', 0, 0, 4], store, true)
    const handleWrite = jest.fn()
    store.set('key', command.toEntity('some'))

    command.flags = 8
    command.exptime = 30
    command.bytes = 5
    command.execute(['test '], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('STORED')
    expect(command.isFinished()).toBeTruthy()
    expect(store.get('key').data).toBe('test some')
    expect(store.get('key').flags).toBe(0)
    expect(store.get('key').exptime).toBe(0)
    expect(store.get('key').bytes).toBe(9)
  })
  
  test('Command to store item that doesn\'t exist should not store it', () => {
    command = new AppendCommand(['key', 0, 0, 4], store, false)
    const handleWrite = jest.fn()

    command.execute(['asdf'], handleWrite)

    expect(handleWrite).toHaveBeenCalledWith('NOT_STORED')
    expect(command.isFinished()).toBeTruthy()
  })
})
