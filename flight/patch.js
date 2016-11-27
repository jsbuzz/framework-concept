
const PatchIt = {};

PatchIt.template = function(html, patch) {
    return new PatchTemplate(html, patch);
};

class PatchTemplate {
    constructor(html, patch) {
        this.html = this.processTemplate(html);
        this.patch = patch;
    }

    render(state) {
        const view = this.html.cloneNode(true);
        assignVariables(view);

        const viewPatch = new ViewPatch(view, this.patch);
        view.$.apply = (state) => viewPatch.apply(state);

        state && viewPatch.apply(state);
        return view;
    }

    processTemplate(html) {
        return typeof html == 'string'
            ? generateDOM(html)
            : html;
    }
}


class ViewPatch {
    constructor(view, patch) {
        this.view = view;
        this.patch = patch(view);
        this.state = {};

        this.methodify();
    }

    apply(state) {
        let changes = this.process(state);

        for(let key in changes) {
            if(!this.patch[key]) continue;

            let change = changes[key];
            this.patch[key](change, state);
        }
    }

    process(newState) {
        const changes = {};
        const allKeys = new Set();
        Object.getOwnPropertyNames(this.state)
            .concat(Object.getOwnPropertyNames(newState))
            .forEach((key)=>{
                allKeys.add(key);
            });

        for(let key of allKeys) {
            if(this.state[key] != newState[key]) {
                changes[key] = newState[key];
            }
        }
        this.state = clone(newState);
        return changes;
    }

    methodify() {
        for(let key of Object.getOwnPropertyNames(this.patch)) {
            if(this.patch[key] instanceof Array) {
                const elements = this.patch[key];
                this.patch[key] = (value) => {
                    for(let element of elements) {
                        updateElement(element, value);
                    }
                };
            }
        }
    }
}

export default PatchIt;

function updateElement(element, value) {
    const setProperty = (prop) => {
        return typeof element[prop] == 'undefined'
            ? false
            : (element[prop] = value)
            ;
    };

    setProperty('value') || setProperty('textContent');
}

function assignVariables(parentElement) {
    parentElement.$ || (parentElement.$ = {});
    parentElement.querySelectorAll('[var]').forEach((element) => {
        parentElement.$[element.attributes['var'].value] = element;
    });

    return parentElement;
}

function generateDOM(html) {
    var parent = document.createElement('div');
    parent.innerHTML = html;

    return parent.firstElementChild;
}

function clone(obj) {
    if(obj instanceof Array) return obj.slice();

    const copied = {};

    for(let key of Object.getOwnPropertyNames(obj)) {
        copied[key] = (typeof obj[key] == 'object') ? clone(obj[key]) : obj[key];
    }

    return copied;
}
