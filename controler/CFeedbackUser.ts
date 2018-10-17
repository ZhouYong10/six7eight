import {FeedbackUser} from "../entity/FeedbackUser";

export class CFeedbackUser {
    static async siteGetAll(siteId:string) {
        return await FeedbackUser.siteGetAll(siteId);
    }

    static async add(info: any) {
        let feedback = new FeedbackUser();
        feedback.content = info.content;
        feedback.user = info.user;
        feedback.site = info.site;
        return await feedback.save();
    }

    static async update(info: any) {
        let feedback = <FeedbackUser>await FeedbackUser.findById(info.id);
        feedback.content = info.content;
        return await feedback.save();
    }

    static async delById(id: string) {
        return await FeedbackUser.delById(id);
    }

    static async deal(info: any) {
        let feedback = <FeedbackUser>await FeedbackUser.findById(info.feedback.id);
        feedback.dealContent = info.dealContent;
        feedback.dealUser = info.dealUser;
        feedback.dealTime = info.dealTime;
        return await feedback.save();
    }
}
