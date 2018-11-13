import {ConsumeUser} from "../entity/ConsumeUser";

export class CConsumeUser {

    static async all(userId: string) {
        return await ConsumeUser.findByUserId(userId);
    }


}