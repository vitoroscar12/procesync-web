import { HttpError } from './HttpError'

export class UnauthorizedError extends HttpError {
    statusCode = 401;

    constructor(message = 'Não autorizado') {
        super(message);
    }
}