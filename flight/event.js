
/*******************************************************************************
 * Event | eventType | eventOfType | basicEventOf
 **/

let __eventId = 0;

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

export function eventType(constr) {
    const EventClass = class extends Event {
        constructor(...params) {
            super();
            constr.apply(this, params);
        }
    };
    return EventClass;
};

export function eventOfType(EventType) {
    return (
        class extends EventType {}
    ).alias(`Event${++__eventId}`);
};

export function basicEvent() {
    return (
        class extends Event {}
    ).alias(`Event${++__eventId}`);
};
