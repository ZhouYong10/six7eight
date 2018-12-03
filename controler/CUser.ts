import {User} from "../entity/User";
import {RoleType, RoleUser} from "../entity/RoleUser";
import {assert, decimal} from "../utils";
import {getManager} from "typeorm";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {RemarkUser, RemarkWitch} from "../entity/RemarkUser";
import {UserAdmin} from "../entity/UserAdmin";
import {UserSite} from "../entity/UserSite";

export class CUser {
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
