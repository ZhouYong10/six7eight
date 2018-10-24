import {Recharge} from "../entity/Recharge";


export class CRecharge {

    static async findByAlipayId(info:any) {
        return await Recharge.findHandCommited(info.alipayId);
    }

    static async add(info: any) {

    }

}