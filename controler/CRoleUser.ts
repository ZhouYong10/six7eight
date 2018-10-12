import {RoleUser} from "../entity/RoleUser";

export class CRoleUser {

    static async save(info: any) {
        let role = new RoleUser();
        role.name = info.name;
        role.type = info.type;
        role.rights = info.rights;
        role.site = info.site;
        return await role.save();
    }

    static async allRoles() {
        return await RoleUser.getAll();
    }

    static async saveOne(info:any){
        let role = new RoleUser();
        role.name = info.name;
        role.rights = info.rights;
        return await role.save()
    }

    static async update(info: any) {
        let role = new RoleUser();
        role.name = info.name;
        role.rights = info.rights;
        return await RoleUser.update(info.id, role);
    }

    static async delById(id: string) {
        let role = <RoleUser>await RoleUser.findByIdWithRelations(id);
        if (role.users && role.users.length > 0) {
            throw(new Error('该角色上有关联的账户，不能删除！'));
        }else{
            await RoleUser.delById(id);
        }
    }

}