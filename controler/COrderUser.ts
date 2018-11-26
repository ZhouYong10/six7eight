import {OrderUser} from "../entity/OrderUser";
import {getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ConsumeUser} from "../entity/ConsumeUser";
import {decimal} from "../utils";
import {ErrorOrderUser} from "../entity/ErrorOrderUser";


export class COrderUser {
    static async findUserOrdersByProductId(productId: string, userId: string) {
        return await OrderUser.findUserOrdersByProductId(productId, userId);
    }

    static async findPlatformOrdersByProductId(productId: string) {
        return await OrderUser.findPlatformOrdersByProductId(productId);
    }

    static async findSiteOrdersByProductId(productId: string, siteId: string) {
        return await OrderUser.findSiteOrdersByProductId(productId, siteId);
    }

    static async add(info: any) {
        let {productId, num, user, site} = info;
        let order = new OrderUser();
        await getManager().transaction(async tem => {
            let productSite = <ProductSite> await tem.createQueryBuilder()
                .select('productSite')
                .from(ProductSite, 'productSite')
                .where('productSite.id = :id', {id: productId})
                .leftJoinAndSelect('productSite.product', 'product')
                .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
                .leftJoinAndSelect('productTypeSite.productType', 'productType')
                .getOne();
            let productTypeSite = <ProductTypeSite>productSite.productTypeSite;
            let product = productSite.product;
            let productType = productSite.productTypeSite.productType;

            order.countTotalPriceAndProfit(productSite.getPriceByUserRole(user.role), num, productSite);
            if (order.totalPrice > user.funds) {
                throw new Error('账户余额不足，请充值！');
            }

            let fields:any = {};
            for(let i = 0; i < productSite.attrs.length; i++){
                let item = productSite.attrs[i];
                fields[item.type] = {name: item.name, value: info[item.type]};
            }

            order.fields = fields;
            order.type = productSite.type;
            order.site = site;
            order.user = user;
            order.productSite = productSite;
            order.productTypeSite = productTypeSite;
            order.productType = productType;
            order.product = product;
            order = await tem.save(order);

            let userOldFunds = user.funds;
            user.funds = parseFloat(decimal(userOldFunds).minus(order.totalPrice).toFixed(4));
            user.freezeFunds = parseFloat(decimal(user.freezeFunds).plus(order.totalPrice).toFixed(4));
            await tem.save(user);

            let consume = new ConsumeUser();
            consume.userOldFunds = userOldFunds;
            consume.funds = order.totalPrice;
            consume.userNewFunds = user.funds;
            consume.type = productTypeSite.name + '/' + productSite.name;
            consume.description = productTypeSite.name + '/' + productSite.name + ', 单价： ￥' + order.price + ', 下单数量： ' + order.num;
            consume.user = user;
            consume.order = order;
            await tem.save(consume);
        });
        return order;
    }

    static async addError(info: any, io: any) {
        let {orderId, content} = info;
        let order = <OrderUser>await OrderUser.findById(orderId);
        let error = new ErrorOrderUser();
        error.type = order.type;
        error.content = content;
        error.order = order;
        await error.save();
    }

    static async getErrors(orderId: string) {
        return await ErrorOrderUser.allByOrderId(orderId);
    }
}
