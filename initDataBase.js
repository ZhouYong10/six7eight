"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserAdmin_1 = require("./entity/UserAdmin");
const bcrypt = require("bcryptjs");
const RoleUserAdmin_1 = require("./entity/RoleUserAdmin");
const typeorm_1 = require("typeorm");
const debuger = require("debug");
const debug = debuger('six7eight:initDataBase');
(() => __awaiter(this, void 0, void 0, function* () {
    const repositoryRoleUserAdmin = typeorm_1.getRepository(RoleUserAdmin_1.RoleUserAdmin);
    const repositoryUserAdmin = typeorm_1.getRepository(UserAdmin_1.UserAdmin);
    let roleUserAdmin = yield repositoryRoleUserAdmin.findOne({ name: '系统管理员' });
    debug(roleUserAdmin);
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
        roleUserAdmin.name = '系统管理员';
        let roleUserAdminSaved = yield repositoryRoleUserAdmin.insert(roleUserAdmin);
        debug(roleUserAdminSaved + ' 插入数据库成功！！');
    }
    let userAdmin = yield repositoryUserAdmin.findOne({ username: 'admin' });
    debug(userAdmin);
    if (!userAdmin) {
        userAdmin = new UserAdmin_1.UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = bcrypt.hashSync('admin', 10);
        userAdmin.qq = '123545432';
        userAdmin.phone = '13578906543';
        userAdmin.weixin = 'fadf3123123';
        userAdmin.email = 'admin@email.com';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = repositoryUserAdmin.insert(userAdmin);
        debug(userAdminSaved + ' 插入数据库成功！！');
    }
}))();
//# sourceMappingURL=initDataBase.js.map