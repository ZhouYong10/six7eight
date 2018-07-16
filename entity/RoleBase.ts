import {Column, CreateDateColumn, Timestamp} from "typeorm";

export abstract class RoleBase {
    // 角色名称
    @Column()
    name!: string;

    // 角色创建时间
    @Column({
        type: "timestamp",
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: Timestamp;
}