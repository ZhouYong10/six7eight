import {OrderUser} from "../entity/OrderUser";
import {getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ConsumeUser} from "../entity/ConsumeUser";
import {decimal} from "../utils";
import {Product} from "../entity/Product";


export class COrderUser {
    static async findOrdersByUserAndProduct(productId: string, userId: string) {
        return await OrderUser.findOrdersByUserAndProduct(productId, userId);
    }

    static async findOrdersByProduct(productId: string) {
        let product = <Product>await Product.findById(productId);
        return await OrderUser.findOrdersByProductName(product.name);
    }

    static async add(info: any) {
        let {productId, num, user, site} = info;
        let order: OrderUser = new OrderUser();
        await getManager().transaction(async tem => {
            let product = <ProductSite> await tem.createQueryBuilder()
                .select('product')
                .from(ProductSite, 'product')
                .where('product.id = :id', {id: productId})
                .innerJoinAndSelect('product.productTypeSite', 'productType')
                .getOne();
            let productType = <ProductTypeSite>product.productTypeSite;

            let fields:any = {};
            for(let i = 0; i < product.attrs.length; i++){
                let item = product.attrs[i];
                fields[item.type] = {name: item.name, value: info[item.type]};
            }

            order.countTotalPriceAndProfit(product.getPriceByUserRole(user.role), num, product);
            if (order.totalPrice > user.funds) {
                throw new Error('账户余额不足，请充值！');
            }
            order.fields = fields;
            order.site = site;
            order.user = user;
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
            consume.type = productType.name + '/' + product.name;
            consume.description = productType.name + '/' + product.name + ', 下单数量： ' + order.num;
            consume.user = user;
            consume.order = order;
            await tem.save(consume);
        });
        return order;
    }
}
