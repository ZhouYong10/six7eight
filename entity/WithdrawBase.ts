import {Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp} from "typeorm";

export abstract class WithdrawBase {
    // 提现ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 提现时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: Timestamp;

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


}