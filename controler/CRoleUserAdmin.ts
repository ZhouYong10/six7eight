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
}