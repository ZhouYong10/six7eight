import {FeedbackUserSite} from "../entity/FeedbackUserSite";


export class CFeedbackUserSite {

    static async getWaitCount() {
        return await FeedbackUserSite.getWaitCount();
    }

    static async getAll() {
        return await FeedbackUserSite.getAll();
    }

    static async getSiteAll(siteId:string) {
        return await FeedbackUserSite.getSiteAll(siteId);
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

    static async deal(info: any) {
        let feedback = <FeedbackUserSite>await FeedbackUserSite.findById(info.feedback.id);
        feedback.dealContent = info.dealContent;
        feedback.dealUser = info.dealUser;
        feedback.dealTime = info.dealTime;
        return await feedback.save();
    }
}
