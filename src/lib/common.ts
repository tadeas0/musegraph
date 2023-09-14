export function randInt(min: number, max: number) {
    const mn = Math.ceil(min);
    const mx = Math.floor(max);
    return Math.floor(Math.random() * (mx - mn) + mn);
}

export function randomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(randInt(0, charactersLength));
        counter += 1;
    }
    return result;
}
