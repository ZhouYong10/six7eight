import {Withdraw, WithdrawState, WithdrawType} from "../entity/Withdraw";
import {assert, decimal, now} from "../utils";
import {User} from "../entity/User";
import {UserSite} from "../entity/UserSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";

export class CWithdraw {

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
                assert(user!.funds > funds, '账户余额不足!');
                withdraw.oldFunds = user!.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                freezeFunds = parseFloat(decimal(user!.freezeFunds).plus(funds).toFixed(4));
                await tem.update(User, user!.id, {
                    funds: withdraw.newFunds,
                    freezeFunds: freezeFunds
                });
            } else if (type === WithdrawType.Site) {
                assert(site.funds > funds, '站点余额不足！');
                withdraw.oldFunds = site.funds;
                withdraw.newFunds = parseFloat(decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                freezeFunds = parseFloat(decimal(site.freezeFunds).plus(funds).toFixed(4));
                await tem.update(Site, site.id, {
                    funds: withdraw.newFunds,
                    freezeFunds: freezeFunds
                })
            }
            withdraw = await tem.save(withdraw);
            io.emit('platformWithdrawAdd', withdraw);
            return {withdraw: withdraw, freezeFunds: freezeFunds}
        });
    }

    static async userAll(userId: string) {
        return await Withdraw.userAllRecords(userId);
    }

    static async siteAll(siteId: string) {
        return await Withdraw.siteAllRecords(siteId);
    }

    static async all() {
        return await Withdraw.all();
    }

    static async handWithdraw(withdrawId: string, io: any) {
        let withdraw = <Withdraw>await Withdraw.findByIdWithUserAndSite(withdrawId);
        withdraw.dealTime = now();
        withdraw.state = WithdrawState.Success;
        return await getManager().transaction(async tem => {
            let type = withdraw.type;
            if (type === WithdrawType.User) {
                let user = <User>withdraw.user;
                assert(user.freezeFunds > withdraw.funds, '账户冻结金额不足！');
                let freezeFunds = parseFloat(decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(User, user.id, {
                    freezeFunds: freezeFunds
                });
                io.emit(user.id + 'changeFreezeFunds', freezeFunds);
            }else if (type === WithdrawType.Site) {
                let site = <Site>withdraw.site;
                assert(site.freezeFunds > withdraw.funds, '站点冻结金额不足！');
                let freezeFunds = parseFloat(decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4));
                await tem.update(Site, site.id, {
                    freezeFunds: freezeFunds
                });
                io.emit(site.id + 'changeFreezeFunds', freezeFunds);
            }
            return await tem.save(withdraw);
        });
    }

    static async handWithdrawFail(info: any) {
        let {id, failMsg} = info;
        let withdraw = <Withdraw>await Withdraw.findByIdWithUserAndSite(id);
        withdraw.dealTime = now();
        withdraw.failMsg = failMsg;
        withdraw.state = WithdrawState.Fail;
        await getManager().transaction(async tem => {
            let type = withdraw.type;
            if (type === WithdrawType.User) {
                let user = <User>withdraw.user;
                await tem.update(User, user.id, {
                    funds: parseFloat(decimal(user.funds).plus(withdraw.funds).toFixed(4)),
                    freezeFunds: parseFloat(decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4))
                });
            }else if (type === WithdrawType.Site) {
                let site = <Site>withdraw.site;
                await tem.update(Site, site.id, {
                    funds: parseFloat(decimal(site.funds).plus(withdraw.funds).toFixed(4)),
                    freezeFunds: parseFloat(decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4))
                })
            }
            withdraw = await tem.save(withdraw);
        });
        return withdraw;
    }

}