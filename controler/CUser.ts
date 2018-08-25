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
        user.password = this.query.password;

        const userRepository = getRepository(User);
        await userRepository.save(user);
        return user;
    }
}
