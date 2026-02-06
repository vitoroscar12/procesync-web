import { BadRequestError } from "@/lib/errors/BadRequestError";

export function extractToken(req: Request): string {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestError('Token não fornecido');
    }

    return authHeader.substring(7);
}