import {Column, PrimaryGeneratedColumn} from "typeorm";
import {now} from "../utils";

export abstract class WithdrawBase {
    // 提现ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 提现时间
    @Column({
        type: 'char',
        length: 20,
        readonly: true
    })
    readonly createTime = now();

    // 提现支付宝
    @Column({
        type: 'varchar',
        length: 100
    })
    alipayCount!: string;

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
    userOldFunds!: number;

    // 提现后账户金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    userNewFunds!: number;

    // 提现账户名
    @Column({
        type: 'char',
        length: 100
    })
    username!: string;
}