import { auth, db } from "@/lib/configFirebase";
import { authRepository } from "@/repository/auth.repository";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { createUserInput, loginRequest } from "@/types/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
class AuthService {
    async register(userReq: createUserInput): Promise<string> {
        const data = registerSchema.parse(userReq);
        const uid = await authRepository.createUser(data);

        return uid;
    }

    ///TODO: remover login do backend ja que estamos trabalhando com Firebase.
    async login(request: loginRequest) {

        const data = loginSchema.parse(request);
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

        const user = userCredential.user;


        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            throw new Error('Perfil do usuário não encontrado');
        }

        return {
            uid: user.uid,
            email: user.email,
            token: await user.getIdToken(),
            ...userDoc.data(),
        };
    }
}

export const authService = new AuthService();