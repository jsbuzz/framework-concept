
const Flight = {};
export default Flight;

// garbage Collector
import GC from './gc';
Flight.GC = GC;

// Component
import Component from './component';
Flight.Component = Component;

// eventPools
import { EventPool, DataEventPool, getOrCreateEventPool, detachEventPool } from './event-pool';
Flight.EventPool = EventPool;
Flight.DataEventPool = DataEventPool;
Flight.getOrCreateEventPool = getOrCreateEventPool;
Flight.detachEventPool = detachEventPool;

// events
import { Event, eventType, eventOfType, basicEventOf } from './event';
Flight.Event = Event;
Flight.eventType = eventType;
Flight.eventOfType = eventOfType;
Flight.basicEventOf = basicEventOf;

// DOM
import DOM from './DOM';
Flight.DOM = DOM;

// Patch
import Patch from './patch';
Flight.Patch = Patch;
