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

    // 推广码
    @Column({
        type: "char",
        length: 10,
        unique: true
    })
    code!: string;

    static async createCode() {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'.split('');
        let uuid = [];
        let len = 6;
        let radix = chars.length;
        // Compact form
        for (let i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random()*radix];
        }
        let code = uuid.join('');

        let savedCode = await User.findByCode(code);
        if (savedCode) {
            code = await User.createCode();
        }
        return code;
    }

    // 账户角色
    @ManyToOne(type => RoleUser, roleUser => roleUser.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    role!: RoleUser;

    @Column({nullable: true})
    roleId?: string;

    // 账户上级
    @TreeParent()
    parent?: User;

    @Column({nullable: true})
    parentId?: string;

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
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('site.name', 'siteName')
                    .from(Site, 'site')
                    .where('site.id = user.siteId')
            }, 'siteName')
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.type', 'roleType')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleType')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(10000)
            .getRawMany();
        let total = await User.query('user').getCount();
        return [datas, total];
    }

    static async searchByUsername(username: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('site.name', 'siteName')
                    .from(Site, 'site')
                    .where('site.id = user.siteId')
            }, 'siteName')
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.type', 'roleType')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleType')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.username LIKE :username', {username: `%${username}%`})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.username LIKE :username', {username: `%${username}%`})
            .getCount();
        return [datas, total];
    }

    static async searchByUsernameSite(siteId: string, username: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.name', 'roleName')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleName')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.siteId = :siteId', {siteId: siteId})
            .andWhere('user.username LIKE :username', {username: `%${username}%`})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.siteId = :siteId', {siteId: siteId})
            .andWhere('user.username LIKE :username', {username: `%${username}%`})
            .getCount();
        return [datas, total];
    }

    static async lowerUserOf(parentId: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('site.name', 'siteName')
                    .from(Site, 'site')
                    .where('site.id = user.siteId')
            }, 'siteName')
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.type', 'roleType')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleType')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.parentId = :parentId', {parentId: parentId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.parentId = :parentId', {parentId: parentId})
            .getCount();
        return [datas, total];
    }

    static async lowerUserOfSite(parentId: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.name', 'roleName')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleName')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.parentId = :parentId', {parentId: parentId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.parentId = :parentId', {parentId: parentId})
            .getCount();
        return [datas, total];
    }

    static async getParentUserPlat(username: string) {
        return await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('site.name', 'siteName')
                    .from(Site, 'site')
                    .where('site.id = user.siteId')
            }, 'siteName')
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.type', 'roleType')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleType')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.username = :username', {username: username})
            .cache(3000)
            .getRawOne();
    }

    static async getParentUserSite(username: string) {
        return await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.name', 'roleName')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleName')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.username = :username', {username: username})
            .cache(3000)
            .getRawOne();
    }

    static async siteAll(siteId: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('parent.username', 'parentName')
                    .from(User, 'parent')
                    .where('parent.id = user.parentId')
            }, 'parentName')
            .addSelect((subQuery) => {
                return subQuery.select('role.name', 'roleName')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleName')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.siteId = :siteId', {siteId: siteId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.siteId = :siteId', {siteId: siteId})
            .getCount();
        return [datas, total];
    }

    static async getAllLowerUser(parentId: string, page: any) {
        let datas = await User.query('user')
            .select(['id', 'registerTime', 'lastLoginTime', 'username', 'funds',
                'freezeFunds', 'state', 'qq', 'phone', 'weixin', 'email'])
            .addSelect((subQuery) => {
                return subQuery.select('role.name', 'roleName')
                    .from(RoleUser, 'role')
                    .where('role.id = user.roleId')
            }, 'roleName')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)', 'childNum')
                    .from(User, 'child')
                    .where('child.parentId = user.id')
            }, 'childNum')
            .where('user.parentId = :parentId', {parentId: parentId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('user.registerTime', 'DESC')
            .cache(3000)
            .getRawMany();
        let total = await User.query('user')
            .where('user.parentId = :parentId', {parentId: parentId})
            .getCount();
        return [datas, total];
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

    static async findByCode(code: string) {
        return await User.p().findOne({code: code});
    }

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

    static async getAllStatusInfoOfSite(siteId: string) {
        return await User.query('user')
            .select(['user.state as state', 'COUNT(*) as num'])
            .innerJoin('user.site', 'site', 'site.id = :id', {id: siteId})
            .groupBy('user.state')
            .getRawMany();
    }

    static async getAllFunds() {
        return await User.query('user')
            .select(['SUM(user.funds) as funds', 'SUM(user.freezeFunds) as freezeFunds'])
            .getRawOne();
    }

    static async getAllFundsOfSite(siteId:string) {
        return await User.query('user')
            .select(['SUM(user.funds) as funds', 'SUM(user.freezeFunds) as freezeFunds'])
            .innerJoin('user.site', 'site', 'site.id = :id', {id: siteId})
            .getRawOne();
    }

    static async platNewUserOfDay(date: string) {
        return await User.query('user')
            .where(`to_days(user.registerTime) = to_days(:date)`, {date: date})
            .getCount();
    }

    static async siteNewUserOfDay(siteId: string, date: string) {
        return await User.query('user')
            .innerJoin('user.site', 'site', 'site.id = :id', {id: siteId})
            .where(`to_days(user.registerTime) = to_days(:date)`, {date: date})
            .getCount();
    }

}


