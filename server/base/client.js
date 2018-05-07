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
    this.socket.on(EVENT_DATA, data => this.handleData(data))
  }

  /**
   * Parses the command/data sent by the client and sends back a response if needed
   * @param {string|Buffer} data the data received from the client
   */
  handleData(data) {
    try {
      const info = this.parseData(data)
      logger.info(`Received data from ${this}: ${info}`)
      this.resolver.handleRequest(info)
    } catch (exception) {
      this.handleWrite(`${exception}`)
    }
  }

  /**
   * Converts the data to string if needed
   * @param {string|Buffer} data the data to convert
   * @return {string} the received data as string
   */
  parseData(data) {
    return data instanceof Buffer ? data.toString('utf8') : data
  }

  /**
   * Writes the received text to the socket with \r\n ending
   * @param {string} text the information to send to the client
   */
  handleWrite(text) {
    logger.info(`Send data to ${this}: ${text}`)
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
