const net = require('net')
const { server, logger } = require('../../config')
const Client = require('./client')
const { Store } = require('../store')

const EVENT_LISTENING = 'listening'
const EVENT_CLOSE = 'close'

/** Class to start and handle a TCP server to host the Memcached app */
class Server {
  /** Constructs the object */
  constructor() {
    this.clients = []
  }

  /** Initializes the TCP server and start listening for clients */
  start() {
    this.store = new Store()
    this.connection = net.createServer(socket => {
      const client = this.createClient(socket)
      client.listenForData()
      this.listenForDisconnection(client)
    })

    this.connection.listen(server.port, server.address)
    this.connection.on(EVENT_LISTENING, () => logger.info(`Server started at ${server.port}`))
  }

  /**
   * Creates a Client instance given the socket object that holds the newly created connection
   * @param { net.Socket } socket
   * @return { Client } the created Client instance
   */
  createClient(socket) {
    const client = new Client(socket, this.store)
    this.clients.push(client)
    logger.info(`${client} connected`)
    return client
  }

  /**
   * Listens for a `close` event and removes the client from the client pool
   * @param { Client } client the client to listen disconnection from
   */
  listenForDisconnection(client) {
    client.socket.on(EVENT_CLOSE, () => {
      logger.info(`${client} disconnected`)
      this.clients.splice(this.clients.indexOf(client), 1)
    })
  }

  /** Closes the created server connection */
  close() {
    this.clients.forEach(client => client.destroy())
    this.connection.close(() => logger.info('Server closed'))
  }
}

module.exports = Server
