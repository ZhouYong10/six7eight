import {Entity, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";
import {RoleUserAdmin} from "./RoleUserAdmin";

@Entity()
export class RightAdmin extends RightBase {
    // 父权限
    @ManyToOne(type => RightAdmin, rightAdmin => rightAdmin.children)
    parent?: RightAdmin;

    // 子权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.parent)
    children?: RightAdmin[];

    // 所属角色
    @ManyToOne(type => RoleUserAdmin, roleUserAdmin => roleUserAdmin.rights)
    role?: RoleUserAdmin;

}