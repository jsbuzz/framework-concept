import Flight from './';

class Repository {
    on(path) {
        return Flight.getOrCreateEventPool(path);
    }

    static attachTo(eventPoolPath) {
        const instance = new this();

        instance.eventPool = Flight.getOrCreateEventPool(eventPoolPath);
        instance.listen();

        return instance;
    }
}

export default Repository;
