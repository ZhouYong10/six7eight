import {PlacardUser} from "../entity/PlacardUser";
import {PlacardUserSite} from "../entity/PlacardUserSite";


export class CPlacardUser {
    static async getAll(page:any) {
        return await PlacardUser.getAll(page);
    }

    static async getSiteAll(siteId:string, page:any) {
        return await PlacardUser.getSiteAll(siteId, page);
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
        io.emit(info.siteId + 'editPlacardToFrontUser', placard);
        return placard;
    }

    static async delById(id: string) {
        return await PlacardUser.delById(id);
    }

    static async getUserPlacards(siteAddress: string) {
        let placardSite: Array<any> = await PlacardUser.getUserPlacards(siteAddress);
        console.log(JSON.stringify(placardSite), ' 用户获取公告--分站公告');
        let placardPlat: Array<any> = await PlacardUserSite.getUserPlacards(siteAddress);
        console.log(JSON.stringify(placardPlat), ' 用户获取公告--平台公告');
        return placardPlat.concat(placardSite);
    }
}
