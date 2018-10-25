import {Recharge, RechargeType} from "../entity/Recharge";
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
                            isDone: true,
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
                        isDone: true,
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

    static async userAll(userId:string) {
        return await Recharge.userAllRecords(userId)
    }

}