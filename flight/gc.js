
const GC = {
    components: new Map(),
    listeners : new Map(),
    elementAttribute: 'flight-component-id'
};

GC.init = function() {
    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.removedNodes) {
                mutation.removedNodes.forEach((node) => {
                    this.removeNode(node);
                });
            }
        });
    });

    observer.observe(document.body, {childList: true, subtree: true});
    this.init = false;
};

GC.removeNode = function(element) {
    if(!element.querySelectorAll) return ;

    const removedViews = element.querySelectorAll(`[${this.elementAttribute}]`);

    removedViews.forEach((view) => {
        let componentId = view.attributes[this.elementAttribute].value;
        let component = this.components.get(parseInt(componentId));

        component && this.destroy(component);
    });
};

GC.registerComponent = function(component) {
    this.components.set(component.componentId, component);
    this.listeners.set(parseInt(component.componentId), []);

    component.view.setAttribute(this.elementAttribute, component.componentId);
    GC.init && GC.init();
};

GC.registerListener = function(component, element, event, callback) {
    if(!this.listeners.has(component.componentId)) return;

    this.listeners.get(component.componentId).push({
        element   : element,
        eventName : extractEventName(event),
        callback  : callback
    });
};

GC.destroy = function(component) {
    for(let listener of this.listeners.get(component.componentId)) {
        listener.element.removeEventListener(listener.eventName, listener.callback);
    }
    component.view = null;
    this.components.delete(component.componentId);
    this.listeners.delete(component.componentId);
};

export default GC;

function extractEventName(event) {
    return (typeof event == 'string')
        ? event
        : event.EventName;
}
