const VALUE_MESSAGE = 'VALUE'

/** Model that represents the data to be stored */
class Item {
  /**
   * Constructs the object
   * @param {string} key used to uniquely identify the object
   * @param {Number} flags extra field to be used by the client
   * @param {Number} exptime the TTL for this item
   * @param {Number} bytes the size of the data
   * @param {Number} casUnique used to safely issue updates
   * @param {string} data the information to store
   */
  constructor(key, flags, exptime, bytes, casUnique, data) {
    this.key = key
    this.flags = flags
    this.exptime = exptime
    this.bytes = bytes
    this.casUnique = casUnique
    this.data = data
  }

  /**
   * a `toString` that allows to show the casUnique identifier if needed
   * @param {boolean} showCasUnique false to hide it from the response
   * @return {string} this item's description
   */
  getDescription(showCasUnique) {
    const casUniqueString = showCasUnique ? ` ${this.casUnique}` : ''
    return `${VALUE_MESSAGE} ${this.key} ${this.flags} ${this.exptime} ${this.bytes}${casUniqueString}`
  }
}

module.exports = Item
