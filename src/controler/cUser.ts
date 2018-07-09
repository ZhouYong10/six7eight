import {getManager} from "typeorm";
import {User} from "../entity/User";

export async function userSave(user:User) {
    const userRepository = getManager().getRepository(User);
    const newUser = userRepository.create(user);
    await userRepository.save(newUser);
    return newUser;
}