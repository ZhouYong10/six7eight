import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, getRepository, ManyToMany} from "typeorm";
import {User} from "./User";
import {UserSite} from "./UserSite";
import {FeedbackUser} from "./FeedbackUser";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {PlacardUser} from "./PlacardUser";
import {ProductSite} from "./ProductSite";
import {Recharge} from "./Recharge";
import {assert, myDateFromat} from "../utils";
import {RoleType, RoleUser} from "./RoleUser";
import {RoleUserSite} from "./RoleUserSite";
import {ProductTypeSite} from "./ProductTypeSite";
import {RechargeCode} from "./RechargeCode";
import {Withdraw} from "./Withdraw";
import {OrderUser} from "./OrderUser";
import {ErrorOrderUser} from "./ErrorOrderUser";
import {FundsRecordSite} from "./FundsRecordSite";
import {PlacardUserSite} from "./PlacardUserSite";

export enum SiteFrontLayout {
    Normal = 'normal'
}

export enum SiteBackLayout {
    Normal = 'normal'
}

@Entity()
export class Site {
    // 站点ID
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // 站点域名
    @Column({
        type: "char",
        length: 50,
        unique: true
    })
    address!: string;

    // 站点名称
    @Column({
        type: "char",
        length: 50,
        unique: true
    })
    name!: string;

    // 站点SEO关键字
    @Column({
        type: "simple-array",
        nullable: true
    })
    seoKey?: string;

    // 站点描述
    @Column({
        type: "varchar",
        length: 1000,
        nullable: true
    })
    description?: string;

    // 站点QQ
    @Column({
        type: "char",
        length: 16,
        nullable: true
    })
    qq?: string;

    // 站点电话
    @Column({
        type: "char",
        length: 14,
        nullable: true
    })
    phone?:string;

    // 站点Email
    @Column({
        type: "char",
        length: 38,
        nullable: true
    })
    email?: string;

    // 站点微信
    @Column({
        type: "varchar",
        length: 18,
        nullable: true
    })
    weixin?: string;

    // 站点前端布局
    @Column({
        type: "enum",
        enum: SiteFrontLayout
    })
    frontLayout: SiteFrontLayout = SiteFrontLayout.Normal;

    // 站点后端布局
    @Column({
        type: "enum",
        enum: SiteBackLayout
    })
    backLayout: SiteBackLayout = SiteBackLayout.Normal;

    // 站点创建时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!:string;

    // 站点logo
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true
    })
    logo?: string;

    // 站点用户可用总资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    userFunds: number = 0;

    // 站点用户冻结总资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    userFreezeFunds: number = 0;

    // 站点可用资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    funds: number = 0;

    // 站点冻结资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    freezeFunds: number = 0;

    // 站点返利金额
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profit: number = 0;


    // 是否开放注册
    @Column()
    canRegister: boolean = true;

    // 金牌代理升级价格
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    goldUpPrice!: number;

    // 超级代理升级价格
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    superUpPrice!: number;

    // 用户升级上级分成比例
    @Column({
        type: "decimal",
        precision: 3,
        scale: 2
    })
    upperRatio!: number;

    getRoleUpPriceByRoleType(type: RoleType) {
        assert(type !== RoleType.Top, '你已是最高等级代理，无法再升级');
        return type === RoleType.Gold ? this.goldUpPrice : this.superUpPrice;
    }


    // 分站资金变动记录
    @OneToMany(type => FundsRecordSite, fundsRecord => fundsRecord.site)
    fundsRecords?: FundsRecordSite[];

    // 分站用户
    @OneToMany(type => User, user => user.site)
    users?: User[];

    // 分站管理员
    @OneToMany(type => UserSite, userSite => userSite.site)
    usersSite?: UserSite[];

    // 分站用户角色
    @OneToMany(type => RoleUser, roleUser => roleUser.site)
    rolesUser?: RoleUser[];

    // 分站管理员角色
    @OneToMany(type => RoleUserSite, roleUserSite => roleUserSite.site)
    rolesUserSite?: RoleUserSite[];

    // 分站用户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.site)
    feedbacksUser?: FeedbackUser[];

    // 分站管理员反馈
    @OneToMany(type => FeedbackUserSite, feedbackUserSite => feedbackUserSite.site)
    feedbacksUserSite?: FeedbackUserSite[];

    // 分站发布给用户的公告
    @OneToMany(type => PlacardUser, placardUser => placardUser.site)
    placards?: PlacardUser[];

    // 平台发布给分站的公告
    @ManyToMany(type => PlacardUserSite, placardUserSite => placardUserSite.sites)
    platformPlacards?: PlacardUserSite[];

    // 分站产品类型
    @OneToMany(type => ProductTypeSite, productTypeSite => productTypeSite.site)
    productTypesSite?: ProductTypeSite[];

    // 分站产品
    @OneToMany(type => ProductSite, productSite => productSite.site)
    products?: ProductSite[];

    // 分站用户订单
    @OneToMany(type => OrderUser, orderUser => orderUser.site)
    ordersUser?: OrderUser[];

    // 分站用户订单报错
    @OneToMany(type => ErrorOrderUser, errorOrderUser => errorOrderUser.site)
    errorsOrderUser?: ErrorOrderUser[];

    // 分站所有充值记录
    @OneToMany(type => Recharge, recharge => recharge.site)
    recharges?: Recharge[];

    // 分站所有充值码记录
    @OneToMany(type => RechargeCode, rechargeCode => rechargeCode.site)
    rechargeCodes?: RechargeCode[];

    // 分站所有提现记录
    @OneToMany(type => Withdraw, withdraw => withdraw.site)
    withdraws?: Withdraw[];



    private static p() {
        return getRepository(Site);
    }

    private static query(name: string) {
        return Site.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await Site.query('site')
            .orderBy('site.createTime', 'DESC')
            .getMany();
    }

    async save() {
        return await Site.p().save(this);
    }

    static async findByAddress(address: string){
        return await Site.p().findOne({address: address});
    };

    static async findByName(name: string){
        return await Site.p().findOne({name: name});
    };

    static async findById(id: string){
        return await Site.p().findOne(id);
    };

    static async getUserPlacardsByAddress(address: string) {
        return await Site.query('site')
            .where('site.address = :address', {address: address})
            .leftJoinAndSelect('site.placards', 'sitePlacard')
            .leftJoinAndSelect('site.platformPlacards', 'platformPlacard', 'platformPlacard.userSee = :userSee', {userSee: true})
            .getOne();
    }
}

