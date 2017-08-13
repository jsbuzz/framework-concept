
export default function clone(obj) {
    if(!(obj instanceof Object)) {
        return obj;
    }
    if(obj instanceof Array) {
        return obj.map( item => clone(item) );
    }
    if(obj instanceof Number || obj instanceof String) {
        return new obj.constructor(obj);
    }

    const copied = {};

    for(let key of Object.getOwnPropertyNames(obj)) {
        if(typeof obj[key] != 'function') {
            copied[key] = clone(obj[key]);
        }
    }

    return copied;
}
