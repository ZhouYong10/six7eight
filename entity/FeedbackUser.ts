import {FeedbackBase} from "./FeedbackBase";
import {Entity, getRepository, ManyToOne} from "typeorm";
import {Site} from "./Site";
import {User} from "./User";
import {UserSite} from "./UserSite";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class FeedbackUser extends FeedbackBase{
    // 反馈所属分站
    @ManyToOne(type => Site, site => site.feedbacksUser)
    site!: Site;

    // 反馈账户
    @ManyToOne(type => User, user => user.feedbacks)
    user!: User;

    // 反馈平台处理账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.dealUserFeedbacks)
    dealUserAdmin?: UserAdmin;

    // 反馈分站处理账户
    @ManyToOne(type => UserSite, userSite => userSite.dealUserFeedbacks)
    dealUserSite?: UserSite;


    private static p() {
        return getRepository(FeedbackUser);
    }

    async save() {
        return await FeedbackUser.p().save(this);
    }

    private static query(name: string) {
        return FeedbackUser.p().createQueryBuilder(name);
    }

    static async getWaitCount() {
        return await FeedbackUser.query('feedback')
            .where('feedback.isDeal = :isDeal', {isDeal: false})
            .getCount();
    }

    static async getSiteWaitCount(siteId: string) {
        return await FeedbackUser.query('feedback')
            .innerJoin('feedback.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .where('feedback.isDeal = :isDeal', {isDeal: false})
            .getCount();
    }

    static async getAll(page:any) {
        return await FeedbackUser.query('feedback')
            .leftJoinAndSelect('feedback.site', 'site')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.dealUserAdmin', 'dealUser')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('feedback.createTime', 'DESC')
            .getManyAndCount();
    }

    static async siteGetAll(siteId: string, page:any) {
        return await FeedbackUser.query('feedback')
            .innerJoin('feedback.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.dealUserSite', 'dealUser')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('feedback.createTime', 'DESC')
            .getManyAndCount();
    }

    static async userGetAll(userId: string, page: any) {
        return await FeedbackUser.query('feedback')
            .innerJoin('feedback.user', 'user', 'user.id = :userId', {userId: userId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('feedback.createTime', 'DESC')
            .getManyAndCount();
    }

    static async update(id: string, feedback:FeedbackUser) {
        return await FeedbackUser.p().update(id, feedback);
    }

    static async delById(id: string) {
        return await FeedbackUser.p().delete(id);
    }

    static async findByIdPlain(id: string){
        return await FeedbackUser.p().findOne(id);
    };

    static async findById(id: string){
        return await FeedbackUser.p().findOne(id, {relations: ['site', 'user']});
    };

    static async clearFeedbackUser(day: number) {
        let feedbacks = await FeedbackUser.query('feedback')
            .where('DATE_ADD(feedback.createTime, INTERVAL :day DAY) < NOW()', {day: day})
            .getMany();
        await FeedbackUser.p().remove(feedbacks);
    }
}