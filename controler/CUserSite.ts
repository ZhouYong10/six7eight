import {UserSite} from "../entity/UserSite";

export class CUserSite {
    static async save(info: any) {
        let user = new UserSite();


        return await user.save();
    }
}
