import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class RoleUserAdmin extends RoleBase{
    // 角色名称
    @Column({
        type: 'char',
        length: 60,
        unique: true
    })
    name!: string;

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

    static async update(id: string, role:RoleUserAdmin) {
        return await RoleUserAdmin.p().update(id, role);
    }

    static async findByName(name: string){
        return await RoleUserAdmin.p().findOne({name: name});
    };

    static async findById(id: string){
        return await RoleUserAdmin.p().findOne(id);
    };

    static async delById(id: string) {
        return await RoleUserAdmin.p().delete(id);
    }

    static async findByIdWithRelations(id: string) {
        return await RoleUserAdmin.p().findOne(id, {relations: ['users']});
    }
}