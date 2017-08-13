import clone from './clone';

let eventId = 0;

export class Event{
    constructor() {
        this.name = this.constructor.EventName;
    }

    event() {
        return new CustomEvent(this.name, {
            detail     : this,
            bubbles    : !this.constructor._cancelBubble,
            cancelable : true
        });
    }

    stopPropagation() {
        this.originalEvent && this.originalEvent.stopPropagation();
    }

    preventDefault() {
        this.originalEvent && this.originalEvent.preventDefault();
    }

    static bubbles(bubbles) {
        this._cancelBubble = !bubbles;
        return this;
    }

    static alias(name) {
        this.EventName = name;
        return this;
    }
}

class EventAttributeError extends Error {
    constructor(event, name, value, paramType) {
        super(`Type mismatch for Event '${event.name}' for attribute '${name}'`);
        this.event = event;
        this.name = name;
        this.value = value;
        this.paramType = paramType;
    }
}
export function defineEventType(descriptor) {
    const propNames = Object.getOwnPropertyNames(descriptor);
    const EventClass = class extends Event {
        constructor(...params) {
            super();
            for(let i = 0; i < params.length; i++) {
                const paramType = descriptor[propNames[i]];
                if(
                    typeof paramType == 'string' && paramType != 'any' && typeof params[i] != paramType ||
                    paramType instanceof Object && !(params[i] instanceof paramType)
                ) {
                    throw new EventAttributeError(this, propNames[i], params[i], paramType);
                }
                (this)[propNames[i]] = clone(params[i]);
            }
        }
    };
    return EventClass;
};

export function eventOfType(EventType) {
    return (
        class extends EventType {}
    ).alias(`Event${++eventId}`);
};

export function basicEvent() {
    return (
        class extends Event {}
    ).alias(`Event${++eventId}`);
};

export function defineEvent(EventType, alias) {
    return eventOfType(EventType).alias(alias);
};
