import {getOrCreateEventPool} from './event-pool';

class Repository {
    on(path) {
        return getOrCreateEventPool(path);
    }

    static attachTo(eventPoolPath) {
        const instance = new this();

        instance.eventPool = getOrCreateEventPool(eventPoolPath);
        instance.listen();

        return instance;
    }
}

export default Repository;
