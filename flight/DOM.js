const DOM = {};

DOM.getElement = (element, root) => {
    return typeof(element) == 'string' ?
        (root || document).querySelector(element) : element;
};

export default DOM;
