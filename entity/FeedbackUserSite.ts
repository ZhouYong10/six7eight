import {FeedbackBase} from "./FeedbackBase";
import {Entity, ManyToOne} from "typeorm";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class FeedbackUserSite extends FeedbackBase{
    // 所属分站
    @ManyToOne(type => Site, site => site.feedbacksUserSite)
    site!: Site;

    // 反馈账户
    @ManyToOne(type => UserSite, userSite => userSite.feedbacks)
    user!: UserSite;

    // 反馈处理账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.dealFeedbacks)
    dealUser?: UserAdmin;

}