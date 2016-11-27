/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _gc = __webpack_require__(1);

	var _gc2 = _interopRequireDefault(_gc);

	var _component = __webpack_require__(2);

	var _component2 = _interopRequireDefault(_component);

	var _eventPool = __webpack_require__(3);

	var _event = __webpack_require__(5);

	var _DOM = __webpack_require__(4);

	var _DOM2 = _interopRequireDefault(_DOM);

	var _patch = __webpack_require__(6);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Flight = {};
	exports.default = Flight;

	// garbage Collector

	Flight.GC = _gc2.default;

	// Component

	Flight.Component = _component2.default;

	// eventPools

	Flight.EventPool = _eventPool.EventPool;
	Flight.DataEventPool = _eventPool.DataEventPool;
	Flight.getOrCreateEventPool = _eventPool.getOrCreateEventPool;
	Flight.detachEventPool = _eventPool.detachEventPool;

	// events

	Flight.Event = _event.Event;
	Flight.eventType = _event.eventType;
	Flight.eventOfType = _event.eventOfType;
	Flight.basicEventOf = _event.basicEventOf;

	// DOM

	Flight.DOM = _DOM2.default;

	// Patch

	Flight.Patch = _patch2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var GC = {
	    components: new Map(),
	    listeners: new Map(),
	    elementAttribute: 'flight-component-id'
	};

	GC.init = function () {
	    var _this = this;

	    var observer = new MutationObserver(function (mutations) {
	        mutations.forEach(function (mutation) {
	            if (mutation.removedNodes) {
	                mutation.removedNodes.forEach(function (node) {
	                    _this.removeNode(node);
	                });
	            }
	        });
	    });

	    observer.observe(document.body, { childList: true, subtree: true });
	    this.init = false;
	};

	GC.removeNode = function (element) {
	    var _this2 = this;

	    if (!element.querySelectorAll) return;

	    var removedViews = element.querySelectorAll('[' + this.elementAttribute + ']');

	    removedViews.forEach(function (view) {
	        var componentId = view.attributes[_this2.elementAttribute].value;
	        var component = _this2.components.get(parseInt(componentId));

	        component && _this2.destroy(component);
	    });
	};

	GC.registerComponent = function (component) {
	    this.components.set(component.componentId, component);
	    this.listeners.set(parseInt(component.componentId), []);

	    component.view.setAttribute(this.elementAttribute, component.componentId);
	    GC.init && GC.init();
	};

	GC.registerListener = function (component, element, event, callback) {
	    if (!this.listeners.has(component.componentId)) return;

	    this.listeners.get(component.componentId).push({
	        element: element,
	        eventName: extractEventName(event),
	        callback: callback
	    });
	};

	GC.destroy = function (component) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = this.listeners.get(component.componentId)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var listener = _step.value;

	            listener.element.removeEventListener(listener.eventName, listener.callback);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    component.view = null;
	    this.components.delete(component.componentId);
	    this.listeners.delete(component.componentId);
	};

	exports.default = GC;


	function extractEventName(event) {
	    return typeof event == 'string' ? event : event.EventName;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _eventPool = __webpack_require__(3);

	var _DOM = __webpack_require__(4);

	var _DOM2 = _interopRequireDefault(_DOM);

	var _gc = __webpack_require__(1);

	var _gc2 = _interopRequireDefault(_gc);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var __componentId = 0;

	var Component = function () {
	    function Component() {
	        _classCallCheck(this, Component);

	        this.componentId = ++__componentId;
	    }

	    _createClass(Component, [{
	        key: 'listen',
	        value: function listen() {}
	    }, {
	        key: 'render',
	        value: function render() {
	            this.listen();

	            return this.view;
	        }
	    }, {
	        key: 'getOrCreateEventPool',
	        value: function getOrCreateEventPool() {
	            return this.eventPool || (this.eventPool = _eventPool.EventPool.forComponent(this));
	        }
	    }, {
	        key: 'on',
	        value: function on(path) {
	            if (path instanceof _eventPool.EventPool) {
	                return path;
	            }

	            if (!path || path == 'ui') {
	                return this.getOrCreateEventPool();
	            } else if (path.substring(0, 3) === "ui:") {
	                var element = this.view.querySelector(path.substring(3));
	                return _eventPool.EventPool.forElement(element, this);
	            }
	            return new EventPoolAccessor(this, (0, _eventPool.getOrCreateEventPool)(path));
	        }
	    }, {
	        key: 'view',
	        get: function get() {
	            return this._view;
	        },
	        set: function set(element) {
	            this._view = element;
	            this.getOrCreateEventPool().element = element;
	            if (element && !this._attached) {
	                _gc2.default.registerComponent(this);
	            }
	        }
	    }], [{
	        key: 'attachTo',
	        value: function attachTo(element) {
	            element = _DOM2.default.getElement(element);

	            var instance = new this(element);
	            instance._attached = true;
	            instance.view = element;
	            instance.listen();

	            return instance;
	        }
	    }]);

	    return Component;
	}();

	var EventPoolAccessor = function () {
	    function EventPoolAccessor(component, pool) {
	        _classCallCheck(this, EventPoolAccessor);

	        this.component = component;
	        this.eventPool = pool;
	    }

	    _createClass(EventPoolAccessor, [{
	        key: 'listen',
	        value: function listen() {
	            for (var _len = arguments.length, listeners = Array(_len), _key = 0; _key < _len; _key++) {
	                listeners[_key] = arguments[_key];
	            }

	            for (var i = 0; i < listeners.length; i += 2) {
	                var fn = this.eventPool.addEventListener(listeners[i], listeners[i + 1]);
	                _gc2.default.registerListener(this.component, this.eventPool.element, listeners[i].EventName, fn);
	            }
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(event) {
	            return this.eventPool.trigger(event);
	        }
	    }]);

	    return EventPoolAccessor;
	}();

	exports.default = Component;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.getOrCreateEventPool = getOrCreateEventPool;
	exports.detachEventPool = detachEventPool;

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventPool = exports.EventPool = function () {
	    function EventPool() {
	        _classCallCheck(this, EventPool);
	    }

	    _createClass(EventPool, [{
	        key: 'trigger',
	        value: function trigger(flightEvent) {
	            flightEvent.originalEvent = flightEvent.event();
	            this.element.dispatchEvent(flightEvent.originalEvent);
	        }
	    }, {
	        key: 'listen',
	        value: function listen() {
	            for (var i = 0; i < arguments.length; i += 2) {
	                this.addEventListener(arguments.length <= i ? undefined : arguments[i], arguments.length <= i + 1 ? undefined : arguments[i + 1]);
	            }
	        }
	    }, {
	        key: 'addEventListener',
	        value: function addEventListener(flightEvent, eventHandler) {
	            var realHandler = void 0;
	            if (typeof flightEvent == 'string') {
	                realHandler = function realHandler(event) {
	                    return eventHandler(event);
	                };
	                this.element.addEventListener(flightEvent, realHandler);
	            } else {
	                realHandler = function realHandler(event) {
	                    return eventHandler(event.detail);
	                };
	                this.element.addEventListener(flightEvent.EventName, realHandler);
	            }
	            return realHandler;
	        }
	    }, {
	        key: '$',
	        value: function $(key) {
	            return getOrCreateEventPool(this.path + '/#' + key);
	        }
	    }], [{
	        key: 'forElement',
	        value: function forElement(element, component) {
	            var instance = new this();

	            instance.name = component && component.constructor.name;
	            instance.element = element;

	            return instance;
	        }
	    }, {
	        key: 'forComponent',
	        value: function forComponent(component) {
	            var instance = new this();

	            instance.name = component.constructor.name;
	            instance.element = component.view;

	            return instance;
	        }
	    }]);

	    return EventPool;
	}();

	var DataEventPool = exports.DataEventPool = function (_EventPool) {
	    _inherits(DataEventPool, _EventPool);

	    function DataEventPool(name, path) {
	        _classCallCheck(this, DataEventPool);

	        var _this = _possibleConstructorReturn(this, (DataEventPool.__proto__ || Object.getPrototypeOf(DataEventPool)).call(this));

	        _this.name = name;
	        _this.path = path;
	        _this.element = _this.createElement(name);
	        _this.children = {};
	        return _this;
	    }

	    _createClass(DataEventPool, [{
	        key: 'detach',
	        value: function detach() {
	            delete this.element;
	            detachEventPool(this.path);
	        }
	    }, {
	        key: 'createElement',
	        value: function createElement(name) {
	            var idFromName = function idFromName(name) {
	                return name.replace(/[^A-Za-z0-9/]/g, '').replace(/[/]/g, '-');
	            };
	            var elementFromName = function elementFromName(name) {
	                return name[0] == '#' ? 'item' : name.toLowerCase().replace(/[^a-z0-9]/g, '');
	            };

	            var element = document.createElement(elementFromName(name));
	            element.id = idFromName(name);

	            return element;
	        }
	    }]);

	    return DataEventPool;
	}(EventPool);

	;

	var dataEventPoolRoot = new DataEventPool('data');

	function getOrCreateEventPool(path) {
	    var poolPath = path.split('/').slice(1);
	    var currentPath = 'data';
	    var eventPool = dataEventPoolRoot;
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = poolPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var poolName = _step.value;

	            currentPath += '/' + poolName;
	            if (!eventPool.children[poolName]) {
	                var newPool = new DataEventPool(poolName, currentPath);
	                eventPool.children[poolName] = newPool;
	                eventPool.element.appendChild(newPool.element);
	            }
	            eventPool = eventPool.children[poolName];
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return eventPool;
	};

	function detachEventPool(path) {
	    var poolPath = path.split('/').slice(1);
	    var eventPool = dataEventPoolRoot;
	    var poolToDelete = poolPath.pop();
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	        for (var _iterator2 = poolPath[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var poolName = _step2.value;

	            if (!eventPool.children[poolName]) {
	                return false;
	            }
	            eventPool = eventPool.children[poolName];
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }

	    if (eventPool.children[poolToDelete]) {
	        delete eventPool.children[poolToDelete];
	    }

	    return true;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var DOM = {};

	DOM.getElement = function (element) {
	    return typeof element == 'string' ? document.querySelector(element) : element;
	};

	exports.default = DOM;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.eventType = eventType;
	exports.eventOfType = eventOfType;
	exports.basicEvent = basicEvent;

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*******************************************************************************
	 * Event | eventType | eventOfType | basicEventOf
	 **/

	var __eventId = 0;

	var Event = function () {
	    function Event() {
	        _classCallCheck(this, Event);

	        this.name = this.constructor.EventName;
	    }

	    _createClass(Event, [{
	        key: "event",
	        value: function event() {
	            return new CustomEvent(this.name, {
	                detail: this,
	                bubbles: !this.constructor._cancelBubble,
	                cancelable: true
	            });
	        }
	    }, {
	        key: "stopPropagation",
	        value: function stopPropagation() {
	            this.originalEvent && this.originalEvent.stopPropagation();
	        }
	    }, {
	        key: "preventDefault",
	        value: function preventDefault() {
	            this.originalEvent && this.originalEvent.preventDefault();
	        }
	    }], [{
	        key: "bubbles",
	        value: function bubbles(_bubbles) {
	            this._cancelBubble = !_bubbles;
	            return this;
	        }
	    }, {
	        key: "alias",
	        value: function alias(name) {
	            this.EventName = name;
	            return this;
	        }
	    }]);

	    return Event;
	}();

	exports.Event = Event;
	function eventType(constr) {
	    var EventClass = function (_Event) {
	        _inherits(EventClass, _Event);

	        function EventClass() {
	            _classCallCheck(this, EventClass);

	            var _this = _possibleConstructorReturn(this, (EventClass.__proto__ || Object.getPrototypeOf(EventClass)).call(this));

	            for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	                params[_key] = arguments[_key];
	            }

	            constr.apply(_this, params);
	            return _this;
	        }

	        return EventClass;
	    }(Event);
	    return EventClass;
	};

	function eventOfType(EventType) {
	    return function (_EventType) {
	        _inherits(_class, _EventType);

	        function _class() {
	            _classCallCheck(this, _class);

	            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	        }

	        return _class;
	    }(EventType).alias("Event" + ++__eventId);
	};

	function basicEvent() {
	    return function (_Event2) {
	        _inherits(_class2, _Event2);

	        function _class2() {
	            _classCallCheck(this, _class2);

	            return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
	        }

	        return _class2;
	    }(Event).alias("Event" + ++__eventId);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PatchIt = {};

	PatchIt.template = function (html, patch) {
	    return new PatchTemplate(html, patch);
	};

	var PatchTemplate = function () {
	    function PatchTemplate(html, patch) {
	        _classCallCheck(this, PatchTemplate);

	        this.html = this.processTemplate(html);
	        this.patch = patch;
	    }

	    _createClass(PatchTemplate, [{
	        key: 'render',
	        value: function render(state) {
	            var view = this.html.cloneNode(true);
	            assignVariables(view);

	            var viewPatch = new ViewPatch(view, this.patch);
	            view.$.apply = function (state) {
	                return viewPatch.apply(state);
	            };

	            state && viewPatch.apply(state);
	            return view;
	        }
	    }, {
	        key: 'processTemplate',
	        value: function processTemplate(html) {
	            return typeof html == 'string' ? generateDOM(html) : html;
	        }
	    }]);

	    return PatchTemplate;
	}();

	var ViewPatch = function () {
	    function ViewPatch(view, patch) {
	        _classCallCheck(this, ViewPatch);

	        this.view = view;
	        this.patch = patch(view);
	        this.state = {};

	        this.methodify();
	    }

	    _createClass(ViewPatch, [{
	        key: 'apply',
	        value: function apply(state) {
	            var changes = this.process(state);

	            for (var key in changes) {
	                if (!this.patch[key]) continue;

	                var change = changes[key];
	                this.patch[key](change, state);
	            }
	        }
	    }, {
	        key: 'process',
	        value: function process(newState) {
	            var changes = {};
	            var allKeys = new Set();
	            Object.getOwnPropertyNames(this.state).concat(Object.getOwnPropertyNames(newState)).forEach(function (key) {
	                allKeys.add(key);
	            });

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = allKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var key = _step.value;

	                    if (this.state[key] != newState[key]) {
	                        changes[key] = newState[key];
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            this.state = clone(newState);
	            return changes;
	        }
	    }, {
	        key: 'methodify',
	        value: function methodify() {
	            var _this = this;

	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = Object.getOwnPropertyNames(this.patch)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var key = _step2.value;

	                    if (this.patch[key] instanceof Array) {
	                        (function () {
	                            var elements = _this.patch[key];
	                            _this.patch[key] = function (value) {
	                                var _iteratorNormalCompletion3 = true;
	                                var _didIteratorError3 = false;
	                                var _iteratorError3 = undefined;

	                                try {
	                                    for (var _iterator3 = elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                                        var element = _step3.value;

	                                        updateElement(element, value);
	                                    }
	                                } catch (err) {
	                                    _didIteratorError3 = true;
	                                    _iteratorError3 = err;
	                                } finally {
	                                    try {
	                                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                                            _iterator3.return();
	                                        }
	                                    } finally {
	                                        if (_didIteratorError3) {
	                                            throw _iteratorError3;
	                                        }
	                                    }
	                                }
	                            };
	                        })();
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    }]);

	    return ViewPatch;
	}();

	exports.default = PatchIt;


	function updateElement(element, value) {
	    var setProperty = function setProperty(prop) {
	        return typeof element[prop] == 'undefined' ? false : element[prop] = value;
	    };

	    setProperty('value') || setProperty('textContent');
	}

	function assignVariables(parentElement) {
	    parentElement.$ || (parentElement.$ = {});
	    parentElement.querySelectorAll('[var]').forEach(function (element) {
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
	    if (obj instanceof Array) return obj.slice();

	    var copied = {};

	    var _iteratorNormalCompletion4 = true;
	    var _didIteratorError4 = false;
	    var _iteratorError4 = undefined;

	    try {
	        for (var _iterator4 = Object.getOwnPropertyNames(obj)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var key = _step4.value;

	            copied[key] = _typeof(obj[key]) == 'object' ? clone(obj[key]) : obj[key];
	        }
	    } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                _iterator4.return();
	            }
	        } finally {
	            if (_didIteratorError4) {
	                throw _iteratorError4;
	            }
	        }
	    }

	    return copied;
	}

/***/ }
/******/ ]);