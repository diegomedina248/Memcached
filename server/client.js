const { logger } = require('../config')

const EVENT_DATA = 'data'

/** Class to handle the communication via TCP with a single client */
class Client {
  /**
   * Constructs the object given the socket instance
   * @param { net.Socket } socket The socket communication with the client
   */
  constructor(socket) {
    this.address = socket.remoteAddress
    this.port = socket.remotePort
    this.socket = socket
  }

  /** Start listening for data from the client and accordingly */
  listenForData() {
    this.socket.on(EVENT_DATA, (data) => {
      logger.info(`data: ${data}`)
    })
  }

  /**
   * @return {string} with ADDRESS:PORT format
   */
  toString() {
    return `${this.address}:${this.port}`
  }
}

module.exports = Client