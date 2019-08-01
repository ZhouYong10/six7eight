import {OrderStatus, OrderUser} from "../entity/OrderUser";
import {EntityManager, getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {assert, decimal, now, orderCanAccount} from "../utils";
import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {WitchType} from "../entity/ProductTypeBase";
import {Product} from "../entity/Product";
import {ProductType} from "../entity/ProductType";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {Platform} from "../entity/Platform";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {FundsRecordPlatform} from "../entity/FundsRecordPlatform";
import {MessageTitle} from "../entity/MessageBase";
import {MessageUser} from "../entity/MessageUser";
import {scheduleJob} from "node-schedule";


export class COrderUser {
    static async clear(day: number) {
        await OrderUser.clearOrderUser(day);
    }

    static async statisticsOrderPlatform(date: string) {
        return await OrderUser.statisticsOrderPlatform(date);
    }

    // 根据日期获取所有订单的下单总额和交易总额
    static async statisticsOrderFundsPlat(date: string) {
        let orderFunds = {
            platTotalFunds: 0,
            platRealTotalFunds: 0,
            siteTotalFunds: 0,
            siteRealTotalFunds: 0,
        };
        let result = await OrderUser.statisticsOrderFundsPlat(date);
        result.forEach((item: any) => {
            if (item.type === 'type_platform') {
                orderFunds.platTotalFunds = item.totalFunds;
                orderFunds.platRealTotalFunds = item.realTotalFunds;
            }
            if (item.type === 'type_site') {
                orderFunds.siteTotalFunds = item.totalFunds;
                orderFunds.siteRealTotalFunds = item.realTotalFunds;
            }
        });
        return orderFunds;
    }

    static async statisticsOrderSite(siteId: string, date: string) {
        return await OrderUser.statisticsOrderSite(siteId, date);
    }

    static async statisticsOrderFundsSite(siteId: string, date: string) {
        let orderFunds = {
            platTotalFunds: 0,
            platRealTotalFunds: 0,
            siteTotalFunds: 0,
            siteRealTotalFunds: 0,
        };
        let result = await OrderUser.statisticsOrderFundsSite(siteId, date);
        result.forEach((item: any) => {
            if (item.type === 'type_platform') {
                orderFunds.platTotalFunds = item.totalFunds;
                orderFunds.platRealTotalFunds = item.realTotalFunds;
            }
            if (item.type === 'type_site') {
                orderFunds.siteTotalFunds = item.totalFunds;
                orderFunds.siteRealTotalFunds = item.realTotalFunds;
            }
        });
        return orderFunds;
    }

    static async statisticsOrderUser(userId: string, date: string) {
        return await OrderUser.statisticsOrderUser(userId, date);
    }

    static async getWaitCount(productId: string) {
        return await OrderUser.getWaitCount(productId);
    }

    static async getSiteWaitCount(productId: string) {
        return await OrderUser.getSiteWaitCount(productId);
    }

    static async findUserOrdersByProductId(productId: string, userId: string, page: any) {
        return await OrderUser.findUserOrdersByProductId(productId, userId, page);
    }

    static async findById(id: string) {
        return await OrderUser.findByIdPlain(id);
    }

    static async findPlatformOrdersByProductId(productId: string, page: any) {
        return await OrderUser.findPlatformOrdersByProductId(productId, page);
    }

    static async findSiteOrdersByProductId(productId: string, siteId: string, page: any) {
        return await OrderUser.findSiteOrdersByProductId(productId, siteId, page);
    }

    private static async countOrderProfits(tem: EntityManager, site: Site, user: User,
                                           product: ProductSite, num: number, profits: Array<any>) {
        let userNow = <User>await tem.createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('user.id = :id', {id: user.id})
            .innerJoinAndSelect('user.parent', 'parent')
            .leftJoinAndSelect('parent.role', 'parentRole')
            .getOne();
        if (userNow) {
            let parent = <User>userNow.parent;
            if (parent.role.greaterThan(user.role)) {
                let profitPrice = decimal(product.getPriceByUserRole(user.role.type)).minus(product.getPriceByUserRole(parent.role.type));
                profits.push({
                    type: 'user',
                    id: parent.id,
                    name: parent.username,
                    profitPrice: parseFloat(profitPrice.toFixed(4)),
                    profit: parseFloat(decimal(profitPrice).times(num).toFixed(4))
                });
            }
            await COrderUser.countOrderProfits(tem, site, parent, product, num, profits);
        } else {
            if (product.type === WitchType.Platform) {
                let profitPriceSite = decimal(product.getPriceByUserRole(user.role.type)).minus(product.sitePrice);
                profits.push({
                    type: 'site',
                    id: site.id,
                    name: site.name,
                    profitPrice: parseFloat(profitPriceSite.toFixed(4)),
                    profit: parseFloat(decimal(profitPriceSite).times(num).toFixed(4))
                });
                let profitPricePlatform = decimal(product.sitePrice).minus(<number>product.price);
                profits.push({
                    type: 'platform',
                    id: null,
                    name: '平台',
                    profitPrice: parseFloat(profitPricePlatform.toFixed(4)),
                    profit: parseFloat(decimal(profitPricePlatform).times(num).toFixed(4))
                });
            } else {
                let profitPriceSite = decimal(product.getPriceByUserRole(user.role.type)).minus(product.sitePrice);
                profits.push({
                    type: 'site',
                    id: site.id,
                    name: site.name,
                    profitPrice: parseFloat(profitPriceSite.toFixed(4)),
                    profit: parseFloat(decimal(profitPriceSite).times(num).toFixed(4))
                });
            }
        }
    }

    static async add(info: any, user: User, io: any) {
        return await getManager().transaction(async tem => {
            let order = new OrderUser();
            let productSite = <ProductSite> await tem.createQueryBuilder()
                .select('productSite')
                .from(ProductSite, 'productSite')
                .where('productSite.id = :id', {id: info.productId})
                .leftJoinAndSelect('productSite.product', 'product')
                .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
                .leftJoinAndSelect('productTypeSite.productType', 'productType')
                .getOne();
            let productTypeSite = <ProductTypeSite>productSite.productTypeSite;
            let product = <Product>productSite.product;
            let productType = <ProductType>productSite.productTypeSite.productType;
            assert(info.num - productSite.minNum >= 0,
                `${productTypeSite.name} / ${productSite.name}, 最少下单: ${productSite.minNum} 个`);

            order.name = productTypeSite.name + ' / ' + productSite.name;
            order.type = productSite.type;
            order.speed = productSite.speed;
            order.num = info.num;
            order.price = productSite.getPriceByUserRole(user.role.type);
            order.totalPrice = parseFloat(decimal(order.price).times(order.num).toFixed(4));
            assert(user.funds - order.totalPrice >= 0, '账户余额不足，请充值！');
            order.fields = {};
            for (let i = 0; i < productSite.attrs.length; i++) {
                let item = productSite.attrs[i];
                order.fields[item.type] = {name: item.name, value: info[item.type]};
            }
            await COrderUser.countOrderProfits(tem, user.site, user, productSite, order.num, order.profits = []);
            if (order.type === WitchType.Platform) {
                order.basePrice = <number>productSite.price;
                order.baseFunds = parseFloat(decimal(productSite.price).times(order.num).toFixed(4));
            } else {
                order.basePrice = productSite.sitePrice;
                order.baseFunds = parseFloat(decimal(productSite.sitePrice).times(order.num).toFixed(4));
            }
            order.user = user;
            order.site = user.site;
            order.productSite = productSite;
            order.productTypeSite = productTypeSite;
            order.productType = productType;
            order.product = product;
            order = await tem.save(order);

            let userOldFunds = user.funds;
            user.funds = parseFloat(decimal(userOldFunds).minus(order.totalPrice).toFixed(4));
            user.freezeFunds = parseFloat(decimal(user.freezeFunds).plus(order.totalPrice).toFixed(4));
            await tem.save(user);

            let consume = new FundsRecordUser();
            consume.oldFunds = userOldFunds;
            consume.funds = order.totalPrice;
            consume.newFunds = user.funds;
            consume.upOrDown = FundsUpDown.Minus;
            consume.type = FundsRecordType.Order;
            consume.description = order.name + ', 单价: ￥' + order.price + ', 下单数量: ' + order.num;
            consume.user = user;
            await tem.save(consume);

            // io发送订单到后台订单管理页面
            if (order.type === WitchType.Site) {
                io.emit(user.site.id + 'plusBadge', productSite.id);
                io.emit(user.site.id + 'addOrder', {productId: productSite.id, order: order});
            } else {
                io.emit('plusBadge', product.id);
                io.emit('addOrder', {productId: product.id, order: order});
            }
            return order;
        });
    }

    private static async getOrderInfo(tem: EntityManager, orderId: string) {
        return await tem.createQueryBuilder()
            .select('order')
            .from(OrderUser, 'order')
            .where('order.id = :id', {id: orderId})
            .leftJoinAndSelect('order.user', 'user')
            .getOne();
    }

    // 订单执行
    static async execute(info: any, io: any) {
        let order = <OrderUser>await OrderUser.findByIdPlain(info.id);
        assert(order.status === OrderStatus.Wait, '当前订单 ' + order.status + ', 不可重复执行');
        order.status = OrderStatus.Execute;
        order.startNum = info.startNum;
        order.queueTime = info.queueTime;
        order.autoPutMsg = info.autoPutMsg || '';
        order.dealTime = now();
        order = await order.save();

        if (order.type === WitchType.Platform) {
            io.emit('minusBadge', order.productId);
            io.emit('executeOrder', {productId: order.productId, order: order})
        } else {
            io.emit(order.siteId + 'minusBadge', order.productSiteId);
            io.emit(order.siteId + 'executeOrder', {productId: order.productSiteId, order: order})
        }
        io.emit(order.productSiteId + 'executeOrder', order);
    }

    // 设置订单自动提交失败的失败消息
    static async setOrderAutoPutMsg(orderId: string, msg: string) {
        let order = <OrderUser>await OrderUser.findByIdPlain(orderId);
        order.autoPutMsg = msg;
        await order.save();
    }

    /* 订单自动结算定时任务 */
    static async orderAutoAccount(io: any) {
        // let acount = 0;
        scheduleJob('0 0 * * * *', async () => {
            // console.log('自动处理订单开始执行了: ' + acount++);
            let orders = <OrderUser[]> await OrderUser.getExecute();
            for(let i = 0; i < orders.length; i++){
                let order = orders[i];
                let canAccount = orderCanAccount(order);
                if (canAccount) {
                    await getManager().transaction(async tem => {
                        order.executeNum = order.num;
                        order.progress = '100%';
                        order.realTotalPrice = order.totalPrice;
                        order.finishTime = now();
                        order.status = OrderStatus.Finished;
                        await COrderUser.account(tem, order, <User>await tem.findOne(User, order.userId), io);
                    });
                }
            }
        });
    }

    // 订单结算(按照订单实际执行个数结算)
    private static async account(tem: EntityManager, order: OrderUser, orderUser:User, io: any) {
        if (order.executeNum > 0) {
            for (let i = 0; i < order.profits.length; i++) {
                let aim = order.profits[i];
                if (order.executeNum < order.num) {
                    aim.profit = parseFloat(decimal(aim.profitPrice).times(order.executeNum).toFixed(4));
                }
                switch (aim.type) {
                    case 'user':
                        let user = <User>await tem.findOne(User, aim.id);
                        let userOldFunds = user.funds;
                        user.funds = parseFloat(decimal(userOldFunds).plus(aim.profit).toFixed(4));
                        await tem.save(user);
                        let userFundsRecord = new FundsRecordUser();
                        userFundsRecord.oldFunds = userOldFunds;
                        userFundsRecord.funds = aim.profit;
                        userFundsRecord.newFunds = user.funds;
                        userFundsRecord.upOrDown = FundsUpDown.Plus;
                        userFundsRecord.type = FundsRecordType.Profit;
                        userFundsRecord.profitUsername = orderUser.username;
                        userFundsRecord.description = '下级: ' + userFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + userFundsRecord.funds;
                        userFundsRecord.user = user;
                        await tem.save(userFundsRecord);
                        // 修改用户账户金额
                        io.emit(user.id + 'changeFunds', user.funds);
                        break;
                    case 'site':
                        let siteProfitFunds = aim.profit;
                        if (order.type === WitchType.Site) {
                            siteProfitFunds = parseFloat(decimal(siteProfitFunds).plus(order.baseFunds).toFixed(4));
                        }
                        let site = <Site>await tem.findOne(Site, aim.id);
                        let siteOldFunds = site.funds;
                        site.funds = parseFloat(decimal(siteOldFunds).plus(siteProfitFunds).toFixed(4));
                        await tem.save(site);
                        let siteFundsRecord = new FundsRecordSite();
                        siteFundsRecord.oldFunds = siteOldFunds;
                        siteFundsRecord.funds = siteProfitFunds;
                        siteFundsRecord.newFunds = site.funds;
                        siteFundsRecord.upOrDown = FundsUpDown.Plus;
                        siteFundsRecord.type = FundsRecordType.Profit;
                        siteFundsRecord.profitUsername = orderUser.username;
                        siteFundsRecord.description = '用户: ' + siteFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + siteFundsRecord.funds;
                        if (order.type === WitchType.Site) {
                            siteFundsRecord.baseFunds = order.baseFunds;
                        }
                        siteFundsRecord.site = site;
                        await tem.save(siteFundsRecord);
                        // 修改站点账户金额
                        io.emit(site.id + 'changeFunds', site.funds);
                        break;
                    case 'platform':
                        let platform = <Platform>await tem.findOne(Platform);
                        let platformOldFunds = platform.allProfit;
                        platform.allProfit = parseFloat(decimal(platformOldFunds).plus(aim.profit).toFixed(4));
                        platform.baseFunds = parseFloat(decimal(platform.baseFunds).plus(order.baseFunds).toFixed(4));
                        await tem.save(platform);
                        let pFundsRecord = new FundsRecordPlatform();
                        pFundsRecord.oldFunds = platformOldFunds;
                        pFundsRecord.funds = aim.profit;
                        pFundsRecord.newFunds = platform.allProfit;
                        pFundsRecord.upOrDown = FundsUpDown.Plus;
                        pFundsRecord.type = FundsRecordType.Profit;
                        pFundsRecord.profitUsername = orderUser.username;
                        pFundsRecord.description = '用户: ' + pFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + pFundsRecord.funds;
                        pFundsRecord.baseFunds = order.baseFunds;
                        await tem.save(pFundsRecord);
                        // 修改平台金额
                        io.emit('platformChangeFunds', {baseFunds: platform.baseFunds, profit: platform.allProfit});
                        break;
                }
            }
        }
        orderUser.freezeFunds = parseFloat(decimal(orderUser.freezeFunds).minus(order.totalPrice).toFixed(4));
        await tem.save(orderUser);
        // await tem.save(order);
        await tem.update(OrderUser, order.id, {
            executeNum: order.executeNum,
            progress: order.progress,
            realTotalPrice: order.realTotalPrice,
            finishTime: order.finishTime,
            status: order.status,
            baseFunds: order.baseFunds,
            refundMsg: order.refundMsg,
            profits: order.profits,
        });

        io.emit(orderUser.id + 'changeFundsAndFreezeFunds', {
            funds: orderUser.funds,
            freezeFunds: orderUser.freezeFunds
        });
    }

    // 手动结算订单
    static async handleAccount(orderId: string, io:any) {
        await getManager().transaction(async tem => {
            let order = <OrderUser>await COrderUser.getOrderInfo(tem, orderId);
            assert(order.status === OrderStatus.Queue ||
                order.status === OrderStatus.Execute ||
                order.status === OrderStatus.WaitAccount, `当前订单 ${order.status}, 不能结算`);
            order.executeNum = order.num;
            order.progress = '100%';
            order.realTotalPrice = order.totalPrice;
            order.finishTime = now();
            order.status = OrderStatus.Finished;
            await COrderUser.account(tem, order, order.user, io);
            if (order.type === WitchType.Platform) {
                io.emit('accountOrder', {productId: order.productId, order: order})
            } else {
                io.emit(order.siteId + 'accountOrder', {productId: order.productSiteId, order: order})
            }
            io.emit(order.productSiteId + 'accountOrder', order);
        });
    }

    // 管理员撤销订单
    static async backout(info: any, io: any) {
        await getManager().transaction(async tem => {
            // 查询出订单信息
            let order = <OrderUser>await COrderUser.getOrderInfo(tem, info.id);
            assert(order.status !== OrderStatus.Finished &&
                order.status !== OrderStatus.Refunded,
                `当前订单 ${order.status}，不能撤销`);
            assert(order.num - info.executeNum >= 0 , '订单执行数量不能大于下单数量');
            let dealOrderStatus = order.status;
            order.executeNum = info.executeNum;
            order.progress = (order.executeNum / order.num * 100).toFixed(2) + '%';
            if (order.status === OrderStatus.Wait) {
                order.executeNum = 0;
            }
            if (order.executeNum == 0) {
                for (let i = 0; i < order.profits.length; i++) {
                    let aim = order.profits[i];
                    aim.profit = 0;
                }
            }
            order.realTotalPrice = parseFloat(decimal(order.price).times(order.executeNum).toFixed(4));
            order.baseFunds = parseFloat(decimal(order.basePrice).times(order.executeNum).toFixed(4));
            order.refundMsg = info.refundMsg;
            order.finishTime = now();
            order.status = OrderStatus.Refunded;

            let orderRefundFunds = parseFloat(decimal(order.totalPrice).minus(order.realTotalPrice).toFixed(4));
            if (orderRefundFunds > 0) {
                let userOldFunds = order.user.funds;
                order.user.funds = parseFloat(decimal(order.user.funds).plus(orderRefundFunds).toFixed(4));
                let userFundsRecord = new FundsRecordUser();
                userFundsRecord.oldFunds = userOldFunds;
                userFundsRecord.funds = orderRefundFunds;
                userFundsRecord.newFunds = order.user.funds;
                userFundsRecord.upOrDown = FundsUpDown.Plus;
                userFundsRecord.type = FundsRecordType.Order;
                userFundsRecord.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                    ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                userFundsRecord.user = order.user;
                await tem.save(userFundsRecord);
            }
            await COrderUser.account(tem, order, order.user, io);
            if (order.type === WitchType.Platform) {
                if (dealOrderStatus === OrderStatus.Wait) {
                    io.emit('minusBadge', order.productId);
                }
                io.emit('refundOrder', {productId: order.productId, order: order})
            } else {
                if (dealOrderStatus === OrderStatus.Wait) {
                    io.emit(order.siteId + 'minusBadge', order.productSiteId);
                }
                io.emit(order.siteId + 'refundOrder', {productId: order.productSiteId, order: order})
            }
            // 修改用户订单信息
            io.emit(order.productSiteId + 'refundOrder', order);

            let message = new MessageUser();
            message.user = order.user;
            message.title = MessageTitle.OrderRefund;
            message.content = `${order.name} -- ${order.refundMsg}`;
            message.frontUrl = `/product/${order.productSiteId}`;
            message.aimId = order.id;
            await tem.save(message);
            // 发送消息提示到用户
            io.emit(order.user.id + 'plusMessageNum');
        });
    }

    // 用户申请撤单
    static async applyRefund(orderId: string, io: any) {
        return await getManager().transaction(async tem => {
            let order = <OrderUser>await tem.createQueryBuilder()
                .select('order')
                .from(OrderUser, 'order')
                .where('order.id = :id', {id: orderId})
                .leftJoinAndSelect('order.site', 'site')
                .getOne();
            assert((order.status !== OrderStatus.Refunded && order.status !== OrderStatus.Finished),
                `当前订单${order.status}了, 不能申请撤销`);
            let site = <Site>order.site;

            let error = new ErrorOrderUser();
            error.type = order.type;
            error.content = '用户申请撤销订单';
            error.order = order;
            error.productId = <string>(order.type === WitchType.Site ? order.productSiteId : order.productId);
            error.site = site;
            error = await tem.save(error);

            // 发送订单报错到后台页面
            if (error.type === WitchType.Site) {
                io.emit(site.id + 'plusBadge', 'orderErrorSite');
                io.emit(site.id + 'addOrderError', error);
            } else {
                io.emit('plusBadge', 'orderErrorPlatform');
                io.emit('addOrderError', error);
            }
        });
    }

    static async addError(info: any, io: any) {
        let {orderId, content} = info;
        let order = <OrderUser>await OrderUser.findByIdWithSite(orderId);
        let error = new ErrorOrderUser();
        error.type = order.type;
        error.productId = <string>(order.type === WitchType.Site ? order.productSiteId : order.productId);
        error.content = content;
        error.order = order;
        error.site = order.site;
        error = await error.save();

        // 发送订单报错到后台页面
        if (error.type === WitchType.Site) {
            io.emit(error.site.id + 'plusOrderErrorBadge', {fingerprint: 'orderErrorSite', productId: error.productId});
            io.emit(error.site.id + 'addOrderError', error);
        } else {
            io.emit('plusOrderErrorBadge', {fingerprint: 'orderErrorPlatform', productId: error.productId});
            io.emit('addOrderError', error);
        }
    }

    static async getErrors(orderId: string) {
        return await ErrorOrderUser.allByOrderId(orderId);
    }

    static async seeErrors(orderId: string) {
        await OrderUser.update(orderId, {newErrorDeal: false});
    }
}
