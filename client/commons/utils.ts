import * as pako from "pako";
import {Message} from "element-ui";
import window from "@/window";
import {devConf} from "../../config";

export function host(path = '') {
    const host = devConf.serveHost + ':' + devConf.servePort;
    return host + path;
}

export function shadowCloseSideMenu() {
    let sideMenu = document.querySelector('.el-aside');
    sideMenu.addEventListener('click', (e:any) =>{
        if (e.target == sideMenu) {
            sideMenu.classList.remove('show-side-menu');
        }
    })
}

export function closeSideMenu() {
    document.querySelector('.el-aside').classList.remove('show-side-menu');
}

export function showSideMenu() {
    let sideMenu = document.querySelector('.el-aside');
    sideMenu.classList.add('show-side-menu');
}

export function zip(info: any) {
    return pako.deflate(JSON.stringify(info), {to: "string"})
}

export function unzip(info: string) {
    return JSON.parse(pako.inflate(info, {to: "string"}))
}

export function pageChangeMsg(msg: string) {
    Message({
        message: msg,
        type: 'error',
        duration: 10000,
        showClose: true
    });
}

export function addTypeToMenu(menus: Array<any>, type: any) {
    menus.unshift(type);
}

export function typeOrProductUpdate(menus: Array<any>, item: any) {
    for(let i = 0; i < menus.length; i++){
        let typeMenu = menus[i];
        if(typeMenu.id === item.id){
            typeMenu.name = item.name;
            typeMenu.onSale = item.onSale;
            return ;
        }else if (typeMenu.children && typeMenu.children.length > 0) {
            typeOrProductUpdate(typeMenu.children, item);
        }
    }
}

export function addProductToMenu(menus: Array<any>, typeId: string, product: any) {
    for(let i = 0; i < menus.length; i++){
        let item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            return;
        }
    }
}

export function findMenu(menus:Array<any>, path: string, isId: boolean):any {
    for (let i = 0; i < menus.length; i++){
        let item = menus[i];
        if ((!isId && item.path === path) || (isId && item.id === path)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            let menu = findMenu(item.children, path, isId);
            if (menu) {
                return menu;
            }
        }
    }
}

export function getProductUserPrice(product: any, userRoleType = 'role_gold') {
    let price;
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

export function deepClone(obj:any) {
    return JSON.parse(JSON.stringify(obj));
}

export function changeMenuWaitCount(menus: Array<any>, aim: string, cb:(itemA:any, itemB:any) => any) {
    for(let i = 0; i < menus.length; i++){
        let menu = menus[i];
        if (menu.fingerprint === aim) {
            return cb(menu, null);
        }
        if (menu.type !== 'menu') {
            let menuItems = menu.children;
            for(let i = 0; i < menuItems.length; i++){
                let menuItem = menuItems[i];
                if (menuItem.fingerprint === aim) {
                    return cb(menuItem, menu);
                }
            }
        }
    }
}

export function todayNum() {
    let dateNow = new Date();
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    let showMonth = month < 10 ? '0' + month : month;
    let day = dateNow.getDate();
    let showDay = day < 10 ? '0' + day : day;
    return parseInt(`${year}${showMonth}${showDay}`);
}

export function today() {
    let dateNow = new Date();
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    let showMonth = month < 10 ? '0' + month : month;
    let day = dateNow.getDate();
    let showDay = day < 10 ? '0' + day : day;
    return `${year}-${showMonth}-${showDay}`;
}

export function myDateFromat(time:string) {
    if (time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let showMonth = month < 10 ? '0' + month : month;
        let day = date.getDate();
        let showDay = day < 10 ? '0' + day : day;
        let hour = date.getHours();
        let showHour = hour < 10 ? '0' + hour : hour;
        let minute = date.getMinutes();
        let showMinute = minute < 10 ? '0' + minute : minute;
        let second = date.getSeconds();
        let showSecond = second < 10 ? '0' + second : second;
        return `${year}-${showMonth}-${showDay} ${showHour}:${showMinute}:${showSecond}`;
    }else {
        return '';
    }
}

export function countOrderProgress(order:any) {
    if (order.status === '执行中' && !order.countProgress) {
        order.countProgress = true;
        let minute = (Date.now() - Date.parse(order.dealTime) - order.queueTime * 60 * 60 * 1000) / 1000 / 60 - 3;
        if (minute < 0) {
            order.status = '排队中';
        }else {
            let executeNum = Math.round(minute * order.speed);
            if (executeNum >= order.num) {
                order.executeNum = order.num;
                order.status = '待结算';
            }else{
                order.executeNum = executeNum;
            }
        }
    }
    return parseFloat((order.executeNum / order.num * 100).toFixed(2));
}

export const document = window.document;


