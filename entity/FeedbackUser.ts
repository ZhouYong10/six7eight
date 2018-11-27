import {FeedbackBase} from "./FeedbackBase";
import {Entity, getRepository, ManyToOne} from "typeorm";
import {Site} from "./Site";
import {User} from "./User";
import {UserSite} from "./UserSite";

@Entity()
export class FeedbackUser extends FeedbackBase{
    // 反馈所属分站
    @ManyToOne(type => Site, site => site.feedbacksUser)
    site!: Site;

    // 反馈账户
    @ManyToOne(type => User, user => user.feedbacks)
    user!: User;

    // 反馈处理账户
    @ManyToOne(type => UserSite, userSite => userSite.dealFeedbacks)
    dealUser?: UserSite;


    private static p() {
        return getRepository(FeedbackUser);
    }

    async save() {
        return await FeedbackUser.p().save(this);
    }

    private static query(name: string) {
        return FeedbackUser.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await FeedbackUser.query('feedback')
            .leftJoinAndSelect('feedback.site', 'site')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.dealUser', 'dealUser')
            .orderBy('feedback.createTime', 'DESC')
            .getMany();
    }

    static async siteGetAll(siteId: string) {
        return await FeedbackUser.query('feedback')
            .innerJoin('feedback.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.dealUser', 'dealUser')
            .orderBy('feedback.createTime', 'DESC')
            .getMany();
    }

    static async userGetAll(userId: string, siteId: string) {
        return await FeedbackUser.query('feedback')
            .innerJoin('feedback.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .innerJoin('feedback.user', 'user', 'user.id = :userId', {userId: userId})
            .leftJoinAndSelect('feedback.dealUser', 'dealUser')
            .orderBy('feedback.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, feedback:FeedbackUser) {
        return await FeedbackUser.p().update(id, feedback);
    }

    static async delById(id: string) {
        return await FeedbackUser.p().delete(id);
    }

    static async findById(id: string){
        return await FeedbackUser.p().findOne(id);
    };
}