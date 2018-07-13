import {getManager} from "typeorm";
import {User} from "../entity/User";

export class CUser {
    query:any;

    constructor(query:any) {
        this.query = query;
    }

    async saveUser() {
        let user = new User()
        user.name = this.query.name;
        user.password = this.query.password;
        await user.save();
        return user;
    }
}


// export async function userSave(user:User) {
//     const userRepository = getManager().getRepository(User);
//     const newUser = userRepository.create(user);
//     await userRepository.save(newUser);
//     return newUser;
// }