import {Entity, Column, OneToMany, ManyToOne, getRepository, Tree, TreeParent, TreeChildren} from "typeorm";
import {UserBase, UserType} from "./UserBase";
import {RoleUser} from "./RoleUser";
import {ConsumeUser} from "./ConsumeUser";
import {Site} from "./Site";
import {FeedbackUser} from "./FeedbackUser";
import {ProfitUser} from "./ProfitUser";
import {RechargeUser} from "./RechargeUser";
import {WithdrawUser} from "./WithdrawUser";
import {ProfitSite} from "./ProfitSite";

@Entity()
@Tree('closure-table')
export class User extends UserBase{
    // 账户类型
    @Column({
        type: "enum",
        enum: UserType,
        readonly: true
    })
    readonly type: UserType = UserType.User;

    // 账户可用资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    funds: number = 0;

    // 账户冻结资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    freezeFunds: number = 0;

    // 账户返利金额
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profit: number = 0;

    // 账户角色
    @ManyToOne(type => RoleUser, roleUser => roleUser.users)
    role!: RoleUser;

    // 账户上级
    @TreeParent()
    parent?: User;

    // 账户下级
    @TreeChildren()
    children?: User[];



    // 账户所属分站
    @ManyToOne(type => Site, site => site.users)
    site!: Site;

    // 账户充值记录
    @OneToMany(type => RechargeUser, rechargeUser => rechargeUser.user)
    recharges?: RechargeUser[];

    // 账户提现记录
    @OneToMany(type => WithdrawUser, withdrawUser => withdrawUser.user)
    withdraws?: WithdrawUser[];

    // 账户消费记录
    @OneToMany(type => ConsumeUser, consumeUser => consumeUser.user)
    consumes?: ConsumeUser[];

    // 账户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.user)
    feedbacks?: FeedbackUser[];

    // 账户给分站的返利记录
    @OneToMany(type => ProfitSite, profitSite => profitSite.profitUser)
    giveProfitsSite?: ProfitSite[];

    // 账户给上级的返利记录
    @OneToMany(type => ProfitUser, profitUser => profitUser.profitUser)
    giveProfitsUser?: ProfitUser[];

    // 账户获得的返利记录
    @OneToMany(type => ProfitUser, profitUser => profitUser.profitToUser)
    getProfits?: ProfitUser[];


    static findByName = async (username: string) => {
        return await getRepository(User).findOne({username: username});
    };

    static findById = async (id: string) => {
        return await getRepository(User).findOne(id);
    };
}


