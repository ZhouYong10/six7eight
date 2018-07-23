import {Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp} from "typeorm";

export abstract class RechargeBase {
    // 充值ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 充值时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: Timestamp;

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

    // 充值账户
}