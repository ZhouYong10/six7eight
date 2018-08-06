import {Column, PrimaryGeneratedColumn} from "typeorm";

export abstract class RightBase {
    // 权限ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 权限对象名称
    @Column({
        type: 'char',
        length: 36,
        unique: true
    })
    name!: string;

    // 权限名称描述
    @Column({
        type: 'char',
        length: 60,
        unique: true
    })
    nameDec!: string;

    // 权限路径
    @Column({
        type: 'char',
        length: 60,
        nullable: true
    })
    path!: string;

    // 判断是否有子权限
    @Column()
    isParent!: boolean;

    // 判断是否有父权限
    @Column()
    isChild!: boolean;

    // 页面功能操作权限
    @Column({
        type: 'simple-json'
    })
    funcs!: any;
}