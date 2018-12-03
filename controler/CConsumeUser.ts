import {FundsRecordUser} from "../entity/FundsRecordUser";

export class CConsumeUser {

    static async all(userId: string) {
        return await FundsRecordUser.findByUserId(userId);
    }


}