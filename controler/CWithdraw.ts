import {Withdraw, WithdrawType} from "../entity/Withdraw";
import {decimal} from "../utils";
import {User} from "../entity/User";
import {UserSite} from "../entity/UserSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";

export class CWithdraw {

    static async add(info: {alipayCount:string, alipayName:string, funds:number, type:WithdrawType, user?:User, userSite?:UserSite, site:Site}) {
        let {alipayCount, alipayName, funds, type, user, userSite, site} = info;
        let withdraw = new Withdraw();
        withdraw.alipayCount = alipayCount;
        withdraw.alipayName = alipayName;
        withdraw.funds = funds;
        withdraw.type = type;
        withdraw.user = user;
        withdraw.userSite = userSite;
        withdraw.site = site;
        await getManager().transaction(async tem => {
            if (type === WithdrawType.User) {
                withdraw.oldFunds = user!.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                await tem.update(User, user!.id, {
                    funds: withdraw.newFunds,
                    freezeFunds: parseFloat(decimal(user!.freezeFunds).plus(funds).toFixed(4))
                });
            }else if (type === WithdrawType.Site) {
                withdraw.oldFunds = site.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                await tem.update(Site, site.id, {
                    funds:  withdraw.newFunds,
                    freezeFunds: parseFloat(decimal(site.freezeFunds).plus(funds).toFixed(4))
                })
            }
            await tem.save(withdraw);
        });
    }

}