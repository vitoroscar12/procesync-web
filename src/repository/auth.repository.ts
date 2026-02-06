import { createUserInput } from "@/types/user";
import { db } from "@/lib/configFirebase.js"
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { admin } from "@/lib/firebaseAdmin";
class AuthRepository {

    private collectionName = 'users'
    async createUser(userReq: createUserInput): Promise<string> {
        const { name, email, password, role } = userReq;

        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
        const uid = userRecord.uid

        await setDoc(doc(db, this.collectionName, uid), {
            name,
            email,
            role,
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await admin.auth().setCustomUserClaims(uid,{
            role,
        })

        return uid;
    }

}

export const authRepository = new AuthRepository();

