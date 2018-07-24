import {FeedbackBase} from "./FeedbackBase";
import {Entity, ManyToOne} from "typeorm";
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

}