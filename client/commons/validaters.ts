
export function isNum(value:any){
    return !isNaN(value);
}

export function isInteger(num: any) {
    return /^[0-9]+$/.test(num);
}

export function isUrl(val: string) {
    return /^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(val)
}