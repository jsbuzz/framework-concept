import { EventPool, getOrCreateEventPool } from './event-pool';
import DOM from './DOM';
import GC from './gc';

let __componentId = 0;

class Component {

    constructor(...params) {
        this.componentId = ++__componentId;
        this.init.apply(this, params);
    }

    init() {}

    get view() {
        return this._view;
    }

    set view(element) {
        this._view = element;
        this.getOrCreateEventPool().element = element;
        if(element && !this._attached) {
            GC.registerComponent(this);
        }
    }

    listen() {}

    render() {
        this.listen();

        return this.view;
    }

    getOrCreateEventPool() {
        return this.eventPool || (this.eventPool = EventPool.forComponent(this));
    }

    on(path) {
        return path instanceof EventPool
            ? new EventPoolAccessor(this, path)
            : new EventPoolAccessor(this, getOrCreateEventPool(path))
            ;
    }

    ui(query) {
        let element = DOM.getElement(query, this.view);
        return element
            ? EventPool.forElement(element, this)
            : null
            ;
    }

    static attachTo(element) {
        element = DOM.getElement(element);

        const instance = new this(element);
        instance._attached = true;
        instance.view = element;
        instance.listen();

        return instance;
    }
}

class EventPoolAccessor {
    constructor(component, pool) {
        this.component = component;
        this.eventPool = pool;
    }

    listen(...listeners) {
        for(let i=0; i < listeners.length; i+=2) {
            let fn = this.eventPool.addEventListener(listeners[i], listeners[i+1]);
            GC.registerListener(this.component, this.eventPool.element, listeners[i].EventName, fn);
        }
    }

    trigger(event) {
        return this.eventPool.trigger(event);
    }
}


export default Component;
