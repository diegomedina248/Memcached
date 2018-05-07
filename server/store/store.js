/** In-memory storage for the items requested by the client */
class Store {
  /** @inheritDoc */
  constructor() {
    this.store = new Map()
  }

  /**
   * Saves the `item` with the `key` provided. If the item existed, it will be overriden with `item`
   * @param {string} key to uniquely identify the item
   * @param {item} item data to be stored
   */
  set(key, item) {
    item.updateCasUnique()
    this.store.set(key, item)
    
    if (item.hasExpired(new Date())) {
      this.store.delete(key)
    }
  }

  /**
   * Retrieves the item from the store, if it exists
   * @param {string} key to uniquely identify the item
   * @return {Item} the item associated with `key`, or null if none exists
   */
  get(key) {
    const item = this.store.get(key)

    if (item && item.hasExpired(new Date())) {
      this.store.delete(key)
      return null
    }

    return item || null
  }
}

module.exports = Store
