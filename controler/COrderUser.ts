import {OrderUser} from "../entity/OrderUser";


export class COrderUser {
    static async findOrdersByUserAndProduct(productId: string, userId: string) {
        return await OrderUser.findOrdersByUserAndProduct(productId, userId);
    }
}
