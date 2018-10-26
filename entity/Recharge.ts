import {
    Column,
    CreateDateColumn,
    Entity,
    getRepository,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {myDateFromat} from "../utils";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {User} from "./User";
import {RechargeCode} from "./RechargeCode";

export enum RechargeType {
    Site = 'site_recharge',
    User = 'user_recharge'
}

export enum RechargeWay {
    Hand = 'hand_recharge',
    Auto = 'auto_recharge'
}

export enum RechargeState{
    Wait = 'wait_recharge',
    Success = 'success_recharge',
    Fail = 'fail_recharge'
}

@Entity()
export class Recharge {
    // 充值ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 充值时间
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

    //充值到账时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    intoAccountTime?: string;

    // 充值支付宝账户
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true
    })
    alipayCount?: string;

    // 支付宝交易号
    @Column({
        type: 'varchar',
        length: 100,
        unique: true
    })
    alipayId?: string;

    // 充值金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    })
    funds?: number;

    // 充值前账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    })
    oldFunds?: number;

    // 充值后账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    })
    newFunds?: number;

    // 充值状态
    @Column({
        type: "enum",
        enum: RechargeState
    })
    state: RechargeState = RechargeState.Wait;

    // 充值类型(指用户充值或站点充值)
    @Column({
        type: "enum",
        enum: RechargeType,
        nullable: true
    })
    type?: RechargeType;

    // 充值创建方式(用户提交创建或自动抓取创建)
    @Column({
        type: "enum",
        enum: RechargeWay,
        readonly: true
    })
    way!: RechargeWay;

    // 对应的充值码
    @OneToOne(type => RechargeCode, rechargeCode => rechargeCode.recharge)
    @JoinColumn()
    rechargeCode?: RechargeCode;

    // 分站充值账户
    @ManyToOne(type => UserSite, userSite => userSite.recharges)
    userSite?: UserSite;

    // 用户充值账户
    @ManyToOne(type => User, user => user.recharges)
    user?: User;

    // 充值所属分站
    @ManyToOne(type => Site, site => site.recharges)
    site!: Site;



    private static p() {
        return getRepository(Recharge);
    }

    private static query(name: string) {
        return Recharge.p().createQueryBuilder(name);
    }

    async save() {
        return await Recharge.p().save(this);
    }

    static async all() {
        return await Recharge.query('recharge')
            .where('recharge.way = :way', {way: RechargeWay.Hand})
            .leftJoinAndSelect('recharge.site', 'site')
            .leftJoinAndSelect('recharge.user', 'user')
            .leftJoinAndSelect('recharge.userSite', 'userSite')
            .orderBy('recharge.createTime', 'DESC')
            .getMany();
    }

    static async userAllRecords(userId: string) {
        return await Recharge.query('recharge')
            .innerJoin('recharge.user', 'user', 'user.id = :userId', {userId: userId})
            .orderBy('recharge.createTime', 'DESC')
            .getMany();
    }

    static async siteAllRecords(siteId: string) {
        return await Recharge.query('recharge')
            .innerJoin('recharge.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .where('recharge.type = :type', {type: RechargeType.Site})
            .leftJoinAndSelect('recharge.userSite', 'userSite')
            .orderBy('recharge.createTime', 'DESC')
            .getMany();
    }

    static async findByAlipayId(alipayId: string) {
        return await Recharge.p().findOne({alipayId: alipayId});
    }

    static async findHandCommited(alipayId: string) {
        let recharge = await Recharge.findByAlipayId(alipayId);
        if (recharge && (recharge.isDone || recharge.way === RechargeWay.Hand)) {
            return recharge;
        }
        return null;
    }

    static async findAutoCommited(alipayId: string) {
        let recharge = await Recharge.findByAlipayId(alipayId);
        if (recharge && (!recharge.isDone && recharge.way === RechargeWay.Auto)) {
            return recharge;
        }
        return null;
    }

    static async update(id: string, recharge:Recharge) {
        return await Recharge.p().update(id, recharge);
    }

    static async delById(id: string) {
        return await Recharge.p().delete(id);
    }

    static async findById(id: string){
        return await Recharge.query('recharge')
            .where('recharge.id = :id', {id: id})
            .leftJoinAndSelect('recharge.site', 'site')
            .leftJoinAndSelect('recharge.user', 'user')
            .getOne();
    };
}