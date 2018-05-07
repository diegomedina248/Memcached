const { Store, Item } = require('../../server/store')

describe('Check the correct operation of the store', () => {
  let store

  beforeEach(() => {
    store = new Store()
  })

  test('Each time an item is set it\'s casUnique property should be updated', () => {
    const item = new Item('test', 3, 0, 4, 'asdf')

    store.set(item.key, item)
    const initialCasUnique = item.getCasUnique()

    setTimeout(() => {
      store.set(item.key, item)
      expect(initialCasUnique).toBeLessThan(item.getCasUnique())
    }, 10)
  })

  test('Getting a non-existent item should return null', () => {
    expect(store.get('some')).toBeNull()
  })

  test('Existent item with 0 exptime should always be retrieved', () => {
    const item = new Item('test', 3, 0, 4, 'asdf')

    store.set(item.key, item)
    expect(store.get(item.key)).toBe(item)

    setTimeout(() => expect(store.get(item.key)).toBe(item), 10)
  })

  test('Existent items that didn\'t expire should be retrieved', () => {
    const item = new Item('test', 3, 1000, 4, 'asdf')

    store.set(item.key, item)

    expect(store.get(item.key)).toBe(item)
    setTimeout(() => expect(store.get(item.key)).toBe(item), 10)
  })

  test('Existent item that has expired should not be retrieved', () => {
    const item = new Item('test', 3, 5, 4, 'asdf')

    store.set(item.key, item)

    expect(store.get(item.key)).toBe(item)
    setTimeout(() => expect(store.get(item.key)).toBeNull(), 50)
  })

  test('Storing item with negative expiration time should inmediately remove it', () => {
    const item = new Item('test', 3, -1, 4, 'asdf')

    store.set(item.key, item)

    expect(store.get(item.key)).toBeNull()
  })
})
