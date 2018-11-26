import {ErrorOrderUser} from "../entity/ErrorOrderUser";

export class CErrorOrderUser {

    static async platformAll() {
        return await ErrorOrderUser.platformAll();
    }

}
