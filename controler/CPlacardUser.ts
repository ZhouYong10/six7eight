import {PlacardUser} from "../entity/PlacardUser";


export class CPlacardUser {
    static async getAll() {
        return await PlacardUser.getAll();
    }

    private static async editInfo(placard: PlacardUser, info: any) {
        placard.content = info.content;
        placard.user = info.user;
        placard.site = info.site;

        return await placard.save();
    }

    static async add(info: any) {
        return await CPlacardUser.editInfo(new PlacardUser(), info);
    }

    static async update(info: any) {
        return await CPlacardUser.editInfo(<PlacardUser>await PlacardUser.findById(info.id), info);
    }

    static async delById(id: string) {
        return await PlacardUser.delById(id);
    }
}
