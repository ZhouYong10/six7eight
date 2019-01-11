import window from "@/window";
import { unzip, zip } from "@/utils";
export var StorageKey;
(function (StorageKey) {
    StorageKey["platform"] = "platform-info";
    StorageKey["site"] = "site-info";
    StorageKey["user"] = "user-info";
})(StorageKey || (StorageKey = {}));
export var Storage = {
    length: function () {
        return window.sessionStorage.length;
    },
    key: function (index) {
        return window.sessionStorage.key(index);
    },
    getItem: function (key) {
        var info = window.sessionStorage.getItem(key);
        return info ? unzip(info) : info;
    },
    setItem: function (key, value) {
        window.sessionStorage.setItem(key, zip(value));
    },
    removeItem: function (key) {
        window.sessionStorage.removeItem(key);
    },
    clear: function () {
        window.sessionStorage.clear();
    }
};
//# sourceMappingURL=slfstorage.js.map