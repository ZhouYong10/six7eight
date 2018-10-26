import {Withdraw, WithdrawType} from "../entity/Withdraw";
import {decimal} from "../utils";
import {User} from "../entity/User";
import {UserSite} from "../entity/UserSite";
import {Site} from "../entity/Site";

export class CWithdraw {

    static async add(info: {alipayCount:string, alipayName:string, funds:number, type:WithdrawType, user?:User, userSite?:UserSite, site:Site}) {
        let {alipayCount, alipayName, funds, type, user, userSite, site} = info;
        let oldFunds, newFunds;
        if (type === WithdrawType.User) {
            oldFunds = user!.funds;
            newFunds = parseFloat(decimal(oldFunds).minus(funds).toFixed(4));
        }else if (type === WithdrawType.Site) {
            oldFunds = site.funds;
            newFunds = parseFloat(decimal(oldFunds).minus(funds).toFixed(4));
        }
        let withdraw = new Withdraw();
        withdraw.alipayCount = alipayCount;
        withdraw.alipayName = alipayName;
        withdraw.funds = funds;
        withdraw.oldFunds = <number>oldFunds;
        withdraw.newFunds = <number>newFunds;
        withdraw.type = type;
        withdraw.user = user;
        withdraw.userSite = userSite;
        withdraw.site = site;
    }

}