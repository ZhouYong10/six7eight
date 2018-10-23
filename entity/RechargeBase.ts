import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class RechargeBase {
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
}