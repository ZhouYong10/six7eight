import {PlacardUserSite} from "../entity/PlacardUserSite";


export class CPlacardUserSite {
    static async getAll() {
        return await PlacardUserSite.getAll();
    }

    static async add(info: any) {
        let placard = new PlacardUserSite();
        placard.content = info.content;
        placard.user = info.user;

        return await placard.save();
    }

    static async update(info: any) {
        let placard = <PlacardUserSite>await PlacardUserSite.findById(info.id);
        placard.content = info.content;

        return await placard.save();
    }

    static async delById(id: string) {
        return await PlacardUserSite.delById(id);
    }
}