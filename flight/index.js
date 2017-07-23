
const Flight = {};
export default Flight;

// garbage Collector
import GC from './gc';
Flight.GC = GC;

// DataComponent
import DataComponent from './data-component';
Flight.DataComponent = DataComponent;

// UIComponent
import UIComponent from './ui-component';
Flight.UIComponent = UIComponent;

// eventPool
import { EventPool, DataEventPool, getOrCreateEventPool, detachEventPool } from './event-pool';
Flight.EventPool = EventPool;
Flight.DataEventPool = DataEventPool;
Flight.getOrCreateEventPool = getOrCreateEventPool;
Flight.detachEventPool = detachEventPool;

// events
import { Event, eventType, eventOfType, basicEvent } from './event';
Flight.Event = Event;
Flight.eventType = eventType;
Flight.eventOfType = eventOfType;
Flight.basicEvent = basicEvent;

// DOM
import DOM from './DOM';
Flight.DOM = DOM;

// Debugger
import Debugger from './debugger';
Flight.Debugger = Debugger;

// System events
class System extends DataComponent {};
const _system = new System();
Flight.System = {
    Ready: basicEvent().alias('System:Ready')
};

Flight.app = startupScript => {
    startupScript();
    _system.on('data/system').trigger(new Flight.System.Ready());
};
