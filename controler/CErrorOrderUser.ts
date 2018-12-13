import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {UserAdmin} from "../entity/UserAdmin";
import {getManager} from "typeorm";
import {OrderStatus, OrderUser} from "../entity/OrderUser";
import {now} from "../utils";
import {ProductSite} from "../entity/ProductSite";
import {UserSite} from "../entity/UserSite";
import {WitchType} from "../entity/ProductTypeBase";
import {Site} from "../entity/Site";
import {COrderUser} from "./COrderUser";

export class CErrorOrderUser {

    static async platformAll() {
        return await ErrorOrderUser.platformAll();
    }

    static async getWaitCount() {
        return await ErrorOrderUser.getWaitCount();
    }

    static async getSiteWaitCount(siteId: string) {
        return await ErrorOrderUser.getSiteWaitCount(siteId);
    }

    static async siteAll(siteId: string) {
        return await ErrorOrderUser.siteAll(siteId);
    }

    static async dealError(info: any, user: UserAdmin | UserSite, io: any) {
        let {id, dealContent} = info;
        await getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: id})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('error.site', 'site')
                .leftJoinAndSelect('order.productSite', 'product')
                .getOne();
            let order = <OrderUser>error.order;
            let product = <ProductSite>order.productSite;
            order.newErrorDeal = true;
            if (order.status === OrderStatus.Refund) {
                order.status = OrderStatus.Execute;
            }

            error.isDeal = true;
            error.dealContent = dealContent;
            error.dealTime = now();
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusBadge", 'orderErrorPlatform');
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.site.id + "minusBadge", 'orderErrorSite');
                io.emit(error.site.id + "dealOrderError", error);
            }
            await tem.save(error);
            order = await tem.save(order);

            // 将已处理报错订单状态发送到用户页面
            io.emit(product.id + "hasErrorDeal", order);
        });
    }

    static async dealErrorOrderRefund(info: any, user: UserAdmin | UserSite, io: any) {
        await getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: info.errorId})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('error.site', 'site')
                .leftJoinAndSelect('order.productSite', 'product')
                .getOne();
            let site = <Site>error.site;
            let order = <OrderUser>error.order;
            let product = <ProductSite>order.productSite;

            order.newErrorDeal = true;
            await tem.save(order);

            error.isDeal = true;
            error.dealContent = info.refundMsg;
            error.dealTime = now();
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusBadge", 'orderErrorPlatform');
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(site.id + "minusBadge", 'orderErrorSite');
                io.emit(site.id + "dealOrderError", error);
            }
            await tem.save(error);

            // 将已处理报错订单状态发送到用户页面
            io.emit(product.id + "hasErrorDeal", order);
        });
        await COrderUser.refund({
            id: info.orderId,
            executeNum: info.executeNum,
            refundMsg: info.refundMsg
        }, io);
    }

}
