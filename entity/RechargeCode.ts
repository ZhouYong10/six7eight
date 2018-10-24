import {Column, CreateDateColumn, Entity, getRepository, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {User} from "./User";
import {myDateFromat} from "../utils";
import {Recharge, RechargeType} from "./Recharge";


@Entity()
export class RechargeCode {
    // 充值ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 充值码创建时间
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

    //充值码使用时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    usedTime?: string;

    // 充值码
    @Column({
        type: "char",
        length: 10,
        unique: true
    })
    code!: string;

    // 充值类型
    @Column({
        type: "char",
        length: 16
    })
    type!: string;

    // 充值码状态
    @Column()
    beUsed: boolean = false;



    // 对应的充值记录
    @OneToOne(type => Recharge, recharge => recharge.rechargeCode)
    recharge?: Recharge;

    // 分站充值码账户
    @ManyToOne(type => UserSite, userSite => userSite.rechargeCodes)
    userSite?: UserSite;

    // 用户充值码账户
    @ManyToOne(type => User, user => user.rechargeCodes)
    user?: User;

    // 充值码所属分站
    @ManyToOne(type => Site, site => site.rechargeCodes)
    site!: Site;


    private constructor() {}

    private static p() {
        return getRepository(RechargeCode);
    }

    private static query(name: string) {
        return RechargeCode.p().createQueryBuilder(name);
    }

    async save() {
        return await RechargeCode.p().save(this);
    }

    private static async createCode() {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'.split('');
        let uuid = [];
        let len = 6;
        let radix = chars.length;
        // Compact form
        for (let i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random()*radix];
        }
        let code = uuid.join('');

        let savedCode = await RechargeCode.findByCode(code);
        if (savedCode) {
            code = await RechargeCode.createCode();
        }
        return code;
    }

    static async getCode(info:{ type: RechargeType, site: Site, userSite?: UserSite, user?: User }) {
        /* 1. 充值码未被使用
         * 2. 通过充值码类型判断用户是普通用户还是管理员用户
         * 3. 通过用户id确认用户
         * 4. 通过分站id确认分站
         * */
        let rechargeCode;
        if (info.type === RechargeType.User) {
            rechargeCode = await RechargeCode.query('code')
                .innerJoin('code.site', 'site', 'site.id = :siteId', {siteId: info.site.id})
                .innerJoin('code.user', 'user', 'user.id = :userId', {userId: info.user.id})
                .where('code.beUsed = :beUsed', {beUsed: false})
                .getOne();
        }
        if (info.type === RechargeType.Site) {
            rechargeCode = await RechargeCode.query('code')
                .innerJoin('code.site', 'site', 'site.id = :siteId', {siteId: info.site.id})
                .innerJoin('code.userSite', 'userSite', 'userSite.id = :userId', {userId: info.userSite.id})
                .where('code.beUsed = :beUsed', {beUsed: false})
                .getOne();
        }
        if (!rechargeCode) {
            rechargeCode = new RechargeCode();
            rechargeCode.type = info.type;
            rechargeCode.site = info.site;
            rechargeCode.userSite = info.userSite;
            rechargeCode.user = info.user;
            rechargeCode.code = await RechargeCode.createCode();
            rechargeCode = await rechargeCode.save();
        }

        return rechargeCode;
    }

    static async update(id: string, rechargeCode:RechargeCode) {
        return await RechargeCode.p().update(id, rechargeCode);
    }

    static async delById(id: string) {
        return await RechargeCode.p().delete(id);
    }

    static async findByCode(code: string){
        return await RechargeCode.p().findOne({code: code});
    };

    static async findById(id: string){
        return await RechargeCode.p().findOne(id);
    };

}