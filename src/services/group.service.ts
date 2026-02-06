import { AuthLib } from "@/lib/auth.lib";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { groupRepository } from "@/repository/group.repository";
import { groupSchema } from "@/schemas/group.schema";
import { CreateGroup, UpdateGroup } from "@/types/group";

class GroupService {
    /// TODO: melhorar esse função para não registrar valores repetidos.
    async createGroup(data: CreateGroup, token: string) {
        await AuthLib.validatePermissions(token, ["Admin"])
        const request = groupSchema.parse(data);
        const groupId = await groupRepository.createGroup(request);
        return {
            success: true,
            uid: groupId,
            message: 'Grupo criado com sucesso.'
        }
    }

    async selectAllGroups(token: string) {
        await AuthLib.getUserIdFromToken(token);
        const groups = await groupRepository.getAllGroups();
        return {
            success: true,
            groups
        }
    }

    async selectByIdGroup(id: string, token: string) {
        await AuthLib.verifyToken(token);

        const grupo = await groupRepository.getGroupById(id);
        if (!grupo) throw new NotFoundError('Grupo não encontrado');

        return grupo;
    }


    async updateGroup(id: string, data: UpdateGroup, token: string) {
        await AuthLib.validatePermissions(token, ["Admin"])
        await groupRepository.updateGroup(id, data);
    }


    async deleteGroup(id: string, token: string) {
        await AuthLib.validatePermissions(token, ["Admin"])
        await groupRepository.deleteGroup(id);
    }

}

export const groupService = new GroupService();