import { DecodedIdToken } from "firebase-admin/auth";
import { admin } from "./firebaseAdmin";
import { UnauthorizedError } from "./errors/UnauthorizedError";
import { UserRole } from "@/types/user";
import { ForbiddenError } from "./errors/ForbiddenError";
export class AuthLib {

    static async verifyToken(token: string): Promise<DecodedIdToken> {
        if (!token) {
            throw new UnauthorizedError('Token não fornecido');
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedError('Token inválido ou expirado');
        }
    }

    static async getUserIdFromToken(token: string): Promise<string> {
        const decodedToken = await this.verifyToken(token);
        return decodedToken.uid;
    }


    static async isTokenValid(token: string): Promise<boolean> {
        try {
            await this.verifyToken(token);
            return true;
        } catch {
            return false;
        }
    }


    static async getCustomClaims(token: string): Promise<Record<string, any>> {
        const decodedToken = await this.verifyToken(token);
        return decodedToken;
    }

    static async validatePermissions(token: string, allowedRules:UserRole[]) {
        const decodeToken = await this.verifyToken(token);
        if(!allowedRules.includes(decodeToken.role)){
            throw new ForbiddenError("Você não tem permissão.")
        }
    }
}