const VALUE_MESSAGE = 'VALUE'
/** Max exipre date: 60*60*24*30*1000 */
const MAX_EXPIRE_DATE_MILLIS = 2592000000

/** Model that represents the data to be stored */
class Item {
  /**
   * Constructs the object
   * @param {string} key used to uniquely identify the object
   * @param {Number} flags extra field to be used by the client
   * @param {Number} exptime the TTL for this item, in seconds
   * @param {Number} bytes the size of the data
   * @param {string} data the information to store
   */
  constructor(key, flags, exptime, bytes, data) {
    this.key = key
    this.flags = flags
    this.bytes = bytes
    this.exptime = exptime
    this.data = data

    this.created = Date.now()
    this.modified = Date.now()
  }

  /**
   * Retrieves the casUnique for this item
   * @return {Number} the casUnique integer identifier
   */
  getCasUnique() {
    return this.modified
  }

  /** Updates the casUnique of this item to the elapsed time since the epoch */
  updateCasUnique() {
    this.modified = Date.now()
  }

  /**
   * Retrieves the expiration date for this item
   * If the exptime is 0, it never expires
   * Otherwise, this items lives from creation to creation + exptime,
   * or exptime if it's value is greater than MAX_EXPIRE_DATE_MILLIS
   * @return {Date} the expiration date
   */
  getExpirationDate() {
    const exptime = this.exptime * 1000
    return exptime > MAX_EXPIRE_DATE_MILLIS
      ? new Date(exptime)
      : new Date(this.created + exptime)
  }

  /**
   * Checks whether this item is still valid
   * @param {Date} currentDate the date to check against
   * @return {boolean} false if `currentDate` is greater than expiration date
   */
  hasExpired(currentDate) {
    return this.exptime < 0 ||
      (this.exptime > 0 && currentDate.getTime() > this.getExpirationDate().getTime())
  }

  /**
   * a `toString` that allows to show the casUnique identifier if needed
   * @param {boolean} showCasUnique false to hide it from the response
   * @return {string} this item's description
   */
  getDescription(showCasUnique) {
    const casUniqueString = showCasUnique ? ` ${this.getCasUnique()}` : ''
    return `${VALUE_MESSAGE} ${this.key} ${this.flags} ${this.exptime} ${this.bytes}${casUniqueString}`
  }
}

module.exports = Item
