import {RechargeCode} from "../entity/RechargeCode";
import {RechargeType} from "../entity/Recharge";
import {UserSite} from "../entity/UserSite";
import {User} from "../entity/User";
import {Site} from "../entity/Site";


export class CRechargeCode {

    static async getOne(info:{ type: RechargeType, site: Site, userSite?: UserSite, user?: User }) {
        let rechargeCode = new RechargeCode();
        rechargeCode.type = info.type;
        rechargeCode.site = info.site;
        rechargeCode.userSite = info.userSite;
        rechargeCode.user = info.user;
        rechargeCode.code = await RechargeCode.getCode();

        return await rechargeCode.save();
    }


}