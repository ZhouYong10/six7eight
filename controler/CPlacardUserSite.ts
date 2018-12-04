import {PlacardUserSite} from "../entity/PlacardUserSite";


export class CPlacardUserSite {
    static async getAll() {
        return await PlacardUserSite.getAll();
    }

    static async add(info: any) {
        let placard = new PlacardUserSite();
        placard.content = info.content;
        placard.userSee = info.userSee;
        placard.user = info.user;
        placard.sites = info.sites;

        return await placard.save();
    }

    static async update(info: any) {
        let placard = <PlacardUserSite>await PlacardUserSite.findById(info.id);
        placard.content = info.content;
        placard.userSee = info.userSee;
        placard.sites = info.sites;

        return await placard.save();
    }

    static async delById(id: string) {
        return await PlacardUserSite.delById(id);
    }

    static async getPlacardsOf(siteId: string) {
        return await PlacardUserSite.findOf(siteId);
    }
}
