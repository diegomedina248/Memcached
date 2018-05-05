const { logger } = require('../../config')
const Resolver = require('./resolver')

const EVENT_DATA = 'data'
const END_LINE = '\r\n'

/** Class to handle the communication via TCP with a single client */
class Client {
  /**
   * Constructs the object given the socket instance
   * @param { net.Socket } socket The socket communication with the client
   * @param { Store } store The in-memory data store
   */
  constructor(socket, store) {
    this.address = socket.remoteAddress
    this.port = socket.remotePort
    this.socket = socket
    this.resolver = new Resolver(this.handleWrite.bind(this), store)
  }

  /** Start listening for data from the client and act accordingly */
  listenForData() {
    this.socket.on(EVENT_DATA, (data) => this.handleData(data))
  }

  handleData(data) {
    try {
      const info = this.parseData(data)
      this.resolver.handleRequest(info)
    } catch (exception) {
      this.handleWrite(`${exception}`)
    }
  }

  parseData(data) {
    return data instanceof Buffer ? data.toString('utf8') : data
  }

  handleWrite(text) {
    this.socket.write(`${text}${END_LINE}`)
  }

  /**
   * @return {string} with ADDRESS:PORT format
   */
  toString() {
    return `${this.address}:${this.port}`
  }
}

module.exports = Client
