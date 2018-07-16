import {Column, Entity} from "typeorm";
import {RoleBase} from "./RoleBase";

@Entity()
export class UserSiteRole extends RoleBase{
    // 角色权限
    @Column({
        type: "simple-json"
    })
    jurisdiction!: any;
}