import {Column, PrimaryGeneratedColumn} from "typeorm";

export abstract class RightBase {
    // 权限ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 权限名称
    @Column({
        type: 'char',
        length: 60,
        unique: true
    })
    name!: string;

    // 权限路径
    @Column({
        type: 'char',
        length: 60,
        nullable: true
    })
    path?: string;

    // 权限对应组件名称
    @Column({
        type: 'char',
        length: 36
    })
    componentName!: string;

}