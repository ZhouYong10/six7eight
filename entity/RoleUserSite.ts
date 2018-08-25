import {Entity, getRepository, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserSite} from "./UserSite";

@Entity()
export class RoleUserSite extends RoleBase{

    // 角色账户
    @OneToMany(type => UserSite, userSite => userSite.role)
    users?: UserSite[];


    private static p() {
        return getRepository(RoleUserSite);
    }

    async save() {
        return await RoleUserSite.p().save(this);
    }
}