export default class BadRequestError extends Error {
  constructor() {
    super('Bad Request Error.');

    this.name = 'BadRequestError';
  }
}
