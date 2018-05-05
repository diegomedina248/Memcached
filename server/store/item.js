const VALUE_MESSAGE = 'VALUE'

class Item {
  constructor(key, flags, exptime, bytes, casUnique, data) {
    this.key = key
    this.flags = flags
    this.exptime = exptime
    this.bytes = bytes
    this.casUnique = casUnique
    this.data = data
  }

  getDescription(showCasUnique) {
    const casUniqueString = showCasUnique ? ` ${this.casUnique}` : ''
    return `${VALUE_MESSAGE} ${this.key} ${this.flags} ${this.bytes}${casUniqueString}`
  }
}

module.exports = Item
