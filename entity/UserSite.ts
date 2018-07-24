import {Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne} from "typeorm";
import {UserBase} from "./UserBase";
import {RoleUserSite} from "./RoleUserSite";
import {ConsumeUserSite} from "./ConsumeUserSite";
import {Site} from "./Site";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {FeedbackUser} from "./FeedbackUser";
import {PlacardUser} from "./PlacardUser";
import {RechargeUserSite} from "./RechargeUserSite";
import {WithdrawUserSite} from "./WithdrawUserSite";

@Entity()
export class UserSite extends UserBase{
    // 站点管理员角色
    @ManyToOne(type => RoleUserSite, roleUserSite => roleUserSite.users)
    role!: RoleUserSite;



    // 所属分站
    @ManyToOne(type => Site, site => site.usersSite)
    site!: Site;

    // 账户充值记录
    @OneToMany(type => RechargeUserSite, rechargeUserSite => rechargeUserSite.user)
    recharges?: RechargeUserSite[];

    // 账户提现记录
    @OneToMany(type => WithdrawUserSite, withdrawUserSite => withdrawUserSite.user)
    withdraws?: WithdrawUserSite[];

    // 消费记录
    @OneToMany(type => ConsumeUserSite, consumeUserSite => consumeUserSite.user)
    consumes!: ConsumeUserSite[];

    // 账户反馈
    @OneToMany(type => FeedbackUserSite, feedbackUserSite => feedbackUserSite.user)
    feedbacks?: FeedbackUserSite[];

    // 账户处理的用户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.dealUser)
    dealFeedbacks?: FeedbackUser[];

    // 账户发布的公告
    @OneToMany(type => PlacardUser, placardUser => placardUser.user)
    placards?: PlacardUser[];

    // constructor(id: number, name: string, password: string) {
    //     super();
    //     this.id = id
    //     this.name = name
    //     this.password = password;
    // }
}