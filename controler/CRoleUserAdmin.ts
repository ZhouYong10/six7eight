import {RoleUserAdmin} from "../entity/RoleUserAdmin";

export class CRoleUserAdmin {

    static async allRoles() {
        return await RoleUserAdmin.getAll();
    }

    static async saveOne(info:any){
        let role = new RoleUserAdmin();
        role.name = info.name;
        role.rights = info.rights;
        return await role.save();
    }

    static async update(info: any) {
        let role = new RoleUserAdmin();
        role.name = info.name;
        role.rights = info.rights;
        return await RoleUserAdmin.update(info.id, role);
    }

    static async delById(id: string) {
        let role = <RoleUserAdmin>await RoleUserAdmin.findByIdWithRelations(id);
        if (role.users && role.users.length > 0) {
            return false;
        }else{
            await RoleUserAdmin.delById(id);
            return true;
        }
    }
}