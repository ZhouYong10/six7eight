import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RoleBase} from "./RoleBase";

@Entity()
export class UserRole extends RoleBase{
    // 角色ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 角色类型
    @Column()
    type!: string;

    // 角色名称
    @Column()
    name!: string;

    // 角色权限
    @Column()
    jurisdiction: any = {};


}