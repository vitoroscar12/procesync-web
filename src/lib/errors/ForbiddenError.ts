import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
    statusCode = 403;

    constructor(message = 'Permissão insuficiente') {
        super(message);
    }
}
