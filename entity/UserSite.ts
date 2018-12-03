import {Entity, OneToMany, ManyToOne, getRepository, Column} from "typeorm";
import {UserBase, UserType} from "./UserBase";
import {RoleUserSite} from "./RoleUserSite";
import {FundsRecordSite} from "./FundsRecordSite";
import {Site} from "./Site";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {FeedbackUser} from "./FeedbackUser";
import {PlacardUser} from "./PlacardUser";
import {Recharge} from "./Recharge";
import {RechargeCode} from "./RechargeCode";
import {Withdraw} from "./Withdraw";
import {RemarkUser} from "./RemarkUser";
import {ErrorOrderUser} from "./ErrorOrderUser";

@Entity()
export class UserSite extends UserBase{
    // 账户类型
    @Column({
        type: "enum",
        enum: UserType,
        readonly: true
    })
    readonly type: UserType = UserType.Site;

    // 站点管理员角色
    @ManyToOne(type => RoleUserSite, roleUserSite => roleUserSite.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    role!: RoleUserSite;



    // 所属分站
    @ManyToOne(type => Site, site => site.usersSite, {
        eager: true,
        onDelete: 'SET NULL'
    })
    site!: Site;

    // 账户充值记录
    @OneToMany(type => Recharge, recharge => recharge.userSite)
    recharges?: Recharge[];

    // 账户充值码记录
    @OneToMany(type => RechargeCode, rechargeCode => rechargeCode.userSite)
    rechargeCodes?: RechargeCode[];

    // 账户提现记录
    @OneToMany(type => Withdraw, withdraw => withdraw.userSite)
    withdraws?: Withdraw[];

    // 资金变动记录记录
    @OneToMany(type => FundsRecordSite, consumeSite => consumeSite.userSite)
    fundsRecords?: FundsRecordSite[];

    // 账户反馈
    @OneToMany(type => FeedbackUserSite, feedbackUserSite => feedbackUserSite.user)
    feedbacks?: FeedbackUserSite[];

    // 账户处理的用户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.dealUser)
    dealFeedbacks?: FeedbackUser[];

    // 账户发布的公告
    @OneToMany(type => PlacardUser, placardUser => placardUser.user)
    placards?: PlacardUser[];

    // 账户创建的前端用户备注
    @OneToMany(type => RemarkUser, remarkUser => remarkUser.userSite)
    remarksUser?: RemarkUser[];

    // 账户处理的订单报错信息
    @OneToMany(type => ErrorOrderUser, errorOrderUser => errorOrderUser.userSite)
    errorsOrderUser?: ErrorOrderUser[];


    private static p() {
        return getRepository(UserSite);
    }

    private static query(name: string) {
        return UserSite.p().createQueryBuilder(name);
    }

    static async getAll(siteId:string) {
        return await UserSite.query('admin')
            .innerJoin('admin.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .leftJoinAndSelect('admin.role', 'role')
            .orderBy('admin.registerTime', 'DESC')
            .getMany();
    }

    async save() {
        return await UserSite.p().save(this);
    }

    static async update(id: string, user:any) {
        return await UserSite.p().update(id, user);
    }

    static async findByName(username: string){
        return await UserSite.p().findOne({username: username});
    };

    static async findByNameWithSite(username: string, siteAddress: string){
        return await UserSite.query('admin')
            .leftJoinAndSelect('admin.role', 'role')
            .innerJoinAndSelect('admin.site', 'site', 'site.address = :address', {address: siteAddress})
            .where('admin.username = :username', {username: username})
            .getOne();
    };

    static async findById(id: string){
        return await UserSite.p().findOne(id);
    };

    static async delById(id: string) {
        return await UserSite.p().delete(id);
    }
}