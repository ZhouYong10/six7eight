import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {UserAdmin} from "../entity/UserAdmin";
import {getManager} from "typeorm";
import {OrderUser} from "../entity/OrderUser";
import {now} from "../utils";
import {ProductSite} from "../entity/ProductSite";

export class CErrorOrderUser {

    static async platformAll() {
        return await ErrorOrderUser.platformAll();
    }

    static async siteAll(siteId: string) {
        return await ErrorOrderUser.siteAll(siteId);
    }

    static async platformDeal(info: any, user: UserAdmin, io: any) {
        let {id, dealContent} = info;
        return getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: id})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('order.productSite', 'product')
                .getOne();
            let order = <OrderUser>error.order;
            let product = <ProductSite>order.productSite;

            error.isDeal = true;
            error.dealContent = dealContent;
            error.dealTime = now();
            error.userAdmin = user;
            error = await tem.save(error);
            await tem.update(OrderUser, order.id, {newErrorDeal: true})

            // 将已处理报错订单状态发送到用户页面
            io.emit(product.id + "hasErrorDeal", order.id);
            return error;
        });
    }

}
