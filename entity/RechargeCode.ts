import {Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {User} from "./User";
import {myDateFromat} from "../utils";
import {Recharge} from "./Recharge";

export enum rechargeType {
    Site = 'site_recharge',
    User = 'user_recharge'
}

@Entity()
export abstract class RechargeCode {
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
        length: 16,
        unique: true
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
    userSite!: UserSite;

    // 用户充值码账户
    @ManyToOne(type => User, user => user.rechargeCodes)
    user!: User;

    // 充值码所属分站
    @ManyToOne(type => Site, site => site.rechargeCodes)
    site!: Site;

}