import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, getRepository} from "typeorm";
import {User} from "./User";
import {UserSite} from "./UserSite";
import {FeedbackUser} from "./FeedbackUser";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {PlacardUser} from "./PlacardUser";
import {ProductSite} from "./ProductSite";
import {ProfitSite} from "./ProfitSite";
import {Recharge} from "./Recharge";
import {WithdrawUser} from "./WithdrawUser";
import {WithdrawUserSite} from "./WithdrawUserSite";
import {myDateFromat} from "../utils";
import {RoleUser} from "./RoleUser";
import {RoleUserSite} from "./RoleUserSite";
import {ProductTypeSite} from "./ProductTypeSite";

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
        length: 50
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

    // 当前站点返利金额
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profitNow: number = 0;



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

    // 分站用户公告
    @OneToMany(type => PlacardUser, placardUser => placardUser.site)
    placards?: PlacardUser[];

    // 分站产品类型
    @OneToMany(type => ProductTypeSite, productTypeSite => productTypeSite.site)
    productTypesSite?: ProductTypeSite[];

    // 分站产品
    @OneToMany(type => ProductSite, productSite => productSite.site)
    products?: ProductSite[];

    // 分站获得返利记录
    @OneToMany(type => ProfitSite, profitSite => profitSite.site)
    profits?: ProfitSite[];

    // 分站所有充值记录
    @OneToMany(type => Recharge, recharge => recharge.site)
    recharges?: Recharge[];

    // 分站用户提现记录
    @OneToMany(type => WithdrawUser, withdrawUser => withdrawUser.site)
    withdrawsUser?: WithdrawUser[];

    // 分站管理员提现记录
    @OneToMany(type => WithdrawUserSite, withdrawUserSite => withdrawUserSite.site)
    withdrawsUserSite?: WithdrawUserSite[];


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

    static async findById(id: string){
        return await Site.p().findOne(id);
    };
}

