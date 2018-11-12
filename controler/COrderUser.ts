import {OrderUser} from "../entity/OrderUser";
import {getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";


export class COrderUser {
    static async findOrdersByUserAndProduct(productId: string, userId: string) {
        return await OrderUser.findOrdersByUserAndProduct(productId, userId);
    }

    static async add(info: any) {
        let {productId, user, site} = info;
        await getManager().transaction(async tem => {
            let product = <ProductSite> await tem.createQueryBuilder()
                .select('product')
                .from(ProductSite, 'product')
                .where('product.id = :id', {id: productId})
                .innerJoinAndSelect('product.productTypeSite', 'productType')
                .getOne();
            let productType = <ProductTypeSite>product.productTypeSite;


        });
    }
}
