import {OrderUser} from "./entity/OrderUser";
import rp = require('request-promise');
import {Platform} from "./entity/Platform";

/*
* 异步延迟
* @param (number) 延迟时间，单位毫秒
* */
function sleep(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/*
* 飞鸽业务接口
* */
const feiGeUrl = 'http://47.97.62.252/api/index.php';
const feiGeToken = '1846CTZNZP3RIWQICAZ5ZCBC62XOKMNN';
// 获取飞鸽toke( 测试成功 )
async function getFeiGeToken() {
    let result = await rp({
        uri: feiGeUrl,
        qs: {
            ac: 'login',
            u: 'hongtu',
            p: '123456'
        },
        json: true
    });
    return result.split('|')[1];
}
// 飞鸽微博初级点赞和高级点赞提单接口( 测试成功 )
async function weiBoLikeFeiGe(weiBoUrl:string, num:number) {
    let result = await rp({
        uri: feiGeUrl,
        qs: {
            ac: '1',
            url: weiBoUrl,
            num: num,
            token: feiGeToken,
        },
        json: true
    });
    if (JSON.stringify(result).includes('提交成功')) {
        let arr = JSON.stringify(result).split('|');
        return {
            code: 1000,
            msg: arr[0],
            taskid: arr[1]
        };
    }else{
        return {
            code: -400,
            msg: result.info
        }
    }
}




/*
* 新榜业务接口
* */
const xinBangUrl = 'http://www.xinbang.ink';
// 获取新榜toke( 测试成功 )
async function getXinBangToken() {
    let result = await rp({
        method: 'post',
        uri: xinBangUrl + '/public/agent-login',
        form: {
            username: 'hongtu44',
            password: '123456'
        }
    });
    console.log(result, ' 获取新榜toke ==========================');
    return JSON.parse(result).token;
}
// 新榜微信阅读提单接口( 测试成功 )
async function weiXinReadXinBang(url:string, num:number) {
    let result = await rp({
        method: 'post',
        uri: xinBangUrl + '/merchant-api/read',
        form: {
            article_link: url,
            read_numbers: num,
            order_type: 1, // 1普通模式; 5快速模式; 21夜单模式
            token: await getXinBangToken(),
        }
    });
    console.log(result, ' 新榜微信阅读提单接口 ===============');
    return JSON.parse(result);
}
// 新榜微信粉丝提单接口( 测试成功 )
async function weiXinFansXinBang(weixinId:string, num:number) {
    let result = await rp({
        method: 'post',
        uri: xinBangUrl + '/merchant-api/common-focus',
        form: {
            weixin_number: weixinId,
            fans_numbers: num,
            order_type: 2,
            token: await getXinBangToken(),
        }
    });
    console.log(result, ' 新榜微信粉丝提单接口 ===============');
    return JSON.parse(result);
}
// 新榜订单信息查询接口( 测试成功 )
async function weiXinInfoXinBang(orderId:string) {
    let timeout = 1000 * 60 * 30;
    let overtime = 0;
    let forTime = 1000 * 60;
    let count = 0;
    return await getOrderInfoXingBang(orderId);

    async function getOrderInfoXingBang(id:string):Promise<any> {
        try {
            count++;
            let result = JSON.parse(await rp({
                method: 'post',
                uri: xinBangUrl + '/merchant-api/query-order',
                form: {
                    order_sn: id,
                    token: await getXinBangToken()
                }
            }));
            /*
            *
               { code: 200,
                data:{ title: '魔都300年以上的古树有多少棵？',
                       start_number: 2,
                       end_read_number: 2,
                       total_number: '500',
                       status: 1 } } ' 新榜订单信息查询接口 =================='
            * */
            if (result.code === 200) {
                return {
                    code: 1000,
                    msg: '查询成功！',
                    startNum: result.data.start_number,
                }
            }else{
                throw new Error(`新榜微信阅读订单查询失败(${result.msg}),当前查询次数${count},查询时间${overtime/(1000 * 60)}分钟!`);
            }
        }catch (e) {
            if (overtime < timeout) {
                await sleep(forTime);
                overtime += forTime;
                return await getOrderInfoXingBang(id);
            }else{
                return {
                    code: -400,
                    msg: e.message
                }
            }
        }
    }
}





/*
× 顶点业务接口
* 顶点公有参数说明：
* 1. 响应返回字段说明：
*   code： 1000成功,1001重复下单,-900 token错误！,901 token失效！,-800 type参数错误！,-700订单添加错误（比较多样）,-600 用户信息错误（比较多样）,-500 检查错误,-501 评论检查错误,-502 刷赞检查错误
*   msg: 提示信息
*   data： 返回信息
*
* 2. 公有参数说明：
*   token： 顶点网站首页的对接token
*   type： ('sf', 'sz', 'zfpl', 'ht','sp','tp','pl','yd','dy','dysz')，分别代表:
*           刷粉，刷赞，转发评论，话题，视频，投票，人工内容，首页阅读，抖音关注，抖音视频点赞
*
* 3. 状态说明：
*   status： 0 审核中,1 队列中,2 执行中,3 有异常,5 已暂停,7 今天已完成,8 退款中,9 已完毕,10 已退款
* */
const tokenDingDian = '379e8b428727279ed3a3e89955c09c2a';
const urlDingDian = 'http://wb.dd107.com:81/taskapi';
// 顶点获取基础信息接口模板( 测试成功 )
async function weiBoInfoDingDian(taskUri:string, taskType:string, weiBoUrl:string) {
    return await getDingDian(taskUri, taskType, weiBoUrl);

    async function getDingDian(taskUri:string, taskType:string, weiBoUrl:string):Promise<any> {
        try {
            let result = JSON.parse(await rp({
                method: 'post',
                uri: urlDingDian + taskUri,
                form: {
                    token: tokenDingDian,
                    type: taskType,
                    url: weiBoUrl,
                }
            }));
            console.log(result, ' weiBoInfoDingDian 11111111111111111111111111111');
            return result;
        }catch (e) {
            return await getDingDian(taskUri, taskType, weiBoUrl);
        }
    }
}
// 顶点获取微博文章规则地址和点赞数( 测试成功 )
async function weiBoLikeCommentForwardNumDingDian(weiBoUrl:string) {
    return await weiBoInfoDingDian('/getwbinfo.do', 'sz', weiBoUrl);
}
// 顶点获取微博当前点赞数和转换后的url( 测试成功 )
async function weiBoLikeNumDingDian(weiBoUrl:string) {
    let result = await weiBoLikeCommentForwardNumDingDian(weiBoUrl);
    if (result.code === 1000) {
        return {
            code: result.code,
            msg: result.msg,
            weiBoHttp: result.data.url,
            weiBoHttps: result.data.url.replace('http://', 'https://'),
            likeNum: result.data.zan_num,
        };
    }else{
        return result;
    }

}
// 顶点获取微博当前评论数和转换后的url( 测试成功 )
async function weiBoCommentNumDingDian(weiBoUrl:string) {
    let result = await weiBoLikeCommentForwardNumDingDian(weiBoUrl);
    if (result.code === 1000) {
        return {
            code: result.code,
            msg: result.msg,
            weiBoHttp: result.data.url,
            weiBoHttps: result.data.url.replace('http://', 'https://'),
            commentNum: result.data.pl_num,
        };
    }else{
        return result;
    }
}
// 顶点获取微博当前转发数和转换后的url( 测试成功 )
async function weiBoForwardNumDingDian(weiBoUrl:string) {
    let result = await weiBoLikeCommentForwardNumDingDian(weiBoUrl);
    if (result.code === 1000) {
        return {
            code: result.code,
            msg: result.msg,
            weiBoHttp: result.data.url,
            weiBoHttps: result.data.url.replace('http://', 'https://'),
            forwardNum: result.data.start_num,
        };
    }else{
        return result;
    }
}
// 顶点获取微博博主信息( 测试成功 )
// 顶点获取微博博主当前微博名、博主uid、粉丝数、关注数、微博数、微博等级、微博会员等级、是否大V、微博账号类别(0普通；1企业; 2媒体)
async function weiBoUserInfoDingDian(weiBoUserUrl:string) {
    if(weiBoUserUrl.match(/m.weibo.cn/g)) {
        weiBoUserUrl = weiBoUserUrl.replace('m.weibo.cn', "weibo.com");
    }
    if(weiBoUserUrl.match(/weibo.cn/g)) {
        weiBoUserUrl = weiBoUserUrl.replace('weibo.cn', "weibo.com");
    }
    if(weiBoUserUrl.match(/\?/g)) {
        weiBoUserUrl = weiBoUserUrl.replace(/\?(.*)/g, "");
    }

    let result = await weiBoInfoDingDian('/getwbuserinfo.do', 'sf', weiBoUserUrl);
    if (result.code === 1000) {
        let userUrl = Object.keys(result.data)[0];
        let info = result.data[userUrl];
        return {
            code: result.code,
            msg: result.msg,
            url: userUrl,
            name: info.name,
            uid: info.uid,
            fansNum: info.followers_count,
            focusNum: info.friends_count,
            articleNum: info.statuses_count,
            grade: info.urank,
            memberGrade: info.mbrank,  // 0不是会员
            isV: info.isv,  // 1是; 0不是
            accountType: info.is_a,
        }
    }else{
        return result;
    }
}
// 顶点获取微博投票信息( 测试成功 )
async function weiBoVoteInfoDingDian(weiBoVoteUrl:string) {
    return await weiBoInfoDingDian('/getwbvoteinfo.do', 'tp', weiBoVoteUrl);
}
// 顶点获取微博话题信息( 测试成功 )
async function weiBoTopicInfoDingDian(weiBoTopicUrl:string) {
    return await weiBoInfoDingDian('/getwbtopic.do', 'ht', weiBoTopicUrl);
}

const taskUrlDingDian = 'http://wb.dd107.com:81/taskapi.do';
// 顶点微博粉丝提单接口( 测试成功 )
async function weiBoFansDingDian(proid:number, isbf:number, weiBoUserUrl:string, num:number) {
    let result = await rp({
        method: 'post',
        uri: taskUrlDingDian,
        headers: {
            'content-type': 'application/json'
        },
        form: {
            token: tokenDingDian,
            type: 'sf',
            addtype: 'add',
            proid: proid,
            info: JSON.stringify({
                wbid: weiBoUserUrl,
                allnum: num,
                isbf: isbf  // 1掉粉包补 2掉粉自担
            })
        }
    });
    console.log(JSON.parse(result), ' ======================');
    return JSON.parse(result);
}
// 顶点微博初级粉提单接口( 测试成功 )
async function weiBoFansChuJiDingDian(weiBoUserUrl:string, num:number) {
    return await weiBoFansDingDian(1, 2, weiBoUserUrl, num);
}
// 顶点微博高级粉提单接口( 测试成功 )
async function weiBoFansGaoJiDingDian(weiBoUserUrl:string, num:number) {
    return await weiBoFansDingDian(19, 1, weiBoUserUrl, num);
}
// 顶点微博顶级粉(对应自身业务的顶级粉和超级粉)提单接口( 测试成功 )
async function weiBoFansDingJiDingDian(weiBoUserUrl:string, num:number) {
    return await weiBoFansDingDian(7, 1, weiBoUserUrl, num);
}
// 顶点微博超级粉提单接口( 测试成功 )
async function weiBoFansChaoJiDingDian(weiBoUserUrl:string, num:number) {
    return await weiBoFansDingDian(6, 1, weiBoUserUrl, num);
}
// 顶点微博达人20%粉提单接口( 测试成功 )
async function weiBoFansDaRenDingDian(weiBoUserUrl:string, num:number) {
    return await weiBoFansDingDian(20, 1, weiBoUserUrl, num);
}

// 顶点微博转发评论、刷量转发提单基础接口( 测试成功 )
async function weiBoForwardDingDian(proid:number, weiBoUrl:string, num:number) {
    let result = await rp({
        method: 'post',
        uri: taskUrlDingDian,
        form: {
            token: tokenDingDian,
            type: 'zfpl',
            addtype: 'add',
            proid: proid,
            info: JSON.stringify({
                wburl: weiBoUrl,
                allnum: num,
                plzftype: '0,0',
                iscomment: 0,
            }),
            infopl: JSON.stringify({
                countnumber: 0,
                words_max: 0,
                otherdata: ''
            })
        }
    });
    console.log(JSON.parse(result), ' ======================');
    return JSON.parse(result);
}
// 顶点微博转发评论提单接口( 测试成功 )
async function weiBoForwardBoWenDingDian(weiBoUrl:string, num:number) {
    return await weiBoForwardDingDian(39, weiBoUrl, num);
}
// 顶点微博刷量转发提单接口( 测试成功 )
async function weiBoForwardShuaLiangDingDian(weiBoUrl:string, num:number) {
    return await weiBoForwardDingDian(3, weiBoUrl, num);
}

// module.exports = {
//     weiBoLikeFeiGe: weiBoLikeFeiGe,
//     weiXinReadXinBang: weiXinReadXinBang,
//     weiXinInfoXinBang: weiXinInfoXinBang,
//     weiXinFansXinBang: weiXinFansXinBang,
//     weiBoLikeNumDingDian: weiBoLikeNumDingDian,
//     weiBoCommentNumDingDian: weiBoCommentNumDingDian,
//     weiBoForwardNumDingDian: weiBoForwardNumDingDian,
//     weiBoUserInfoDingDian: weiBoUserInfoDingDian,
//     weiBoFansChuJiDingDian: weiBoFansChuJiDingDian,
//     weiBoFansGaoJiDingDian: weiBoFansGaoJiDingDian,
//     weiBoFansDingJiDingDian: weiBoFansDingJiDingDian,
//     weiBoFansChaoJiDingDian: weiBoFansChaoJiDingDian,
//     weiBoFansDaRenDingDian: weiBoFansDaRenDingDian,
//     weiBoForwardBoWenDingDian: weiBoForwardBoWenDingDian,
//     weiBoForwardShuaLiangDingDian: weiBoForwardShuaLiangDingDian,
// };

export async function autoPutOrderToOther(order:OrderUser) {
    let platform = <Platform>await Platform.find();
    let orderName = order.name;
    let submitResult = {
        isOk: false,
        msg: '',
        startNum: 0
    };
    if (orderName.includes('微信公众号业务')) {
        if (platform.weiXinReadXinBang && orderName.includes('微信文章阅读')) {
            let result = await weiXinReadXinBang(order.fields.addressLianjie.value, order.num);
            /*
            * {"code":200,"msg":"下单成功！","order_sn":"201904191231346062366328"}  新榜微信粉丝提单接口 ===============
            * */
            if (result.code === 200) {
                let info = await weiXinInfoXinBang(result.order_sn);
                if (info.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到新榜微信普通阅读,订单号: ' + result.order_sn;
                    submitResult.startNum = info.startNum;
                }else{
                    submitResult.msg = info.msg;
                }
            }
        } else if (platform.weiXinFansXinBang && orderName.includes('公众号粉丝')) {
            let result = await weiXinFansXinBang(order.fields.acountWeixin.value, order.num);
            if (result.code === 200) {
                submitResult.isOk = true;
                submitResult.msg = '提交到新榜公众号普通关注,订单号: ' + result.order_sn;
            }else{
                submitResult.msg = result.msg;
            }
        }
    } else if (orderName.includes('微博业务')) {
        if (platform.weiBoFansPrimaryDingDian && orderName.includes('初级粉丝')) {
            let info = await weiBoUserInfoDingDian(order.fields.addressLianjie.value);
            console.log(info, ' info 0000000000000000000000000000000000000')
            if (info.code === 1000) {
                let result = await weiBoFansChuJiDingDian(info.url, order.num);
                if (result.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到顶点微博初级粉丝,订单号: ' + result.data.taskid;
                    submitResult.startNum = info.fansNum;
                }else{
                    submitResult.msg = result.msg;
                }
            }else{
                submitResult.msg = info.msg;
            }
        } else if (platform.weiBoFansSuperDingDian && orderName.includes('高级粉丝')) {
            let info = await weiBoUserInfoDingDian(order.fields.addressLianjie.value);
            if (info.code === 1000) {
                let result = await weiBoFansGaoJiDingDian(info.url, order.num);
                if (result.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到顶点微博高级粉丝,订单号: ' + result.data.taskid;
                    submitResult.startNum = info.fansNum;
                }else{
                    submitResult.msg = result.msg;
                }
            }else{
                submitResult.msg = info.msg;
            }
        } else if (platform.weiBoFansTopDingDian && (orderName.includes('顶级粉丝') || orderName.includes('超级粉丝'))) {
            let info = await weiBoUserInfoDingDian(order.fields.addressLianjie.value);
            if (info.code === 1000) {
                let result = await weiBoFansDingJiDingDian(info.url, order.num);
                if (result.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到顶点微博顶级粉丝,订单号: ' + result.data.taskid;
                    submitResult.startNum = info.fansNum;
                }else{
                    submitResult.msg = result.msg;
                }
            }else{
                submitResult.msg = info.msg;
            }
        } else if (platform.weiBoFansDaRenDingDian && orderName.includes('达人粉丝')) {
            let info = await weiBoUserInfoDingDian(order.fields.addressLianjie.value);
            if (info.code === 1000) {
                let result = await weiBoFansDaRenDingDian(info.url, order.num);
                if (result.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到顶点微博达人粉丝20%,订单号: ' + result.data.taskid;
                    submitResult.startNum = info.fansNum;
                }else{
                    submitResult.msg = result.msg;
                }
            }else{
                submitResult.msg = info.msg;
            }
        } else if (platform.weiBoForwardDingDian && orderName.includes('微博转评')) {
            let result = await weiBoForwardBoWenDingDian(order.fields.addressLianjie.value, order.num);
            if (result.code === 1000) {
                submitResult.isOk = true;
                submitResult.msg = '提交到顶点微博转评,订单号: ' + result.data.taskid;
                submitResult.startNum = result.data.position_start;
            }else{
                submitResult.msg = result.msg;
            }
        } else if (platform.weiBoShuaLiangForwardDingDian && orderName.includes('刷量转发')) {
            let result = await weiBoForwardShuaLiangDingDian(order.fields.addressLianjie.value, order.num);
            if (result.code === 1000) {
                submitResult.isOk = true;
                submitResult.msg = '提交到顶点微博刷量转发,订单号: ' + result.data.taskid;
                submitResult.startNum = result.data.position_start;
            }else{
                submitResult.msg = result.msg;
            }
        } else if (platform.weiBoLikeFeiGe && (orderName.includes('高级赞') || orderName.includes('初级赞'))) {
            let info = await weiBoLikeNumDingDian(order.fields.addressLianjie.value);
            if (info.code === 1000) {
                let result = await weiBoLikeFeiGe(info.weiBoHttps, order.num);
                if (result.code === 1000) {
                    submitResult.isOk = true;
                    submitResult.msg = '提交到飞鸽微博点赞,订单号: ' + result.taskid;
                    submitResult.startNum = info.likeNum;
                }else{
                    submitResult.msg = result.msg;
                }
            }else{
                submitResult.msg = info.msg;
            }
        }
    }
    return submitResult;
};

// (async function () {
//     // let token = await getFeiGeToken();
//     // console.log(token, ' 飞鸽token  1111111111111111111111111')
//
//     // let token = await getXinBangToken();
//     // console.log(token, ' 新榜token 111111111111111111111111111111111')
//
//     // let result = await weiBoLikeFeiGe('', '');
//
//     // let result = await weiBoLikeCommentForwardNumDingDian('https://m.weibo.cn/2145630261/4361972767571961');
//
//     // let result = await weiBoUserInfoDingDian('https://weibo.com/p/1006067073265194/home?from=page_100606&mod=TAB&is_all=1#place')
//     // console.log(result, ' result  1111111111111111111111111111111')
//
//     // let result = await weiBoVoteInfoDingDian('http://toupiao.irenaworld.com/order');
//
//     // let result = await weiBoTopicInfoDingDian('https://weibo.com/p/10080835b9944b2e77df87ae359571132c3c73');
//
//     // let likeNum = await weiBoCommentNumDingDian('https://m.weibo.cn/2897958077/4361031909836444');
//     // console.log(likeNum, ' likeNum ===============')
//
//
//     // // 飞鸽微博初级赞高级赞提单接口测试
//     // let urlNum = await weiBoLikeNumDingDian('https://weibo.com/5791404733/Hpk7t6yAA?from=page_1005055791404733_profile&wvr=6&mod=weibotime&type=comment#_rnd1555074608854');
//     // console.log(urlNum, ' urlNum 111111111111111111111111111');
//     // let result = await weiBoLikeFeiGe(urlNum.weiBoHttps, 100);
//     // console.log(result, ' result 22222222222222222222222222222');
//
//
//     // 新榜微信订单查询接口测试
//     // let result = await weiXinInfoXinBang('201904191348094822104127');
//     // console.log(result, ' 222222222222222222222');
//
//
//     // 微博粉丝提单接口--顶点
//     // let info = await weiBoUserInfoDingDian('https://weibo.com/2807043802/profile?topnav=1&wvr=6&is_all=1');
//     // let result = await weiBoFansChuJiDingDian(info.url, 500);
//     // let result = await weiBoFansGaoJiDingDian(info.url, 100);
//     // let result = await weiBoFansDingJiDingDian(info.url, 300);
//     // let result = await weiBoFansDaRenDingDian(info.url, 100);
//
//     // 微博顶点刷量转发
//     // let result = await weiBoForwardBoWenDingDian('https://m.weibo.cn/3989030329/4362680351434570', 100);
//     // let result = await weiBoForwardShuaLiangDingDian('https://m.weibo.cn/2125278592/4362372221374125', 100);
//
//
//     // let info = {
//     //     token: '379e8b428727279ed3a3e89955c09c2a',
//     //     type: 'sf',
//     //     url: 'https://weibo.com/5660687572/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1',
//     // };
//     //
//     // let result = await rp({
//     //     method: 'post',
//     //     uri: urlDingDian + '/getwbuserinfo.do' + formatArgs(info),
//     //     json: true
//     // });
//     // console.log(result, ' ======================');
//
//
//     // let result = await weiXinReadXinBang('https://mp.weixin.qq.com/s/vWrL_uHBhNZKmpfSoxKJNw', 500);
//     // console.log(result, ' 1111111111111111111111')
//
//     // let result = await weiXinFansXinBang('Dongfeng_Citroen', 1500);
//
// })();


