import {User} from "../entity/User";
import {RoleUser} from "../entity/RoleUser";
import {decimal} from "../utils";
import {getManager} from "typeorm";
import {ConsumeUser} from "../entity/ConsumeUser";
import {ConsumeType} from "../entity/ConsumeBase";

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
        user.role = info.role;
        user.site = info.site;
        return await user.save();
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let {id, time} = info;
        return await User.update(id, {lastLoginTime: time});
    }

    static async findById(id: string) {
        return await User.findById(id);
    }

    static async updateInfo(info: any) {
        let user = <User>await User.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
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

    static async lowerUserAll(userId: string, siteId: string) {
        return await User.getAllLowerUser(userId, siteId);
    }

    static async findByNameAndSiteId(username: string, siteId: string) {
        return await User.usernameisExist(username, siteId);
    }

    static async changeFunds(info: any, io: any) {
        let id = info.id, state = info.state, money = parseFloat(info.money), reason = info.reason, userNowFunds = 0;
        await getManager().transaction(async tem => {
            let user = <User>await tem.findOne(User, id);
            let consumeUser = new ConsumeUser();

            let oldFunds = user.funds;
            if (state === 'plus_consume') {
                user.funds = parseFloat(decimal(oldFunds).plus(money).toFixed(4));
                consumeUser.type = '增加用户金额';
                consumeUser.state = ConsumeType.Plus;
            }else {
                user.funds = parseFloat(decimal(oldFunds).minus(money).toFixed(4));
                consumeUser.type = '减少用户金额';
            }
            userNowFunds = user.funds;

            consumeUser.userOldFunds = oldFunds;
            consumeUser.funds = money;
            consumeUser.userNewFunds = user.funds;
            consumeUser.description = reason;
            consumeUser.user = user;

            await tem.save(user);
            await tem.save(consumeUser);

            io.emit(user.id + 'changeFunds', user.funds);
        });
        return userNowFunds;
    }

    static async changeState(info: any, io: any) {
        let user = <User>await User.findById(info.id);
        user.setState = info.state;
        user = await user.save();

        io.emit(user.id + 'changeState', user.getState);
    }

    static async update(info: any) {
        let user = <User>await User.findById(info.id);
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        await user.save();
    }

    static async updateLower(info: any) {
        let user = <User>await User.findById(info.id);
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async delById(id: string) {
        return await User.delById(id);
    }
}
