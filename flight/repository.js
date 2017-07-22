import {EventPool, getOrCreateEventPool} from './event-pool';

class Repository {
    constructor(...params) {
        this.init.apply(this, params);
    }

    init() {}

    on(path) {
        return path instanceof EventPool
            ? path
            : getOrCreateEventPool(path)
            ;
    }

    static attachTo(eventPoolPath) {
        const instance = new this();

        instance.eventPool = getOrCreateEventPool(eventPoolPath);
        instance.listen();

        return instance;
    }
}

export default Repository;
