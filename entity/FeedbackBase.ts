import {Column, PrimaryGeneratedColumn} from "typeorm";
import {now} from "../utils";

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
        type: 'char',
        length: 20,
        readonly: true
    })
    readonly createTime = now();

    // 反馈处理时间
    @Column({
        type: 'char',
        length: 20,
        nullable: true
    })
    dealTime?: string;

    // 反馈处理内容
    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true
    })
    dealContent?: string;



}