import {UserAdmin} from "../entity/UserAdmin";
import {MsgRes} from "../utils";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";


export class CUserAdmin {
    static async allAdmins() {
        return await UserAdmin.getAll();
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let admin = new UserAdmin();
        admin.lastLoginTime = info.time;
        return await UserAdmin.update(info.id, admin);
    }

    static async findByUsername(username: string) {
        return await UserAdmin.findByName(username);
    }

    static async save(info: any) {
        let user = new UserAdmin();
        user.username = info.username;
        user.password = info.password;
        user.role = <RoleUserAdmin>await RoleUserAdmin.findById(info.role);
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }
}


// export async function userSave(user:User) {
//     const userRepository = getManager().getRepository(User);
//     const newUser = userRepository.create(user);
//     await userRepository.save(newUser);
//     return newUser;
// }