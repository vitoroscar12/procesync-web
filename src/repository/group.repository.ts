import { db } from "@/lib/configFirebase";
import { CreateGroup, Group, UpdateGroup } from "@/types/group";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";

class GroupRepository {
    private collectionName = 'groups'
    async createGroup(request: CreateGroup): Promise<String> {
        const { description } = request;

        const docRef = await addDoc(collection(db, this.collectionName), {
            description,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });

        return docRef.id
    }

    async getAllGroups(): Promise<Group[]> {
        const q = query(
            collection(db, this.collectionName),
            orderBy('created_at', 'desc')
        );

        const querySnapshot = await getDocs(q);

        const groups: Group[] = [];
        querySnapshot.forEach((doc) => {
            groups.push({
                uid: doc.id,
                ...doc.data()
            } as Group);
        });

        return groups;
    }

    async getGroupById(id: string): Promise<Group | null> {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            } as Group;
        }

        return null;
    }


    async updateGroup(id: string, request: UpdateGroup): Promise<void> {
        const docRef = doc(db, this.collectionName, id);

        await updateDoc(docRef, {
            ...request,
            updated_at: serverTimestamp()
        });
    }

    async deleteGroup(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }
}

export const groupRepository = new GroupRepository();