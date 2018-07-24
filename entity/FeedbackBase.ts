import {Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp} from "typeorm";

export abstract class FeedbackBase {
    // 反馈ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 反馈标题
    @Column({
        type: 'varchar',
        length: 100
    })
    title!: string;

    // 反馈内容
    @Column({
        type: 'varchar',
        length: 1000
    })
    content!: string;

    // 反馈时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    createTime!: Timestamp;

    // 反馈处理时间
    @Column({
        type: 'timestamp',
        nullable: true
    })
    dealTime?: Timestamp;

    // 反馈处理内容
    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true
    })
    dealContent?: string;



}