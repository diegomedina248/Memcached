import net from 'net'
import { server, logger } from '../config'
import { Client } from './client'

const EVENT_LISTENING = 'listening'
const EVENT_CLOSE = 'close'

/** Class to start and handle a TCP server to host the Memcached app */
export class Server {
  /** Constructs the object */
  constructor() {
    this.clients = []
  }

  /** Initializes the TCP server and start listening for clients */
  start() {
    this.connection = net.createServer((socket) => {
      const client = this.createClient(socket)
      client.listenForData()
      this.listenForDisconnection(client)
    })

    this.connection.listen(server.port, server.address)
    this.connection.on(EVENT_LISTENING, () => logger.info('Server started'))
  }

  /**
   * Creates a Client instance given the socket object that holds the newly created connection
   * @param { net.Socket } socket
   * @return { Client } the created Client instance
   */
  createClient(socket) {
    const client = new Client(socket)
    this.clients.push(client)
    logger.info(`${client} connected`)
    return client
  }

  /** Listens for a `close` event and removes the client from the client pool */
  listenForDisconnection(client) {
    client.socket.on(EVENT_CLOSE, () => {
      logger.info(`${client} disconnected`)
      this.clients.splice(this.clients.indexOf(client), 1)
    })
  }
}
