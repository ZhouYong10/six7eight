import {RechargeCode} from "../entity/RechargeCode";
import {RechargeType} from "../entity/Recharge";
import {UserSite} from "../entity/UserSite";
import {User} from "../entity/User";
import {Site} from "../entity/Site";


export class CRechargeCode {

    static async getOne(info:{ type: RechargeType, site: Site, userSite?: UserSite, user?: User }) {
        let rechargeCode = await RechargeCode.getCode(info);
        return rechargeCode.code;
    }


}