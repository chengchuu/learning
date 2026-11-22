// 散列类 - 线性探测法
function HashTable () {
    this.table = new Array(137);
    this.values = [];
    this.simpleHash = simpleHash;
    this.betterHash = betterHash;
    this.showDistro = showDistro;
    this.put = put;
    this.get = get;
}
function put (key, data) {
    let pos = this.betterHash(key);
    // this.table[pos] = data;
    if (this.table[pos] === undefined) {
        this.table[pos] = key;
        this.values[pos] = data;
    } else {
        while (this.table[pos] !== undefined) {
            ++pos;
        }
        this.table[pos] = key;
        this.values[pos] = data;
    }
}
function get (key) {
    // return this.table[this.betterHash(key)];
    let hash = -1;
    hash = this.betterHash(key);
    if (hash > -1) {
        for (let i = hash; this.table[hash] !== undefined; ++i) {
            if (this.table[hash] === key) {
                return this.values[hash];
            }
        }
    }
    return undefined;
}
function simpleHash (data) {
    let total = 0;
    for (let i = 0; i < data.length; ++i) {
        total += data.charCodeAt(i);
    }
    return total % this.table.length;
}
function showDistro () {
    let n = 0;
    for (let i = 0; i < this.table.length; ++i) {
        if (this.table[i] !== undefined) {
            console.log(`${i}: ${this.table[i]}`);
        }
    }
}
function betterHash (string) {
    const H = 7;
    let total = 0;
    for (let i = 0; i < string.length; ++i) {
        total += H * total + string.charCodeAt(i);
    }
    total = total % this.table.length;
    if (total < 0) {
        total += this.table.length -1;
    }
    return parseInt(total, 10);
}