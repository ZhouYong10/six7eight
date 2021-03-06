export function isNum(value) {
    return !isNaN(value);
}
export function isInteger(num) {
    return /^[0-9]+$/.test(num);
}
export function isUrl(val) {
    return /^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(val);
}
export function hasBackslash(val) {
    return val.search('/') != -1;
}
//# sourceMappingURL=validaters.js.map