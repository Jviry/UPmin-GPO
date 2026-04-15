export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.isDomainError = true;
  }
}
