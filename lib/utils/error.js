function InnerError(message) {
  Error.call(this);
  this.message = message;
}


throw new InnerError('wind');
