import {Column, PrimaryGeneratedColumn} from "typeorm";

export enum RightType{
    Page = 'page',
    MenuGroup = 'menuGroup',
    Menu = 'menu',
    PageItem = 'pageItem',
}

export function getRightType(type: string) {
    switch (type) {
        case 'page':
            return RightType.Page;
        case 'menuGroup':
            return RightType.MenuGroup;
        case 'menu':
            return RightType.Menu;
        case 'pageItem':
            return RightType.PageItem;
    }
}

let counter = 0;
export abstract class RightBase {
    // 权限ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 权限排序字段
    @Column()
    readonly num: number = counter++;

    // 权限类型
    @Column({
        type: 'enum',
        enum: RightType
    })
    type!: RightType;

    // 权限名称
    @Column({
        type: 'char',
        length: 60
    })
    name!: string;

    // 权限对应组件名称
    @Column({
        type: 'char',
        length: 36,
        nullable: true
    })
    componentName?: string;

    // 当类型为菜单组时的图标
    @Column({
        type: 'char',
        length: 36,
        nullable: true
    })
    icon?: string;
}