import {Recharge, RechargeState, RechargeType} from "../entity/Recharge";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {decimal, now} from "../utils";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {UserSite} from "../entity/UserSite";


export class CRecharge {

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
        let user = <User>recharge.user;
        let site = <Site>recharge.site;
        // 给用户充值
        if (type === RechargeType.User) {
            return await getManager().transaction(async tem => {
                let userNewFunds:number = parseFloat(decimal(funds).plus(user.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = user.funds;
                recharge.newFunds = userNewFunds;
                recharge.state = RechargeState.Success;

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

                return await tem.save(recharge);
            });
        }else if (type === RechargeType.Site) {
            // 给站点充值
            return await getManager().transaction(async tem => {
                let siteNewFunds: number = parseFloat(decimal(funds).plus(site.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = site.funds;
                recharge.newFunds = siteNewFunds;
                recharge.state = RechargeState.Success;

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

                return await tem.save(recharge);
            });
        }
    }

    static async handRechargeFail(info: any) {
        let {id, failMsg} = info;
        let recharge = <Recharge>await Recharge.findByIdOnlyRecharge(id);
        recharge.intoAccountTime = now();
        recharge.failMsg = failMsg;
        recharge.state = RechargeState.Fail;
        return await recharge.save();
    }

    static async all() {
        return await Recharge.all();
    }

    static async userAll(userId:string) {
        return await Recharge.userAllRecords(userId)
    }

    static async siteAll(siteId:string) {
        return await Recharge.siteAllRecords(siteId)
    }

}