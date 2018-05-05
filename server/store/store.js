class Store {
  constructor() {
    this.store = new Map()
  }

  set(key, item) {
    this.store.set(key, item)
  }

  get(key, item) {
    return this.store.get(key)
  }
}

module.exports = Store
