import * as pako from "pako";
import { Message } from "element-ui";
import window from "@/window";
import { devConf } from "../../config";
export function host(path) {
    if (path === void 0) { path = ''; }
    var host = devConf.serveHost + ':' + devConf.servePort;
    return host + path;
}
export function shadowCloseSideMenu() {
    var sideMenu = document.querySelector('.el-aside');
    sideMenu.addEventListener('click', function (e) {
        if (e.target == sideMenu) {
            sideMenu.classList.remove('show-side-menu');
        }
    });
}
export function closeSideMenu() {
    document.querySelector('.el-aside').classList.remove('show-side-menu');
}
export function showSideMenu() {
    var sideMenu = document.querySelector('.el-aside');
    sideMenu.classList.add('show-side-menu');
}
export function zip(info) {
    return pako.deflate(JSON.stringify(info), { to: "string" });
}
export function unzip(info) {
    return JSON.parse(pako.inflate(info, { to: "string" }));
}
export function pageChangeMsg(msg) {
    Message({
        message: msg,
        type: 'error',
        duration: 10000,
        showClose: true
    });
}
export function addTypeToMenu(menus, type) {
    menus.unshift(type);
}
export function typeOrProductUpdate(menus, item) {
    for (var i = 0; i < menus.length; i++) {
        var typeMenu = menus[i];
        if (typeMenu.id === item.id) {
            typeMenu.name = item.name;
            typeMenu.onSale = item.onSale;
            return;
        }
        else if (typeMenu.children && typeMenu.children.length > 0) {
            typeOrProductUpdate(typeMenu.children, item);
        }
    }
}
export function addProductToMenu(menus, typeId, product) {
    for (var i = 0; i < menus.length; i++) {
        var item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            return;
        }
    }
}
export function findMenu(menus, path, isId) {
    for (var i = 0; i < menus.length; i++) {
        var item = menus[i];
        if ((!isId && item.path === path) || (isId && item.id === path)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            var menu = findMenu(item.children, path, isId);
            if (menu) {
                return menu;
            }
        }
    }
}
export function getProductUserPrice(product, userRoleType) {
    if (userRoleType === void 0) { userRoleType = 'role_gold'; }
    var price;
    switch (userRoleType) {
        case 'role_top':
            price = product.topPrice;
            break;
        case 'role_super':
            price = product.superPrice;
            break;
        default:
            price = product.goldPrice;
    }
    return price;
}
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function changeMenuWaitCount(menus, aim, cb) {
    for (var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        if (menu.fingerprint === aim) {
            return cb(menu, null);
        }
        if (menu.type !== 'menu') {
            var menuItems = menu.children;
            for (var i_1 = 0; i_1 < menuItems.length; i_1++) {
                var menuItem = menuItems[i_1];
                if (menuItem.fingerprint === aim) {
                    return cb(menuItem, menu);
                }
            }
        }
    }
}
export function todayNum() {
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth() + 1;
    var showMonth = month < 10 ? '0' + month : month;
    var day = dateNow.getDate();
    var showDay = day < 10 ? '0' + day : day;
    return parseInt("" + year + showMonth + showDay);
}
export function today() {
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth() + 1;
    var showMonth = month < 10 ? '0' + month : month;
    var day = dateNow.getDate();
    var showDay = day < 10 ? '0' + day : day;
    return year + "-" + showMonth + "-" + showDay;
}
export function myDateFromat(time) {
    if (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var showMonth = month < 10 ? '0' + month : month;
        var day = date.getDate();
        var showDay = day < 10 ? '0' + day : day;
        var hour = date.getHours();
        var showHour = hour < 10 ? '0' + hour : hour;
        var minute = date.getMinutes();
        var showMinute = minute < 10 ? '0' + minute : minute;
        var second = date.getSeconds();
        var showSecond = second < 10 ? '0' + second : second;
        return year + "-" + showMonth + "-" + showDay + " " + showHour + ":" + showMinute + ":" + showSecond;
    }
    else {
        return '';
    }
}
export function countOrderProgress(order) {
    if (order.status === '执行中' && !order.countProgress) {
        order.countProgress = true;
        var minute = (Date.now() - Date.parse(order.dealTime) - order.queueTime * 60 * 60 * 1000) / 1000 / 60;
        if (minute < 0) {
            order.status = '排队中';
        }
        else {
            var executeNum = Math.round(minute * order.speed);
            if (executeNum >= order.num) {
                order.executeNum = order.num;
                order.status = '待结算';
            }
            else {
                order.executeNum = executeNum;
            }
        }
    }
    return parseFloat((order.executeNum / order.num * 100).toFixed(2));
}
export var document = window.document;
//# sourceMappingURL=utils.js.map