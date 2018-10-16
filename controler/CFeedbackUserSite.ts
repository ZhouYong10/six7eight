import {FeedbackUserSite} from "../entity/FeedbackUserSite";


export class CFeedbackUserSite {
    static async getAll(siteId:string) {
        return await FeedbackUserSite.getAll(siteId);
    }

    static async add(info: any) {
        let feedback = new FeedbackUserSite();
        feedback.content = info.content;
        feedback.user = info.user;
        feedback.site = info.site;

        return await feedback.save();
    }

    static async update(info: any) {
        let feedback = <FeedbackUserSite>await FeedbackUserSite.findById(info.id);
        feedback.content = info.content;

        return await feedback.save();
    }

    static async delById(id: string) {
        return await FeedbackUserSite.delById(id);
    }
}
