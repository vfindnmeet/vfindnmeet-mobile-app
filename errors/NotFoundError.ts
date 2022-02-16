export default class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Not found.');

    this.name = 'NotFoundError';
  }
}
