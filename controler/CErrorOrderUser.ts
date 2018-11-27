import {ErrorOrderUser} from "../entity/ErrorOrderUser";

export class CErrorOrderUser {

    static async platformAll() {
        return await ErrorOrderUser.platformAll();
    }

    static async siteAll(siteId: string) {
        return await ErrorOrderUser.siteAll(siteId);
    }

}
