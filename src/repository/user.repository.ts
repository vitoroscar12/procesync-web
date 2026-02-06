import { db } from "@/lib/configFirebase"
import { User } from "@/types/user";
import { collection, doc, getDoc } from "firebase/firestore"

class UserRepository {
    private collectionName = 'users'
    async selectById(uid: string) {
        const docRef =  doc(db, this.collectionName, uid);
         const docSnap = await getDoc(docRef);
        
                if (docSnap.exists()) {
                    return {
                        uid: docSnap.id,
                        ...docSnap.data()
                    } as User;
                }
        
                return null;
    }
}
export const userRepository = new UserRepository()