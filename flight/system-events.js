import basicEvent from './event';

const triggerSystemEvent = (EventType) => getOrCreateEventPool('data/system').trigger(new EventType());
export triggerSystemEvent;

const Ready = basicEvent().alias('System:Ready');

export Ready;
