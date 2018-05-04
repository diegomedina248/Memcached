import { logger } from '../config'

const EVENT_DATA = 'data'

/** Class to handle the communication via TCP with a single client */
export class Client {
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
    logger.info(`listening to ${EVENT_DATA}`)
  }

  /**
   * @return {string} with ADDRESS:PORT format
   */
  toString() {
    return `${this.address}:${this.port}`
  }
}
