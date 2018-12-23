import {Recharge, RechargeState, RechargeType} from "../entity/Recharge";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {decimal, now} from "../utils";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {UserSite} from "../entity/UserSite";
import {MessageTitle} from "../entity/MessageBase";
import {MessageUser} from "../entity/MessageUser";
import {MessageUserSite} from "../entity/MessageUserSite";


export class CRecharge {

    static async getWaitCount() {
        return await Recharge.getWaitCount();
    }

    static async findByAlipayId(info:any) {
        return await Recharge.findHandCommited(info.alipayId);
    }

    // 用户手动充值
    static async addOrRecharge(info: any, io: any) {
        let {alipayId, type, way, user, userSite, site} = info;
        let recharge = <Recharge>await Recharge.findAutoCommited(alipayId);
        // 如果自动抓取的未充值记录已经存在，则充值
        if (recharge) {
            // 给用户充值
            if (type === RechargeType.User) {
                await getManager().transaction(async tem => {
                    let userNewFunds: number = parseFloat(decimal(recharge!.funds).plus(user.funds).toFixed(4));

                    recharge.intoAccountTime = now();
                    recharge.oldFunds = user.funds;
                    recharge.newFunds = userNewFunds;
                    recharge.state = RechargeState.Success;
                    recharge.type = type;
                    recharge.user = user;
                    recharge.site = site;
                    recharge = await tem.save(recharge);

                    await tem.update(User, user.id, {funds: userNewFunds});
                });
            } else if (type === RechargeType.Site) {
                // 给站点充值
                await getManager().transaction(async tem => {
                    let siteNewFunds: number = parseFloat(decimal(recharge!.funds).plus(site.funds).toFixed(4));

                    recharge.intoAccountTime = now();
                    recharge.oldFunds = site.funds;
                    recharge.newFunds = siteNewFunds;
                    recharge.state = RechargeState.Success;
                    recharge.type = type;
                    recharge.userSite = userSite;
                    recharge.site = site;
                    recharge = await tem.save(recharge);

                    await tem.update(Site, site.id, {funds: siteNewFunds});
                });
            }
        } else {
            // 如果自动抓取的未充值记录不存在，则保存一条手动未充值记录
            recharge = new Recharge();
            recharge.alipayId = alipayId;
            recharge.type = type;
            recharge.way = way;
            recharge.user = user;
            recharge.userSite = userSite;
            recharge.site = site;
            recharge = await recharge.save();
            io.emit('plusBadge', 'rechargesPlatform');
        }
        // 将充值记录发送到平台充值记录
        io.emit('platformRechargeAdd', recharge);
        return recharge;
    }

    // 平台手动处理充值
    static async handRecharge(info: any, io: any) {
        let {id, funds} = info;
        let recharge = <Recharge>await Recharge.findById(id);
        let type = recharge.type;

        // 给用户充值
        if (type === RechargeType.User) {
            await getManager().transaction(async tem => {
                let user = <User>recharge.user;
                let userNewFunds:number = parseFloat(decimal(funds).plus(user.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = user.funds;
                recharge.newFunds = userNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);

                await tem.update(User, user.id, {funds: userNewFunds});

                let fundsRecord = new FundsRecordUser();
                fundsRecord.oldFunds = user.funds;
                fundsRecord.funds = funds;
                fundsRecord.newFunds = userNewFunds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Recharge;
                fundsRecord.description = '账户充值： ￥ ' + funds;
                fundsRecord.user = user;
                await tem.save(fundsRecord);

                io.emit(user.id + 'changeFunds', userNewFunds);
                io.emit('platformRechargeDeal', recharge);
                io.emit('minusBadge', 'rechargesPlatform');

                let message = new MessageUser();
                message.user = user;
                message.title = MessageTitle.Recharge;
                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                message.frontUrl = '/recharge/records';
                message.aimId = recharge.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(user.id + 'plusMessageNum');
            });
        }else if (type === RechargeType.Site) {
            // 给站点充值
            return await getManager().transaction(async tem => {
                let site = <Site>recharge.site;
                let siteNewFunds: number = parseFloat(decimal(funds).plus(site.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = site.funds;
                recharge.newFunds = siteNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);

                await tem.update(Site, site.id, {funds: siteNewFunds});

                let userSite = <UserSite>recharge.userSite;
                let fundsRecord = new FundsRecordSite();
                fundsRecord.oldFunds = site.funds;
                fundsRecord.funds = funds;
                fundsRecord.newFunds = siteNewFunds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Recharge;
                fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + funds;
                fundsRecord.site = site;
                fundsRecord.userSite = <UserSite>recharge.userSite;
                await tem.save(fundsRecord);

                io.emit(site.id + 'changeFunds', siteNewFunds);
                io.emit('minusBadge', 'rechargesPlatform');
                io.emit('platformRechargeDeal', recharge);

                let message = new MessageUserSite();
                message.user = userSite;
                message.title = MessageTitle.Recharge;
                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                message.frontUrl = '/home/recharge/records';
                message.aimId = recharge.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(userSite.id + 'plusMessageNum');
            });
        }
    }

    static async handRechargeFail(info: any, io:any) {
        let {id, failMsg} = info;
        let recharge = <Recharge>await Recharge.findById(id);
        recharge.intoAccountTime = now();
        recharge.failMsg = failMsg;
        recharge.state = RechargeState.Fail;
        recharge = await recharge.save();
        io.emit('minusBadge', 'rechargesPlatform');
        io.emit('platformRechargeFail', recharge);

        if (recharge.type === RechargeType.User) {
            let message = new MessageUser();
            message.user = <User>recharge.user;
            message.title = MessageTitle.RechargeError;
            message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
            message.frontUrl = '/recharge/records';
            message.aimId = recharge.id;
            await message.save();
            // 发送消息提示到用户
            io.emit(recharge.user!.id + 'plusMessageNum');
        }else{
            let message = new MessageUserSite();
            message.user = <UserSite>recharge.userSite;
            message.title = MessageTitle.RechargeError;
            message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
            message.frontUrl = '/home/recharge/records';
            message.aimId = recharge.id;
            await message.save();
            // 发送消息提示到用户
            io.emit(recharge.userSite!.id + 'plusMessageNum');
        }
    }

    static async all(page: any) {
        return await Recharge.all(page);
    }

    static async userAll(userId:string, page:any) {
        return await Recharge.userAllRecords(userId, page)
    }

    static async siteAll(siteId:string, page:any) {
        return await Recharge.siteAllRecords(siteId, page)
    }

}