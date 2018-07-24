import {Column, Entity, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserSite} from "./UserSite";

@Entity()
export class RoleUserSite extends RoleBase{
    // 角色权限
    @Column({
        type: "simple-json"
    })
    jurisdiction!: any;

    // 角色账户
    @OneToMany(type => UserSite, userSite => userSite.role)
    users?: UserSite[];
}