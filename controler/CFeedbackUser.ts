import {FeedbackUser} from "../entity/FeedbackUser";

export class CFeedbackUser {
    static async getAll() {
        return await FeedbackUser.getAll();
    }

    static async siteGetAll(siteId:string) {
        return await FeedbackUser.siteGetAll(siteId);
    }

    static async userGetAll(userId:string, siteId:string) {
        return await FeedbackUser.userGetAll(userId, siteId);
    }

    static async add(info: any, io: any) {
        let feedback = new FeedbackUser();
        feedback.content = info.content;
        feedback.user = info.user;
        feedback.site = info.site;
        feedback = await feedback.save();
        // 将问题反馈发送到后台问题反馈页面
        io.emit(feedback.site.id + 'addFeedback', feedback);
        io.emit('addFeedback', feedback);
        return feedback;
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
