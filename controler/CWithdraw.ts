import {Withdraw, WithdrawState, WithdrawType} from "../entity/Withdraw";
import {assert, decimal, now} from "../utils";
import {User} from "../entity/User";
import {UserSite} from "../entity/UserSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {MessageTitle} from "../entity/MessageBase";
import {MessageUser} from "../entity/MessageUser";
import {MessageUserSite} from "../entity/MessageUserSite";

export class CWithdraw {

    static async getWaitCount() {
        return await Withdraw.getWaitCount();
    }

    static async add(info: { alipayCount: string, alipayName: string, funds: number, type: WithdrawType, user?: User, userSite?: UserSite, site: Site }, io: any) {
        let {alipayCount, alipayName, funds, type, user, userSite, site} = info;
        let withdraw = new Withdraw();
        withdraw.alipayCount = alipayCount;
        withdraw.alipayName = alipayName;
        withdraw.funds = funds;
        withdraw.type = type;
        withdraw.user = user;
        withdraw.userSite = userSite;
        withdraw.site = site;
        return await getManager().transaction(async tem => {
            let freezeFunds;
            if (type === WithdrawType.User) {
                withdraw.oldFunds = user!.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                freezeFunds = parseFloat(decimal(user!.freezeFunds).plus(funds).toFixed(4));
                await tem.update(User, user!.id, {
                    funds: withdraw.newFunds,
                    freezeFunds: freezeFunds
                });
                let fundsRecord = new FundsRecordUser();
                fundsRecord.oldFunds = withdraw.oldFunds;
                fundsRecord.funds = withdraw.funds;
                fundsRecord.newFunds = withdraw.newFunds;
                fundsRecord.upOrDown = FundsUpDown.Minus;
                fundsRecord.type = FundsRecordType.Withdraw;
                fundsRecord.description = '账户提现: ￥' + withdraw.funds;
                fundsRecord.user = <User>user;
                await tem.save(fundsRecord);
            } else if (type === WithdrawType.Site) {
                withdraw.oldFunds = site.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                freezeFunds = parseFloat(decimal(site.freezeFunds).plus(funds).toFixed(4));
                await tem.update(Site, site.id, {
                    funds: withdraw.newFunds,
                    freezeFunds: freezeFunds
                });
                let fundsRecord = new FundsRecordSite();
                fundsRecord.oldFunds = withdraw.oldFunds;
                fundsRecord.funds = withdraw.funds;
                fundsRecord.newFunds = withdraw.newFunds;
                fundsRecord.upOrDown = FundsUpDown.Minus;
                fundsRecord.type = FundsRecordType.Withdraw;
                fundsRecord.description = '站点管理员: ' + withdraw.userSite!.username + ', 提现: ￥' + withdraw.funds;
                fundsRecord.userSite = <UserSite>withdraw.userSite;
                fundsRecord.site = site;
                await tem.save(fundsRecord);
            }
            withdraw = await tem.save(withdraw);
            io.emit('plusBadge', 'withdrawsPlatform');
            io.emit('platformWithdrawAdd', withdraw);
            return {withdraw: withdraw, freezeFunds: freezeFunds}
        });
    }

    static async userAll(userId: string, page:any) {
        return await Withdraw.userAllRecords(userId, page);
    }

    static async siteAll(siteId: string, page:any) {
        return await Withdraw.siteAllRecords(siteId,page);
    }

    static async findByIdSite(id: string) {
        return await Withdraw.findByIdWithUserSite(id);
    }

    static async findByIdUser(id: string) {
        return await Withdraw.findByIdPlain(id);
    }

    static async all(page: any) {
        return await Withdraw.all(page);
    }

    static async handWithdraw(withdrawId: string, io: any) {
        let withdraw = <Withdraw>await Withdraw.findByIdWithUserAndSite(withdrawId);
        withdraw.dealTime = now();
        withdraw.state = WithdrawState.Success;
        await getManager().transaction(async tem => {
            let type = withdraw.type;
            if (type === WithdrawType.User) {
                let user = <User>withdraw.user;
                assert(user.freezeFunds >= withdraw.funds, '账户冻结金额不足！');
                let freezeFunds = parseFloat(decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(User, user.id, {
                    freezeFunds: freezeFunds
                });
                io.emit(user.id + 'changeFreezeFunds', freezeFunds);

                let message = new MessageUser();
                message.user = user;
                message.title = MessageTitle.Withdraw;
                message.content = `提现: ${withdraw.funds} 元, 已到账!`;
                message.frontUrl = '/withdraw/records';
                message.aimId = withdraw.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(user.id + 'plusMessageNum');
            }else if (type === WithdrawType.Site) {
                let site = <Site>withdraw.site;
                assert(site.freezeFunds >= withdraw.funds, '站点冻结金额不足！');
                let freezeFunds = parseFloat(decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(Site, site.id, {
                    freezeFunds: freezeFunds
                });
                io.emit(site.id + 'changeFreezeFunds', freezeFunds);

                let message = new MessageUserSite();
                message.user = <UserSite>withdraw.userSite;
                message.title = MessageTitle.Withdraw;
                message.content = `提现: ${withdraw.funds} 元, 已到账!`;
                message.frontUrl = '/home/withdraw/records';
                message.aimId = withdraw.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(withdraw.userSite!.id + 'plusMessageNum');
            }
            withdraw = await tem.save(withdraw);
            io.emit('minusBadge', 'withdrawsPlatform');
            io.emit('platformWithdrawDeal', withdraw);
        });
    }

    static async handWithdrawFail(info: any, io: any) {
        let {id, failMsg} = info;
        let withdraw = <Withdraw>await Withdraw.findByIdWithUserAndSite(id);
        withdraw.dealTime = now();
        withdraw.failMsg = failMsg;
        withdraw.state = WithdrawState.Fail;
        await getManager().transaction(async tem => {
            let type = withdraw.type;
            if (type === WithdrawType.User) {
                let user = <User>withdraw.user;
                let funds = parseFloat(decimal(user.funds).plus(withdraw.funds).toFixed(4));
                let freezeFunds = parseFloat(decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(User, user.id, {
                    funds: funds,
                    freezeFunds: freezeFunds
                });
                let fundsRecord = new FundsRecordUser();
                fundsRecord.oldFunds = user.funds;
                fundsRecord.funds = withdraw.funds;
                fundsRecord.newFunds = funds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Withdraw;
                fundsRecord.description = '账户提现失败，退回: ￥' + withdraw.funds;
                fundsRecord.user = user;
                await tem.save(fundsRecord);
                io.emit(user.id + 'changeFundsAndFreezeFunds', {funds: funds, freezeFunds: freezeFunds});

                let message = new MessageUser();
                message.user = user;
                message.title = MessageTitle.WithdrawError;
                message.content = `提现: ${withdraw.funds} 元, 失败 -- ${withdraw.failMsg}`;
                message.frontUrl = '/withdraw/records';
                message.aimId = withdraw.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(user.id + 'plusMessageNum');
            } else if (type === WithdrawType.Site) {
                let site = <Site>withdraw.site;
                let funds = parseFloat(decimal(site.funds).plus(withdraw.funds).toFixed(4));
                let freezeFunds = parseFloat(decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(Site, site.id, {
                    funds: funds,
                    freezeFunds: freezeFunds
                });
                let fundsRecord = new FundsRecordSite();
                fundsRecord.oldFunds = site.funds;
                fundsRecord.funds = withdraw.funds;
                fundsRecord.newFunds = funds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Withdraw;
                fundsRecord.description = '站点管理员: ' + withdraw.userSite!.username + ', 提现失败，退回: ￥' + withdraw.funds;
                fundsRecord.userSite = <UserSite>withdraw.userSite;
                fundsRecord.site = site;
                await tem.save(fundsRecord);
                io.emit(site.id + 'changeFundsAndFreezeFunds', {funds: funds, freezeFunds: freezeFunds});

                let message = new MessageUserSite();
                message.user = <UserSite>withdraw.userSite;
                message.title = MessageTitle.WithdrawError;
                message.content = `提现: ${withdraw.funds} 元, 失败 -- ${withdraw.failMsg}`;
                message.frontUrl = '/home/withdraw/records';
                message.aimId = withdraw.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(withdraw.userSite!.id + 'plusMessageNum');
            }
            withdraw = await tem.save(withdraw);
            io.emit('minusBadge', 'withdrawsPlatform');
            io.emit('platformWithdrawDeal', withdraw);
        });
    }

}