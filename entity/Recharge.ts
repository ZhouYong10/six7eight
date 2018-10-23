import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {User} from "./User";

export enum rechargeType {
    Site = 'site_recharge',
    User = 'user_recharge'
}

@Entity()
export abstract class Recharge {
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
        length: 100
    })
    alipayCount!: string;

    // 支付宝交易号
    @Column({
        type: 'varchar',
        length: 100
    })
    alipayId!: string;

    // 充值金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    funds!: number;

    // 充值前账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    userOldFunds!: number;

    // 充值后账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    userNewFunds!: number;

    // 充值状态
    @Column()
    isDone: boolean = false;

    // 充值类型
    @Column()
    type!: string;

    // 分站充值账户
    @ManyToOne(type => UserSite, userSite => userSite.recharges)
    userSite!: UserSite;

    // 用户充值账户
    @ManyToOne(type => User, user => user.recharges)
    user!: User;

    // 充值所属分站
    @ManyToOne(type => Site, site => site.recharges)
    site!: Site;
}