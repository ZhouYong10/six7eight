import {Column, Entity, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserAdmin} from "./UserAdmin";
import {RightAdmin} from "./RightAdmin";

@Entity()
export class RoleUserAdmin extends RoleBase{
    // 角色权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.role)
    rights?: RightAdmin[];

    // 角色账户
    @OneToMany(type => UserAdmin, userAdmin => userAdmin.role)
    users?: UserAdmin[];
}