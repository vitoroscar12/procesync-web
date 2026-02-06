import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
    statusCode = 404;

    constructor(message = 'Item não encontrado') {
        super(message);
    }
}
