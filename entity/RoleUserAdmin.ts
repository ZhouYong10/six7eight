import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserAdmin} from "./UserAdmin";
import {RightAdmin} from "./RightAdmin";

@Entity()
export class RoleUserAdmin extends RoleBase{
    // 角色权限
    @Column('simple-json')
    rights: any = [];

    // 角色账户
    @OneToMany(type => UserAdmin, userAdmin => userAdmin.role)
    users?: UserAdmin[];

    async save() {
        return await getRepository(RoleUserAdmin).save(this);
    }

    static findByName = async (name: string) => {
        return await getRepository(RoleUserAdmin).findOne({name: name});
    };

    static findById = async (id: string) => {
        return await getRepository(RoleUserAdmin).findOne(id);
    };
}