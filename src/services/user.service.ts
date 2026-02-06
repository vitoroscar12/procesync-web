import { AuthLib } from "@/lib/auth.lib";
import { userRepository } from "@/repository/user.repository";

class UserService{
    async selectUserById(uid:string,token:string){
        AuthLib.validatePermissions(token,["Admin"])
        return await userRepository.selectById(uid);
    }
}
export const userService = new UserService();