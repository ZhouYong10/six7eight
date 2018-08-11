import {UserAdmin} from "../entity/UserAdmin";
import {MsgRes} from "../utils";


export class CUserAdmin {
    static async allAdmins() {
        try{
            return new MsgRes(true, '', await UserAdmin.getAll());
        }catch (e) {
            return new MsgRes(false, e.message);
        }
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let admin = new UserAdmin();
        admin.lastLoginTime = info.time;
        return await UserAdmin.update(info.id, admin);
    }
}


// export async function userSave(user:User) {
//     const userRepository = getManager().getRepository(User);
//     const newUser = userRepository.create(user);
//     await userRepository.save(newUser);
//     return newUser;
// }