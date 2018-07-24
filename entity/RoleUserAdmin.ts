import {Column, Entity, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {type} from "os";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class RoleUserAdmin extends RoleBase{
    // 角色权限
    @Column({
        type: "simple-json"
    })
    jurisdiction!: any;

    // 角色账户
    @OneToMany(type => UserAdmin, userAdmin => userAdmin.role)
    users?: UserAdmin[];
}