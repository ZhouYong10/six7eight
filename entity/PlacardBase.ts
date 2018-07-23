import {Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp} from "typeorm";

export abstract class PlacardBase {
    // 公告ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 公告标题
    @Column({
        type: 'varchar',
        length: 100
    })
    title!: string;

    // 公告内容
    @Column({
        type: 'varchar',
        length: 1000
    })
    content!: string;

    // 公告发布时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    createTime!: Timestamp;

}