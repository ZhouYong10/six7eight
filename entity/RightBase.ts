import {Column, PrimaryGeneratedColumn} from "typeorm";

export enum RightType{
    MenuGroup = 'menuGroup',
    Menu = 'menu',
    MenuItem = 'menuItem'
}

export function getRightType(type: string) {
    switch (type) {
        case 'menuGroup':
            return RightType.MenuGroup;
        case 'menu':
            return RightType.Menu;
        case 'menuItem':
            return RightType.MenuItem;
    }
}

let counter = 0;
export abstract class RightBase {
    // 权限ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 权限排序字段
    @Column()
    num: number = counter++;

    // 权限类型
    @Column({
        type: 'enum',
        enum: RightType,
    })
    private type!: RightType;

    set setType(type: string) {
        this.type = <RightType>getRightType(type);
    }

    get getType() {
        return this.type;
    }

    // 上级id
    @Column()
    pId!: string;

    // 权限名称
    @Column({
        type: 'char',
        length: 60
    })
    name!: string;

    // 路由
    @Column({
        nullable: true
    })
    path?: string;

    // 权限指纹
    @Column({
        type: 'char',
        length: 36,
        unique: true
    })
    fingerprint!: string;

    // 当类型为菜单组时的图标
    @Column({
        type: 'char',
        length: 36,
        nullable: true
    })
    icon?: string;
}