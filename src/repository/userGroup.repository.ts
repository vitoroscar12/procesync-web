import { db } from "@/lib/configFirebase";
import { UserGroup } from "@/types/userGroup";
import { addDoc, and, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";

class UserGroupRepository {
    private collectionName = 'userGroup';

    async createUserGroup(request: UserGroup): Promise<string> {
        const { usuario_uid, grupo_uid, nome } = request;
        const docRef = await addDoc(collection(db, this.collectionName), {
            usuario_uid,
            nome,
            grupo_uid,
            created_at: serverTimestamp()
        });

        return docRef.id
    }

    async getUsersByGroupId(groupId: string): Promise<UserGroup[]> {
        const q = query(
            collection(db, this.collectionName),
            where('grupo_uid', '==', groupId)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserGroup, 'uid'>),
        }));
    }

    async getGroupsByUserId(idUser: string) {
        const q = query(
            collection(db, this.collectionName),
            where('usuario_uid', '==', idUser)
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserGroup, 'uid'>),
        }));
    }

    async existsByUserAndGroup(idUser: string, groupId: string): Promise<boolean> {
        const q = query(
            collection(db, this.collectionName),
            where('grupo_uid', '==', groupId),
            where('usuario_uid', '==', idUser)
        );
        const snapshot = await getDocs(q);

        return !snapshot.empty;
    }

    async getAllUserGroup(id: string) {
        const q = query(
            collection(db, this.collectionName),
            where('uid', '==', id)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserGroup, 'uid'>),
        }));
    }

    async getUserGroupById(id: string): Promise<UserGroup | null> {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            } as UserGroup;
        }

        return null;
    }

    async DeleteUserGroup(id: string) {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }
}

export const userGroupRepository = new UserGroupRepository();