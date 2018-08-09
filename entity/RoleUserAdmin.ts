import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserAdmin} from "./UserAdmin";
import {RightAdmin} from "./RightAdmin";

@Entity()
export class RoleUserAdmin extends RoleBase{

    // 角色账户
    @OneToMany(type => UserAdmin, userAdmin => userAdmin.role)
    users?: UserAdmin[];

    private static p() {
        return getRepository(RoleUserAdmin);
    }

    private static query(name: string) {
        return RoleUserAdmin.p().createQueryBuilder(name);
    }

    async save() {
        return await RoleUserAdmin.p().save(this);
    }

    static async getAll() {
        return await RoleUserAdmin.query('role')
            .orderBy('role.createTime', 'DESC')
            .getMany();
    }

    static async findByName(name: string){
        return await RoleUserAdmin.p().findOne({name: name});
    };

    static async findById(id: string){
        return await RoleUserAdmin.p().findOne(id);
    };
}