import {UserAdmin} from "../entity/UserAdmin";


export class CUserAdmin {
    static async allAdmins() {
        return await UserAdmin.getAll();
    }
}


// export async function userSave(user:User) {
//     const userRepository = getManager().getRepository(User);
//     const newUser = userRepository.create(user);
//     await userRepository.save(newUser);
//     return newUser;
// }