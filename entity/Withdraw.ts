import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";
import {Site} from "./Site";
import {User} from "./User";
import {UserSite} from "./UserSite";

export enum WithdrawState {
    Wait = 'wait_withdraw',
    Success = 'success_withdraw',
    Fail = 'fail_withdraw'
}

export enum WithdrawType{
    User = 'user_withdraw',
    Site = 'site_withdraw'
}

@Entity()
export class Withdraw {
    // 提现ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 提现时间
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

    // 提现处理时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    dealTime?: string;

    // 提现支付宝
    @Column({
        type: 'varchar',
        length: 100
    })
    alipayCount!: string;

    // 提现支付宝昵称
    @Column({
        type: 'varchar',
        length: 100
    })
    alipayName!: string;

    // 提现金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    funds!: number;

    // 提现前账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    oldFunds!: number;

    // 提现后账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    newFunds!: number;

    // 提现状态
    @Column({
        type: 'enum',
        enum: WithdrawState
    })
    state: WithdrawState = WithdrawState.Wait;

    // 提现失败信息
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true
    })
    failMsg?: string;

    // 提现类型(区分是用户提现还是站点提现)
    @Column({
        type: 'enum',
        enum: WithdrawType
    })
    type!: WithdrawType;

    // 用户提现账户
    @ManyToOne(type => User, user => user.withdraws)
    user?: User;

    // 站点提现账户
    @ManyToOne(type => UserSite, userSite => userSite.withdraws)
    userSite?: UserSite;

    // 提现所属分站
    @ManyToOne(type => Site, site => site.withdraws)
    site!: Site;
}