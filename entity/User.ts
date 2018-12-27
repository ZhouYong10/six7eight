import {Entity, Column, OneToMany, ManyToOne, getRepository, Tree, TreeParent, TreeChildren} from "typeorm";
import {UserBase, UserType} from "./UserBase";
import {RoleUser} from "./RoleUser";
import {FundsRecordUser} from "./FundsRecordUser";
import {Site} from "./Site";
import {FeedbackUser} from "./FeedbackUser";
import {Recharge} from "./Recharge";
import {RechargeCode} from "./RechargeCode";
import {Withdraw} from "./Withdraw";
import {OrderUser} from "./OrderUser";
import {RemarkUser} from "./RemarkUser";
import {MessageUser} from "./MessageUser";

@Entity()
@Tree('closure-table')
export class User extends UserBase {
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

    // 账户角色
    @ManyToOne(type => RoleUser, roleUser => roleUser.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    role!: RoleUser;

    // 账户上级
    @TreeParent()
    parent?: User;

    // 账户下级
    @TreeChildren()
    children?: User[];

    // 账户备注
    @OneToMany(type => RemarkUser, remarkUser => remarkUser.user)
    remarks?: RemarkUser[];

    // 账户所属分站
    @ManyToOne(type => Site, site => site.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    site!: Site;

    // 账户订单
    @OneToMany(type => OrderUser, orderUser => orderUser.user)
    orders?: OrderUser[];

    // 账户充值记录
    @OneToMany(type => Recharge, recharge => recharge.user)
    recharges?: Recharge[];

    // 账户充值码记录
    @OneToMany(type => RechargeCode, rechargeCode => rechargeCode.user)
    rechargeCodes?: RechargeCode[];

    // 账户提现记录
    @OneToMany(type => Withdraw, withdraw => withdraw.user)
    withdraws?: Withdraw[];

    // 账户消费记录
    @OneToMany(type => FundsRecordUser, fundsRecord => fundsRecord.user)
    fundsRecords?: FundsRecordUser[];

    // 账户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.user)
    feedbacks?: FeedbackUser[];

    // 账户消息
    @OneToMany(type => MessageUser, messageUser => messageUser.user)
    messages?: MessageUser[];


    private static p() {
        return getRepository(User);
    }

    private static query(name: string) {
        return User.p().createQueryBuilder(name);
    }

    static async all(page: any) {
        return await User.query('user')
            .leftJoinAndSelect('user.parent', 'parent')
            .leftJoinAndSelect('user.role', 'role')
            .loadRelationCountAndMap('user.childNum', 'user.children')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(10000)
            .getManyAndCount();
    }

    static async siteAll(siteId: string, page: any) {
        return await User.query('user')
            .innerJoin('user.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.parent', 'parent')
            .loadRelationCountAndMap('user.childNum', 'user.children')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(10000)
            .getManyAndCount();
    }

    static async getAllLowerUser(parentId: string, page: any) {
        return await User.query('user')
            .innerJoin('user.parent', 'parent', 'parent.id = :parentId', {parentId: parentId})
            .leftJoinAndSelect('user.role', 'role')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .getManyAndCount();
    }

    async save() {
        return await User.p().save(this);
    }

    static async update(id: string, info: any) {
        return await User.p().update(id, info);
    }

    static async findByName(username: string) {
        return await User.p().findOne({username: username});
    };

    static async findByNameWithSite(username: string, siteAddress: string) {
        return await User.query('user')
            .leftJoinAndSelect('user.role', 'role')
            .innerJoinAndSelect('user.site', 'site', 'site.address = :address', {address: siteAddress})
            .where('user.username = :username', {username: username})
            .getOne();
    };

    static async findById(id: string) {
        return await User.p().findOne(id);
    };

    static async delById(id: string) {
        return await User.p().delete(id);
    }

    static async getAllStatusInfo() {
        return await User.query('user')
            .select(['user.state as state', 'COUNT(*) as num'])
            .groupBy('user.state')
            .getRawMany();
    }

    static async getAllFunds() {
        return await User.query('user')
            .select(['SUM(user.funds) as funds', 'SUM(user.freezeFunds) as freezeFunds'])
            .getRawOne();
    }
}


