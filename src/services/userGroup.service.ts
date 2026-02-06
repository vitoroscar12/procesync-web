import { AuthLib } from "@/lib/auth.lib";
import { userGroupSchema } from "@/schemas/group.schema";
import { CreateUserGroup, UserGroup } from "@/types/userGroup";
import { groupService } from "./group.service";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { userGroupRepository } from "@/repository/userGroup.repository";
import { ConflitError } from "@/lib/errors/ConflitError";
import { userService } from "./user.service";
import { use } from "react";


class UserGroupService {

    async createUserGroup(data: CreateUserGroup, uid: string, token: string) {
        await AuthLib.validatePermissions(token, ['Admin']);
        const request = userGroupSchema.parse(data);

        //verificar se o grupo existe
        const group = await groupService.selectByIdGroup(uid, token);
        if (!group) throw new NotFoundError('O grupo não foi encontrado.');

        //verificar se usuario existe 
        const user = await userService.selectUserById(request.usuario_uid, token);
        if (!user) throw new NotFoundError('O usuário não foi encontrado.');

        // verifica se o usuario já está no grupo
        if (await userGroupRepository.existsByUserAndGroup(request.usuario_uid, uid))
            throw new ConflitError("Usuário ja está no grupo");

        const requestGroup: UserGroup = {
            grupo_uid: uid,
            nome: user.name,
            ...request
        };

        const userGroupId = await userGroupRepository.createUserGroup(requestGroup);
        return {
            success: true,
            uid: userGroupId,
            message: 'Usuário incluido no grupo com sucesso.'
        }
    }

    async getAllUserGroupsByGroupId(uid: string, token: string) {
        await AuthLib.validatePermissions(token, ['Admin']);

        //verificar se o grupo existe
        const group = await groupService.selectByIdGroup(uid, token);
        if (!group) throw new NotFoundError('O grupo não foi encontrado.');

        const data = await userGroupRepository.getUsersByGroupId(uid);
        return {
            success: true,
            data
        }
    }

    async deleteUserGroup(uid: string, token: string) {
        await AuthLib.validatePermissions(token, ['Admin']);
        const userGroup = await userGroupRepository.getUserGroupById(uid);
        if (!userGroup) throw new NotFoundError('O vinculo não foi encontrado.');
        await userGroupRepository.DeleteUserGroup(uid);
    }
}
export const userGroupService = new UserGroupService();