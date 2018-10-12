import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {User} from "./User";
import {Site} from "./Site";

@Entity()
export class RoleUser extends RoleBase{
    // 角色名称
    @Column({
        type: 'char',
        length: 60
    })
    name!: string;

    // 角色类型
    @Column()
    type!: string;

    // 所属分站
    @ManyToOne(type => Site, site => site.rolesUser)
    site?: Site;

    // 角色所属账户
    @OneToMany(type => User, user => user.role)
    users?: User[];
}