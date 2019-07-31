import {PlacardUserSite} from "../entity/PlacardUserSite";


export class CPlacardUserSite {

    static async clear(day: number) {
        console.log("开始清除"+ day +"天前的平台公告记录");
        await PlacardUserSite.clearPlacardUserSite(day);
        console.log("清除平台公告记录完成");
    }

    static async getAll(page:any) {
        return await PlacardUserSite.getAll(page);
    }

    static async add(info: any, io: any) {
        let placard = new PlacardUserSite();
        placard.content = info.content;
        placard.siteSee = info.siteSee;
        placard.userSee = info.userSee;
        placard.user = info.user;
        placard.sites = info.sites;
        placard = await placard.save();
        // 发布公告到前端页面
        for(let i = 0; i < info.sites.length; i++){
            let site = info.sites[i];
            if (placard.userSee) {
                io.emit(site.id + 'addPlacardToFrontUser', placard);
            }
            if (placard.siteSee) {
                io.emit(site.id + 'addPlacardToSiteAdmin', placard);
            }
        }

        return placard;
    }

    static async update(info: any, io: any) {
        let placard = <PlacardUserSite>await PlacardUserSite.findById(info.id);
        placard.content = info.content;
        placard.siteSee = info.siteSee;
        placard.userSee = info.userSee;
        placard.sites = info.sites;
        placard = await placard.save();
        // 发布公告到前端页面
        for(let i = 0; i < info.sites.length; i++){
            let site = info.sites[i];
            if (placard.userSee) {
                io.emit(site.id + 'editPlacardToFrontUser', placard);
            }
            if (placard.siteSee) {
                io.emit(site.id + 'editPlacardToSiteAdmin', placard);
            }
        }
        return placard;
    }

    static async delById(id: string) {
        return await PlacardUserSite.delById(id);
    }

    static async getPlacardsOf(siteId: string) {
        return await PlacardUserSite.findOf(siteId);
    }
}
