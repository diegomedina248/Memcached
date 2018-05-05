class Command {
  constructor(structure, store) {
    this.store = store
    this.reply = true
  }

  isValid() {
    return false
  }

  execute(data, handleWrite) { }

  isFinished() {
    return false;
  }

  write(handleWrite, text) {
    this.reply && handleWrite(text)
  }
}

module.exports = Command
