import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin} from "./entity/RoleUserAdmin";
import {getRepository} from "typeorm";
import debuger = require("debug");

const debug = debuger('six7eight:initDataBase');


(async () => {
    const repositoryRoleUserAdmin = getRepository(RoleUserAdmin);
    const repositoryUserAdmin = getRepository(UserAdmin);
    let roleUserAdmin = await repositoryRoleUserAdmin.findOne({name: '系统管理员'});
    debug(roleUserAdmin);
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.name = '系统管理员';
        let roleUserAdminSaved = await repositoryRoleUserAdmin.insert(roleUserAdmin);
        debug(roleUserAdminSaved + ' 插入数据库成功！！');
    }
    let userAdmin = await repositoryUserAdmin.findOne({username: 'admin'});
    debug(userAdmin);
    if (!userAdmin) {
        userAdmin = new UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.setPassword('admin');
        userAdmin.qq = '123545432';
        userAdmin.phone = '13578906543';
        userAdmin.weixin = 'fadf3123123';
        userAdmin.email = 'admin@email.com';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = repositoryUserAdmin.insert(userAdmin);
        debug(userAdminSaved + ' 插入数据库成功！！');
    }
})();


