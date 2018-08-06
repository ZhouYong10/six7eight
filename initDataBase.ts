import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin} from "./entity/RoleUserAdmin";
import debuger = require("debug");

const debug = debuger('six7eight:initDataBase');


(async () => {
    let roleUserAdmin = await RoleUserAdmin.findByName('系统管理员');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.name = '系统管理员';
        let roleUserAdminSaved = await roleUserAdmin.save();
        debug(JSON.stringify(roleUserAdminSaved) + ' 插入数据库成功！！');
    }
    let userAdmin = await UserAdmin.findByName('admin');
    if (!userAdmin) {
        userAdmin = new UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.qq = '123545432';
        userAdmin.phone = '13578906543';
        userAdmin.weixin = 'fadf3123123';
        userAdmin.email = 'admin@email.com';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = await userAdmin.save();
        debug(JSON.stringify(userAdminSaved) + ' 插入数据库成功！！');
    }
})();


