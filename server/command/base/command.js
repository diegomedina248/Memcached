/** Base command class to be extended by storage and retrieval commands */
class Command {
  /**
   * Constructs the object
   * @param {Array} structure the space-separated parts of the command, not including it's name
   * @param {Store} store the in-memory storage
   */
  constructor(structure, store) {
    this.store = store
    this.reply = true
  }

  /**
   * Checks whether this command is valid or not
   * @return {boolean} false if the command is malformed
   */
  isValid() {
    return false
  }

  /**
   * Executes the command with the received data
   * @param {Array} data the data sent by the client
   * @param {Function} handleWrite callback function to write the responses
   */
  execute(data, handleWrite) { }

  /**
   * Checks whether this command has finished executing
   * @return {boolean} false if it's still executing (probably awaiting for client data)
   */
  isFinished() {
    return false
  }

  /**
   * Writes the text back to the client
   * @param {*} handleWrite callback function to write the responses
   * @param {*} text the text to send
   */
  write(handleWrite, text) {
    this.reply && handleWrite(text)
  }
}

module.exports = Command
