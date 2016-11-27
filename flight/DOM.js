const DOM = {};

DOM.getElement = (element) => {
    return typeof(element) == 'string' ?
        document.querySelector(element) : element;
};

export default DOM;
