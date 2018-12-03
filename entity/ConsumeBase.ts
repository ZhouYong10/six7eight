import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export enum ConsumeUpDown {
    Plus = 'plus_consume',
    Minus = 'minus_consume'
}

export enum ConsumeType {
    Order = '订单消费',
    Profit = '下级返利',
    Recharge = '充值',
    Withdraw = '提现',
    Handle = '平台修改'
}

export abstract class ConsumeBase{
    // 消费记录ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 消费时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!: string;

    // 消费前账户金额
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    oldFunds!: number;

    // 消费金额
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    funds!: number;

    // 账户消费后金额
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    newFunds!: number;

    // 资金增减（增加余额/减少余额）
    @Column({
        type: "enum",
        enum: ConsumeUpDown
    })
    upOrDown!: ConsumeUpDown;

    // 消费类型
    @Column({
        type: "enum",
        enum: ConsumeType
    })
    type!: ConsumeType;

    // 消费描述
    @Column({
        type: 'varchar',
        length: 200
    })
    description!: string;

    // 返利账户名
    @Column({
        type: 'char',
        length: 100
    })
    profitUsername!: string;
}
