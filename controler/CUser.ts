import {User} from "../entity/User";
import {RoleType, RoleUser} from "../entity/RoleUser";
import {assert, decimal, now, sortRights} from "../utils";
import {getManager} from "typeorm";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {RemarkUser, RemarkWitch} from "../entity/RemarkUser";
import {UserAdmin} from "../entity/UserAdmin";
import {UserSite} from "../entity/UserSite";
import {RightUser} from "../entity/RightUser";
import {Platform} from "../entity/Platform";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {FundsRecordPlatform} from "../entity/FundsRecordPlatform";

export class CUser {

    static async upUserRole(userId: string, io: any) {
        return getManager().transaction(async tem => {
            let user = <User>await tem.createQueryBuilder()
                .select('user')
                .from(User, 'user')
                .where('user.id = :id', {id: userId})
                .leftJoinAndSelect('user.parent', 'parent')
                .leftJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('user.site', 'site')
                .getOne();
            let role = user.role;
            let site = user.site;
            let parent = user.parent;

            let roleUpPrice = site.getRoleUpPriceByRoleType(role.type);
            assert(user.funds >= roleUpPrice, '账户余额不足，请充值');

            let upRole = <RoleUser>await tem.createQueryBuilder()
                .select('role')
                .from(RoleUser, 'role')
                .innerJoin('role.site', 'site', 'site.id = :siteId', {siteId: site.id})
                .where('role.type = :type', {type: role.getUpRoleType()})
                .getOne();

            let parentProfit = parseFloat(decimal(roleUpPrice).times(site.upperRatio).toFixed(4));
            let siteProfit = parent ? parseFloat(decimal(roleUpPrice).minus(parentProfit).toFixed(4)) : roleUpPrice;

            // 升级账户角色
            user.role = upRole;
            let userNewFunds = parseFloat(decimal(user.funds).minus(roleUpPrice).toFixed(4));
            let userFundsRecord = new FundsRecordUser();
            userFundsRecord.oldFunds = user.funds;
            userFundsRecord.funds = roleUpPrice;
            userFundsRecord.newFunds = userNewFunds;
            userFundsRecord.upOrDown = FundsUpDown.Minus;
            userFundsRecord.type = FundsRecordType.UpRole;
            userFundsRecord.description = '从 ' + role.name + ' 升级到 ' + upRole.name + ', 消费: ￥' + roleUpPrice;
            userFundsRecord.user = user;
            await tem.save(userFundsRecord);
            user.funds = userNewFunds;
            await tem.save(user);

            // 给上级返利
            if (parent) {
                let parentNewFunds = parseFloat(decimal(parent.funds).plus(parentProfit).toFixed(4));
                let parentFundsRecord = new FundsRecordUser();
                parentFundsRecord.oldFunds = parent.funds;
                parentFundsRecord.funds = parentProfit;
                parentFundsRecord.newFunds = parentNewFunds;
                parentFundsRecord.upOrDown = FundsUpDown.Plus;
                parentFundsRecord.type = FundsRecordType.Profit;
                parentFundsRecord.profitUsername = user.username;
                parentFundsRecord.description = '下级: ' + user.username + ' 从 ' + role.name + ' 升级到 ' + upRole.name + ', 返利: ￥' + parentProfit;
                parentFundsRecord.user = parent;
                await tem.save(parentFundsRecord);
                parent.funds = parentNewFunds;
                await tem.save(parent);
                io.emit(parent.id + 'changeFunds', parent.funds);
            }

            // 返利给分站
            let siteNewFunds = parseFloat(decimal(site.funds).plus(siteProfit).toFixed(4));
            let siteFundsRecord = new FundsRecordSite();
            siteFundsRecord.oldFunds = site.profit;
            siteFundsRecord.funds = siteProfit;
            siteFundsRecord.newFunds = siteNewFunds;
            siteFundsRecord.upOrDown = FundsUpDown.Plus;
            siteFundsRecord.type = FundsRecordType.Profit;
            siteFundsRecord.profitUsername = user.username;
            siteFundsRecord.description = '用户: ' + user.username + ' 从 ' + role.name + ' 升级到 ' + upRole.name + ', 返利: ￥' + siteProfit;
            siteFundsRecord.site = site;
            await tem.save(siteFundsRecord);
            site.funds = siteNewFunds;
            await tem.save(site);
            io.emit(site.id + 'changeFunds', site.funds);

            // 更新账户前端数据
            let rights = await tem.createQueryBuilder()
                .select('right')
                .from(RightUser, 'right')
                .where('right.pId = :pId', {pId: '0'})
                .leftJoinAndSelect('right.children', 'menu')
                .leftJoinAndSelect('menu.children', 'menuItem')
                .getMany();
            sortRights(rights);
            let rightMenus = upRole.treeRights(rights);
            return {
                userFunds: user.funds,
                roleId: upRole.id,
                roleName: upRole.name,
                roleType: upRole.type,
                permissions: upRole.rights,
                rightMenus: rightMenus
            }
        });
    }

    static async getUserLoginInitData(user: User) {
        return await getManager().transaction(async tem => {
            await tem.update(User, user.id, {lastLoginTime: now()});
            let rights = await tem.createQueryBuilder()
                .select('right')
                .from(RightUser, 'right')
                .where('right.pId = :pId', {pId: '0'})
                .leftJoinAndSelect('right.children', 'menu')
                .leftJoinAndSelect('menu.children', 'menuItem')
                .getMany();
            sortRights(rights);
            let treeRights = user.role.treeRights(rights);
            return {
                userId: user.id,
                username: user.username,
                userState: user.getState,
                funds: user.funds,
                freezeFunds: user.freezeFunds,
                roleId: user.role.id,
                roleType: user.role.type,
                roleName: user.role.name,
                permissions: user.role.rights,
                rightMenus: treeRights,
            };
        });
    }

    static async save(info: any) {
        let user = new User();
        user.site = info.site;
        user.username = info.username;
        user.password = info.password;
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.role = info.role;
        return await user.save();
    }

    static async saveLower(info: any) {
        let user = new User();
        user.username = info.username;
        user.password = info.password;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.parent = info.parent;
        user.role = <RoleUser>await RoleUser.getRoleBySiteIdAndType(info.site.id, RoleType.Gold);
        user.site = info.site;
        return await user.save();
    }

    static async findById(id: string) {
        return await User.findById(id);
    }

    static async updateSelfContact(info: any) {
        await User.update(info.id, {
            phone: info.phone,
            weixin: info.weixin,
            qq: info.qq,
            email: info.email
        });
    }

    static async changePass(info: any) {
        let user = <User>info.user;
        user.password = info.pass;
        return await user.save();
    }

    static async all() {
        return await User.all();
    }

    static async siteAll(siteId: string) {
        return await User.siteAll(siteId);
    }

    static async lowerUserAll(userId: string) {
        return await User.getAllLowerUser(userId);
    }

    static async findByName(username: string) {
        return await User.findByName(username);
    }

    static async changeFunds(info: any, io: any) {
        let id = info.id, state = info.state, money = parseFloat(info.money), reason = info.reason;
        return await getManager().transaction(async tem => {
            let user = <User>await tem.findOne(User, id);
            let fundsRecord = new FundsRecordUser();
            fundsRecord.oldFunds = user.funds;
            fundsRecord.type = FundsRecordType.Handle;

            if (state === 'plus_consume') {
                user.funds = parseFloat(decimal(user.funds).plus(money).toFixed(4));
                fundsRecord.upOrDown = FundsUpDown.Plus;
            }else {
                assert(user.funds >= money, '用户账户余额不足，无法减少！');
                user.funds = parseFloat(decimal(user.funds).minus(money).toFixed(4));
                fundsRecord.upOrDown = FundsUpDown.Minus;
            }

            fundsRecord.funds = money;
            fundsRecord.newFunds = user.funds;
            fundsRecord.description = reason;
            fundsRecord.user = user;

            await tem.save(user);
            await tem.save(fundsRecord);

            io.emit(user.id + 'changeFunds', user.funds);
            return user.funds;
        });
    }

    static async changeState(info: any, io: any) {
        let user = <User>await User.findById(info.id);
        user.setState = info.state;
        user = await user.save();

        io.emit(user.id + 'changeState', user.getState);
        // 更新用户对应分站用户管理页面的状态
        io.emit(user.site.id + 'mgUserChangeState', {id: user.id, state: user.getState});
        // 更新平台用户管理页面的状态
        io.emit('mgUserChangeState', {id: user.id, state: user.getState});
    }

    static async updateOtherContact(info: any, io: any) {
        let user = <User>await User.findById(info.id);
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user = await user.save();

        io.emit(user.id + 'changeContact', {
            phone: user.phone,
            weixin: user.weixin,
            qq: user.qq,
            email: user.email
        });
    }

    static async addUserAdminRemark(info: any, userAdmin: UserAdmin) {
        let remark = new RemarkUser();
        remark.content = info.content;
        remark.type = RemarkWitch.Platform;
        remark.user = <User> await User.findById(info.userId);
        remark.userAdmin = userAdmin;
        await remark.save();
    }

    static async addUserSiteRemark(info: any, userSite: UserSite) {
        let remark = new RemarkUser();
        remark.content = info.content;
        remark.type = RemarkWitch.Site;
        remark.user = <User> await User.findById(info.userId);
        remark.userSite = userSite;
        await remark.save();
    }

    static async loadRemarksByUserAdmin(userId: string, userAdminId: string) {
        return await RemarkUser.findByUserIdAndUserAdminId(userId, userAdminId);
    }

    static async loadRemarksByUserSite(userId: string, userSiteId: string) {
        return await RemarkUser.findByUserIdAndUserSiteId(userId, userSiteId);
    }
}
