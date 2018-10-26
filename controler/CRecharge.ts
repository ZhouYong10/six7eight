import {Recharge, RechargeState, RechargeType} from "../entity/Recharge";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {decimal, now} from "../utils";


export class CRecharge {

    static async findByAlipayId(info:any) {
        return await Recharge.findHandCommited(info.alipayId);
    }

    // 用户手动充值
    static async addOrRecharge(info: any) {
        let {alipayId, type, way, user, userSite, site} = info;
        let recharge = await Recharge.findAutoCommited(alipayId);
        // 如果自动抓取的未充值记录已经存在，则充值
        if (recharge) {
            // 给用户充值
            if (type === RechargeType.User) {
                await getManager().transaction(async tem => {
                    let userNewFunds:number = parseFloat(decimal(recharge!.funds).plus(user.funds).toFixed(4));
                        await tem.update(Recharge, recharge!.id, {
                            intoAccountTime: now(),
                            oldFunds: user.funds,
                            newFunds: userNewFunds,
                            state: RechargeState.Success,
                            type: type,
                            user: user,
                            site: site,
                        });
                    await tem.update(User, user.id, {funds: userNewFunds});
                });
            }else if (type === RechargeType.Site) {
                // 给站点充值
                await getManager().transaction(async tem => {
                    let siteNewFunds: number = parseFloat(decimal(recharge!.funds).plus(site.funds).toFixed(4));
                    await tem.update(Recharge, recharge!.id, {
                        intoAccountTime: now(),
                        oldFunds: site.funds,
                        newFunds: siteNewFunds,
                        state: RechargeState.Success,
                        type: type,
                        userSite: userSite,
                        site: site,
                    });
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
            await recharge.save();
        }
    }

    // 平台手动处理充值
    static async handRecharge(info: any) {
        let {id, alipayCount, funds} = info;
        let recharge = <Recharge>await Recharge.findById(id);
        let {type, user, site} = recharge;
        // 给用户充值
        if (type === RechargeType.User) {
            await getManager().transaction(async tem => {
                let userNewFunds:number = parseFloat(decimal(funds).plus(user!.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.alipayCount = alipayCount;
                recharge.funds = funds;
                recharge.oldFunds = user!.funds;
                recharge.newFunds = userNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);
                await tem.update(User, user!.id, {funds: userNewFunds});
            });
        }else if (type === RechargeType.Site) {
            // 给站点充值
            await getManager().transaction(async tem => {
                let siteNewFunds: number = parseFloat(decimal(funds).plus(site.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.alipayCount = alipayCount;
                recharge.funds = funds;
                recharge.oldFunds = site.funds;
                recharge.newFunds = siteNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);
                await tem.update(Site, site.id, {funds: siteNewFunds});
            });
        }
        return recharge;
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