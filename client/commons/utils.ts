import * as pako from "pako";
import {Message} from "element-ui";
import window from "@/window";
import {devConf} from "../../config";

export function host(path = '') {
    if (process.env.NODE_ENV !== 'production') {
        const host = devConf.serveHost + ':' + devConf.servePort;
        return host + path;
    }
    return path;
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
            typeMenu.sortNum = item.sortNum;
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

export function sortProductType(a: any, b: any) {
    let numSort = a.sortNum - b.sortNum;
    if (numSort == 0) {
        return Date.parse(a.createTime) - Date.parse(b.createTime);
    }else{
        return numSort;
    }
}

export function sortProduct(a: any, b: any) {
    if (a.productType.name === b.productType.name) {
        let numSort = a.sortNum - b.sortNum;
        if (numSort == 0) {
            return Date.parse(a.createTime) - Date.parse(b.createTime);
        }else{
            return numSort;
        }
    }else{
        let numSort = a.productType.sortNum - b.productType.sortNum;
        if (numSort == 0) {
            return Date.parse(a.productType.createTime) - Date.parse(b.productType.createTime);
        }else{
            return numSort;
        }
    }
}

export function sortProductMenus(menus: Array<any>) {
    menus.forEach((item: any) => {
        item.children.sort(sortProductOfMenu);
    });
    menus.sort(sortProductOfMenu);
}

export function sortMenus(menus: Array<any>) {
    let productTypes:any = [];
    let menuItems: any = [];
    menus.forEach((item: any) => {
        if (item.type === 'productType') {
            item.children.sort(sortProductOfMenu);
            productTypes.push(item);
        }else{
            menuItems.push(item);
        }
    });

    productTypes.sort(sortProductOfMenu);
    return productTypes.concat(menuItems);
}

function sortProductOfMenu(a: any, b: any) {
    let numSort = a.sortNum - b.sortNum;
    if (numSort == 0) {
        return Date.parse(a.createTime) - Date.parse(b.createTime);
    }else{
        return numSort;
    }
}

export const document = window.document;


