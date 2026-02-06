import { HttpError } from './HttpError';

export class ConflitError extends HttpError {
    statusCode = 409;

    constructor(message = 'Informação já registrada.') {
        super(message);
    }
}
