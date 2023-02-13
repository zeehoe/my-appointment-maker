class BasicError extends Error {
  constructor(message) {
    super(message);
    this.name = "MyError";
    this.statusCode = 400;
  }
}

module.exports = {
  BasicError
}