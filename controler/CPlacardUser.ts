import {PlacardUser} from "../entity/PlacardUser";


export class CPlacardUser {
    static async getAll() {
        return await PlacardUser.getAll();
    }

    static async getSiteAll(siteId:string) {
        return await PlacardUser.getSiteAll(siteId);
    }

    static async add(info: any) {
        let placard = new PlacardUser();
        placard.content = info.content;
        placard.user = info.user;
        placard.site = info.site;

        return await placard.save();
    }

    static async update(info: any) {
        let placard = <PlacardUser>await PlacardUser.findById(info.id);
        placard.content = info.content;

        return await placard.save();
    }

    static async delById(id: string) {
        return await PlacardUser.delById(id);
    }
}
