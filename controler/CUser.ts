import {getRepository} from "typeorm";
import {User} from "../entity/User";

export class CUser {
    query:any;

    constructor(query:any) {
        this.query = query;
    }

    async saveUser() {
        let user = new User()
        user.username = this.query.name;
        user.setPassword(this.query.password);

        const userRepository = getRepository(User);
        await userRepository.save(user);
        return user;
    }
}


// export async function userSave(user:User) {
//     const userRepository = getManager().getRepository(User);
//     const newUser = userRepository.create(user);
//     await userRepository.save(newUser);
//     return newUser;
// }