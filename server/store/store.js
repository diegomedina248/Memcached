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
    this.store.set(key, item)
  }

  /**
   * Retrieves the item from the store, if it exists
   * @param {string} key to uniquely identify the item
   * @return {Item} the item associated with `key`, or null if none exists
   */
  get(key) {
    return this.store.get(key)
  }
}

module.exports = Store
