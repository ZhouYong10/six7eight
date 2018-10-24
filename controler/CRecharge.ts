import {Recharge, RechargeType, RechargeWay} from "../entity/Recharge";


export class CRecharge {

    static async findByAlipayId(info:any) {
        return await Recharge.findHandCommited(info.alipayId);
    }

    static async handAdd(info: any) {
        let recharge = await Recharge.findAutoCommited(info.alipayId);
        // 如果自动抓取的未充值记录已经存在，则充值
        if (recharge) {

        } else {
            // 如果自动抓取的未充值记录不存在，则保存一条手动未充值记录
            recharge = new Recharge();
            recharge.alipayId = info.alipayId;
            recharge.type = RechargeType.User;
            recharge.way = RechargeWay.Hand;
            recharge.user = info.user;
            recharge.site = info.site;
            await recharge.save();
        }
    }

    static async userAll(userId:string) {
        return await Recharge.userAllRecords(userId)
    }

}