
export function isNum(value:any){
    return !isNaN(value);
}

export function isInteger(num: any) {
    return /^[0-9]+$/.test(num);
}