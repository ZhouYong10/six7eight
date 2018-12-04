import {PlacardUser} from "../entity/PlacardUser";


export class CPlacardUser {
    static async getAll() {
        return await PlacardUser.getAll();
    }

    static async getSiteAll(siteId:string) {
        return await PlacardUser.getSiteAll(siteId);
    }

    static async add(info: any, io: any) {
        let placard = new PlacardUser();
        placard.content = info.content;
        placard.user = info.user;
        placard.site = info.site;
        placard = await placard.save();
        // 将公告发布到分站用户
        io.emit(info.site.id + 'addPlacardToFrontUser', placard);
        return placard;
    }

    static async update(info: any, io: any) {
        let placard = <PlacardUser>await PlacardUser.findById(info.id);
        placard.content = info.content;
        placard = await placard.save();
        // 将公告发布到分站用户
        io.emit(info.siteId + 'addPlacardToFrontUser', placard);
        return placard;
    }

    static async delById(id: string) {
        return await PlacardUser.delById(id);
    }
}
