import window from "@/window";
import {unzip, zip} from "@/utils";

export enum StorageKey{
    platform = 'platform-info',
    site = 'site-info',
    user = 'user-info'
}

export const Storage = {
    length() {
        return window.sessionStorage.length;
    },
    key(index: number) {
        return window.sessionStorage.key(index);
    },
    getItem(key: string) {
        let info = window.sessionStorage.getItem(key)
        return info ? unzip(info): info;
    },
    setItem(key: string, value: any) {
        window.sessionStorage.setItem(key, zip(value));
    },
    removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    }
};