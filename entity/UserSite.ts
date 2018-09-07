import {Entity, OneToMany, ManyToOne, getRepository, Column} from "typeorm";
import {UserBase, UserType} from "./UserBase";
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
    // 账户名
    @Column({
        type: "char",
        length: 100
    })
    username!: string;

    // 账户类型
    @Column({
        type: "enum",
        enum: UserType,
        readonly: true
    })
    readonly type: UserType = UserType.Site;

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


    private static p() {
        return getRepository(UserSite);
    }

    async save() {
        return await UserSite.p().save(this);
    }

    static async findByName(username: string){
        return await UserSite.p().findOne({username: username});
    };

    static async findById(id: string){
        return await UserSite.p().findOne(id);
    };
}