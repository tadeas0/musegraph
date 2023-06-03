export function randInt(min: number, max: number) {
    const mn = Math.ceil(min);
    const mx = Math.floor(max);
    return Math.floor(Math.random() * (mx - mn) + mn);
}
