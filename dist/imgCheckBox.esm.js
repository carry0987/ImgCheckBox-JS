const CHK_TOGGLE = 0;
const CHK_SELECT = 1;
const CHK_DESELECT = 2;
const CHECK_MARK = 'imgChked';
const CHECKMARK_POSITION = {
    'top-left': {
        top: '0.5%',
        left: '0.5%'
    },
    top: {
        top: '0.5%',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    'top-right': {
        top: '0.5%',
        right: '0.5%'
    },
    left: {
        left: '0.5%',
        bottom: 0,
        top: 0,
        margin: 'auto'
    },
    right: {
        right: '0.5%',
        bottom: 0,
        top: 0,
        margin: 'auto'
    },
    'bottom-left': {
        bottom: '0.5%',
        left: '0.5%'
    },
    bottom: {
        bottom: '0.5%',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    'bottom-right': {
        bottom: '0.5%',
        right: '0.5%'
    },
    center: {
        top: '0.5%',
        bottom: '0.5%',
        left: '0.5%',
        right: '0.5%',
        margin: 'auto'
    }
};
const defaults = {
    checkMarkImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMzQ2LjM4NCkiPjxwYXRoIGZpbGw9IiMxZWM4MWUiIGZpbGwtb3BhY2l0eT0iLjgiIGQ9Ik0zMiAzNDYuNGEzMiAzMiAwIDAgMC0zMiAzMiAzMiAzMiAwIDAgMCAzMiAzMiAzMiAzMiAwIDAgMCAzMi0zMiAzMiAzMiAwIDAgMC0zMi0zMnptMjEuMyAxMC4zbC0yNC41IDQxTDkuNSAzNzVsMTcuNyA5LjYgMjYtMjh6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTkuNSAzNzUuMmwxOS4zIDIyLjQgMjQuNS00MS0yNiAyOC4yeiIvPjwvZz48L3N2Zz4=',
    enableShiftClick: true,
    graySelected: true,
    scaleSelected: true,
    fixedImageSize: false,
    checkMark: 'imgChked',
    checkMarkSize: '30px',
    checkMarkPosition: 'top-left',
    scaleCheckMark: true,
    fadeCheckMark: false,
    addToForm: false,
    inputValueAttribute: null,
    preselect: [],
    radio: false,
    canDeselect: false,
    styles: {},
    debugMessages: false
};
const defaultStyles = {
    'span.imgCheckbox': {
        'user-select': 'none',
        '-webkit-user-select': 'none',
        /* Chrome all / Safari all */
        '-moz-user-select': 'none',
        /* Firefox all */
        '-ms-user-select': 'none',
        /* IE 10+ */
        position: 'relative',
        padding: '0',
        margin: '2px',
        display: 'inline-block',
        border: '1px solid transparent',
        'transition-duration': '300ms'
    },
    'span.imgCheckbox img': {
        display: 'block',
        margin: '0',
        padding: '0',
        'transition-duration': '300ms'
    },
    'span.imgCheckbox::before': {
        display: 'block',
        'background-size': '100% 100%',
        content: "''",
        color: 'white',
        'font-weight': 'bold',
        'border-radius': '50%',
        position: 'absolute',
        margin: '0.5%',
        'z-index': '1',
        'text-align': 'center',
        'transition-duration': '300ms'
    }
};

function throwError(message) {
    throw new Error(message);
}

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string') {
        return ele;
    }
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function createElem(tagName, attrs = {}, text = '') {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr];
            }
            else {
                elem.setAttribute(attr, attrs[attr]);
            }
        }
    }
    if (text)
        elem.textContent = text;
    return elem;
}

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !isArray(item);
}
function isArray(item) {
    return Array.isArray(item);
}
function isEmpty(value) {
    // Check for number
    if (typeof value === 'number') {
        return false;
    }
    // Check for string
    if (typeof value === 'string' && value.length === 0) {
        return true;
    }
    // Check for array
    if (isArray(value) && value.length === 0) {
        return true;
    }
    // Check for object
    if (isObject(value) && Object.keys(value).length === 0) {
        return true;
    }
    // Check for any falsy values
    return !value;
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value) || isArray(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = isArray(value) ? [] : {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
function setStylesheetId(id) {
    stylesheetId = id;
}
function setReplaceRule(from, to) {
    replaceRule.from = from;
    replaceRule.to = to;
}
// CSS Injection
function injectStylesheet(stylesObject, id = null) {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style');
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);
    let stylesheet = style.sheet;
    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}
function buildRules(ruleObject) {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }
    return ruleSet;
}
function compatInsertRule(stylesheet, selector, cssText, id = null) {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}
function removeStylesheet(id = null) {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}

class Utils {
    static deepMerge = deepMerge;
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = getElem;
    static throwError = (msg) => {
        throwError('[ImgCheckBox]: ' + msg);
    };
    static changeSelection(chosenElement, howToModify, addToForm, radio, canDeselect, wrapperElements, constants) {
        const { CHECK_MARK, CHK_DESELECT, CHK_TOGGLE, CHK_SELECT } = constants;
        if (radio && howToModify !== CHK_DESELECT) {
            wrapperElements.forEach((wrapper) => wrapper !== chosenElement && wrapper.classList.remove(CHECK_MARK));
            canDeselect ? chosenElement.classList.toggle(CHECK_MARK) : chosenElement.classList.add(CHECK_MARK);
        }
        else {
            (howToModify === CHK_DESELECT && chosenElement.classList.remove(CHECK_MARK)) ||
                (howToModify === CHK_TOGGLE && chosenElement.classList.toggle(CHECK_MARK)) ||
                (howToModify === CHK_SELECT && chosenElement.classList.add(CHECK_MARK));
        }
        const currentIsSelected = chosenElement.classList.contains(CHECK_MARK);
        if (addToForm) {
            Utils.updateFormValues(radio ? wrapperElements : chosenElement, CHECK_MARK);
        }
        return currentIsSelected;
    }
    static updateFormValues(element, CHECK_MARK) {
        let elements = element instanceof Array ? element : [element];
        elements.forEach((el) => {
            // Make sure el has dataset property
            if (!('dataset' in el))
                return;
            const hiddenElements = Utils.getElem('.' + el.dataset.hiddenElementId, 'all');
            // Check if hiddenElements is null
            if (hiddenElements) {
                hiddenElements.forEach((hiddenElement) => {
                    // Check if hiddenElement is HTMLElement
                    if (hiddenElement instanceof HTMLElement && hiddenElement.tagName.toLowerCase() === 'input') {
                        const inputElement = hiddenElement; // Type assertion to HTMLInputElement
                        inputElement.checked = el.classList.contains(CHECK_MARK);
                        // Set attribute checked for hidden element
                        if (inputElement.checked) {
                            inputElement.setAttribute('checked', 'checked');
                        }
                        else {
                            inputElement.removeAttribute('checked');
                        }
                    }
                });
            }
        });
    }
    static buildStyles(baseSelector, checkedSelector, baseStyle, checkedStyle) {
        let styles = {};
        const arrayBuilder = (selector, styleValues, checked = false) => {
            let space = selector.startsWith('::') ? '' : ' ';
            if (!selector)
                space = '.' + checkedSelector;
            styles[`span.imgCheckbox${checked ? '.' + checkedSelector : ''}${space}${selector}`] = styleValues;
        };
        if (typeof baseStyle === 'object' && typeof checkedStyle === 'object') {
            arrayBuilder(baseSelector, baseStyle);
            arrayBuilder(baseSelector, checkedStyle, true);
        }
        else {
            for (let [selector, value] of Object.entries(baseStyle)) {
                arrayBuilder(selector, value, !!selector);
            }
        }
        return styles;
    }
}
Utils.setStylesheetId('imgCheckbox-style');
Utils.setReplaceRule('.imgCheckbox', '.imgCheckbox');

const reportInfo = (vars, showType = false) => {
    if (showType === true) {
        console.log('Data Type : ' + typeof vars, '\nValue : ' + vars);
    }
    else if (typeof showType !== 'boolean') {
        console.log(showType);
    }
    else {
        console.log(vars);
    }
};

class EventEmitter {
    // Initialize callbacks with an empty object
    callbacks = {};
    /**
     * Initializes the callbacks for a given event. If the event does not already have
     * an entry in the callbacks object, a new empty array is created for it.
     * @param event - The name of the event to initialize. If not provided, it checks
     *                 for undefined events and initializes them if needed.
     */
    init(event) {
        if (event && !this.callbacks[event]) {
            this.callbacks[event] = [];
        }
    }
    /**
     * Checks if a listener is a valid function. Throws a TypeError if the listener
     * is not a function.
     * @param listener - The listener to check. Should be a function that either returns void
     *                   or a Promise that resolves to void.
     */
    checkListener(listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('The listener must be a function');
        }
    }
    /**
     * Checks whether a specific event has been registered within the emitter.
     * @param event - The name of the event to check for existence.
     * @returns A boolean indicating whether the event exists in the callbacks.
     */
    hasEvent(event) {
        return this.callbacks[event] !== undefined;
    }
    /**
     * Retrieves all the listeners currently registered to the emitter.
     * @returns An object containing all registered events and their associated listeners.
     *          Each key is a string representing the event name, mapping to an array of
     *          listener functions.
     */
    listeners() {
        return this.callbacks;
    }
    /**
     * Adds a listener function for the specified event. This method is an alias for the
     * `on` method, purely for semantic purposes.
     * @param event - The name of the event to listen to.
     * @param listener - The function to invoke when the event is emitted. Can be asynchronous.
     * @returns The instance of the EventEmitter for method chaining.
     */
    addListener(event, listener) {
        return this.on(event, listener);
    }
    /**
     * Clears all listeners for a specific event or, if no event is provided, clears all
     * listeners for all events.
     * @param event - Optional. The name of the event whose listeners should be cleared.
     *                If omitted, all event listeners are cleared.
     * @returns The instance of the EventEmitter for method chaining.
     */
    clearListener(event) {
        if (event) {
            this.callbacks[event] = [];
        }
        else {
            this.callbacks = {};
        }
        return this;
    }
    /**
     * Adds a listener for a specific event type. Initializes the event if it's not already
     * present and ensures the listener is valid.
     * @param event - The name of the event to listen to.
     * @param listener - The function to call when the event is emitted. Can return a promise.
     * @returns The instance of the EventEmitter for method chaining.
     */
    on(event, listener) {
        this.checkListener(listener);
        this.init(event);
        this.callbacks[event].push(listener);
        return this;
    }
    /**
     * Removes a listener from a specific event. If no listener is provided, all listeners
     * for the event are removed.
     * @param event - The name of the event to remove a listener from.
     * @param listener - Optional. The specific listener to remove. If not provided, all
     *                   listeners for the event are removed.
     * @returns The instance of the EventEmitter for method chaining.
     */
    off(event, listener) {
        if (listener) {
            this.checkListener(listener);
        }
        const eventName = event;
        this.init();
        if (!this.callbacks[eventName] || this.callbacks[eventName].length === 0) {
            // There is no callbacks with this key
            return this;
        }
        if (listener) {
            this.callbacks[eventName] = this.callbacks[eventName].filter((value) => value !== listener);
        }
        else {
            // Remove all listeners if no specific listener is provided
            this.callbacks[eventName] = [];
        }
        return this;
    }
    /**
     * Emits an event, invoking all registered listeners for that event with the provided
     * arguments. If any listener returns a promise, the method itself will return a promise
     * that resolves when all listeners have been processed.
     * @param event - The name of the event to emit.
     * @param args - Arguments to pass to each listener when invoked.
     * @returns A boolean or a promise resolving to a boolean indicating if listeners were
     *          successfully called and resolved/ran without error.
     */
    emit(event, ...args) {
        const eventName = event;
        // Initialize the event
        this.init(eventName);
        // If there are no callbacks, return false
        if (this.callbacks[eventName].length <= 0) {
            return false;
        }
        // Get all results
        const results = this.callbacks[eventName].map(callback => {
            try {
                // Execute callback and capture the result
                const result = callback(...args);
                // If result is a promise, wrap it in Promise.resolve to handle uniformly
                return result instanceof Promise ? result : Promise.resolve(result);
            }
            catch (e) {
                console.error(`Error in event listener for event: ${eventName}`, e); // Logging error
                // Even if an error occurs, continue processing other callbacks
                return Promise.resolve();
            }
        });
        // Check if any result is a promise
        const hasPromise = results.some(result => result instanceof Promise);
        // If there is at least one promise, return a promise that resolves when all promises resolve
        if (hasPromise) {
            return Promise.all(results).then(() => true).catch((e) => {
                console.error(`Error handling promises for event: ${eventName}`, e); // Logging error
                return false;
            });
        }
        else {
            // If no promises, return true
            return true;
        }
    }
    /**
     * Adds a listener for a specific event that will only be invoked once. After the first
     * invocation, the listener will be automatically removed.
     * @param event - The name of the event to listen to once.
     * @param listener - The function to invoke once when the event is emitted.
     * @returns The instance of the EventEmitter for method chaining.
     */
    once(event, listener) {
        this.checkListener(listener);
        const onceListener = (...args) => {
            // Use a sync wrapper to ensure the listener is removed immediately after execution
            const result = listener(...args);
            // Remove the listener immediately
            this.off(event, onceListener);
            // Handle async listeners by wrapping the result in Promise.resolve
            return result instanceof Promise ? result : Promise.resolve(result);
        };
        return this.on(event, onceListener);
    }
}

class ImgCheckBox extends EventEmitter {
    static instances = [];
    static version = '3.0.4';
    element = [];
    options = defaults;
    targetIndex = 0;
    imgChkMethods = new Map();
    constructor(element, option) {
        super();
        this.initialize(element, option);
        ImgCheckBox.instances.push(this);
        if (ImgCheckBox.instances.length === 1) {
            reportInfo(`ImgCheckBox is loaded, version: ${ImgCheckBox.version}`);
        }
        return this;
    }
    /**
     * Initialization
     */
    initialize(element, option) {
        let elems = Utils.getElem(element, 'all');
        if (!elems)
            Utils.throwError('Element not found');
        this.element = Array.isArray(elems)
            ? elems
            : (elems instanceof NodeList ? Array.from(elems) : [elems]);
        if (this.element.length === 0)
            Utils.throwError('Element not found');
        // Replace default options with user defined options
        this.options = Utils.deepMerge({}, defaults, option || {});
        // Create the imgCheckbox
        this.createImgCheckbox(ImgCheckBox.instances.length);
    }
    /**
     * Main function for creating the imgCheckbox
     */
    createImgCheckbox(id) {
        const elements = this.element;
        const options = this.options;
        let lastClicked = null;
        // Define the finalStyles object that will be aggregated and used later
        let finalStyles = {};
        // Define wrapper elements array
        let wrapperElements = [];
        // Generate grayscale styles if enabled
        let grayscaleStyles = Utils.buildStyles('img', CHECK_MARK, {
            transform: 'scale(1)',
            filter: 'none',
            '-webkit-filter': 'grayscale(0)'
        }, {
            filter: 'grayscale(1)',
            '-webkit-filter': 'grayscale(1)'
        });
        let scaleStyles = Utils.buildStyles('img', CHECK_MARK, {
            transform: 'scale(1)'
        }, {
            transform: 'scale(0.9)'
        });
        let scaleCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
            transform: 'scale(0)'
        }, {
            transform: 'scale(1)'
        });
        let fadeCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
            opacity: '0'
        }, {
            opacity: '1'
        });
        /* *** STYLESHEET STUFF *** */
        // Shove in the custom check mark
        if (options.checkMarkImage) {
            Utils.deepMerge(finalStyles, {
                'span.imgCheckbox::before': { 'background-image': "url('" + options.checkMarkImage + "')" }
            });
        }
        // Give the checkmark dimensions
        let chkDimensions = options.checkMarkSize.split(' ');
        Utils.deepMerge(finalStyles, {
            'span.imgCheckbox::before': {
                width: chkDimensions[0],
                height: chkDimensions[chkDimensions.length - 1]
            }
        });
        // Give the checkmark a position
        Utils.deepMerge(finalStyles, { 'span.imgCheckbox::before': CHECKMARK_POSITION[options.checkMarkPosition] });
        // Fixed image sizes
        if (options.fixedImageSize && typeof options.fixedImageSize === 'string') {
            let imgDimensions = options.fixedImageSize.split(' ');
            Utils.deepMerge(finalStyles, {
                'span.imgCheckbox img': {
                    width: imgDimensions[0],
                    height: imgDimensions[imgDimensions.length - 1]
                }
            });
        }
        let conditionalExtend = [
            { doExtension: options.graySelected, style: grayscaleStyles },
            { doExtension: options.scaleSelected, style: scaleStyles },
            { doExtension: options.scaleCheckMark, style: scaleCheckMarkStyles },
            { doExtension: options.fadeCheckMark, style: fadeCheckMarkStyles }
        ];
        conditionalExtend.forEach((extension) => {
            if (extension.doExtension) {
                Utils.deepMerge(finalStyles, extension.style);
            }
        });
        Utils.deepMerge(defaultStyles, Utils.buildStyles('', CHECK_MARK, {
            '': { 'border-color': '#ccc' },
            img: {},
            '::before': {}
        }));
        finalStyles = Utils.deepMerge({}, defaultStyles, finalStyles, options.styles);
        // Now that we've built up our styles, inject them
        Utils.injectStylesheet(finalStyles, id.toString());
        // Loop through each element
        for (let index = 0; index < elements.length; index++) {
            let element = elements[index];
            // If the element is already an imgCheckbox, skip it
            if (element.parentNode?.classList.contains('imgCheckbox' + id))
                continue;
            // If the element is not an image, skip it
            if (element.tagName.toLowerCase() !== 'img')
                continue;
            // Set img undraggable
            element.ondragstart = () => false;
            /* *** DOM STUFF *** */
            let wrapper = document.createElement('span');
            wrapper.className = 'imgCheckbox' + id;
            element.parentNode?.insertBefore(wrapper, element);
            wrapper.appendChild(element);
            wrapperElements.push(wrapper);
            // Set up select/deselect functions
            const methods = {
                deselect: () => {
                    Utils.changeSelection(wrapper, CHK_DESELECT, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.emit('deselect', wrapper);
                    this.emit('change', wrapper, false);
                },
                select: () => {
                    Utils.changeSelection(wrapper, CHK_SELECT, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.emit('select', wrapper);
                    this.emit('change', wrapper, true);
                }
            };
            this.imgChkMethods.set(wrapper, methods);
            if (wrapper.firstChild && wrapper.firstChild instanceof HTMLElement) {
                this.imgChkMethods.set(wrapper.firstChild, methods);
            }
            // Inject into form if necessary
            if (options.addToForm instanceof Element || options.addToForm === true) {
                let formElement = null;
                if (options.addToForm === true) {
                    formElement = element.closest('form');
                }
                else {
                    formElement = options.addToForm;
                }
                let inputElemValue = options.inputValueAttribute
                    ? element.getAttribute(options.inputValueAttribute) || ''
                    : '';
                if (formElement) {
                    let hiddenElementId = 'hEI' + id + '-' + index;
                    const parentElement = element.parentElement;
                    if (parentElement && 'dataset' in parentElement) {
                        parentElement.dataset.hiddenElementId = hiddenElementId;
                    }
                    let imgName = element.getAttribute('name') ||
                        element.src.match(/\/([^\/]+)\.\w+$/)?.[1] ||
                        '';
                    let inputElem = document.createElement('input');
                    inputElem.type = 'checkbox';
                    inputElem.name = imgName;
                    inputElem.className = hiddenElementId;
                    inputElem.style.display = 'none';
                    inputElem.value = inputElemValue;
                    formElement.appendChild(inputElem);
                }
                else if (options.debugMessages) {
                    console.warn('[ImgCheckBox]: No form found (looks for form by default)');
                }
            }
        }
        // Preselect elements
        if (Array.isArray(this.options.preselect)) {
            this.options.preselect.forEach((index) => {
                if (index >= 0 && index < wrapperElements.length) {
                    this.imgChkMethods.get(wrapperElements[index])?.select();
                }
            });
        }
        else if (this.options.preselect === true) {
            wrapperElements.forEach((el) => {
                this.imgChkMethods.get(el)?.select();
            });
        }
        // Set up event handler
        wrapperElements.forEach((el) => {
            el.addEventListener('click', (e) => {
                const isShiftClick = options.enableShiftClick && !options.radio && e.shiftKey;
                if (isShiftClick && lastClicked) {
                    let lastIdx = wrapperElements.indexOf(lastClicked);
                    let thisIdx = wrapperElements.indexOf(el);
                    if (lastIdx > thisIdx)
                        [lastIdx, thisIdx] = [thisIdx, lastIdx];
                    for (let between = lastIdx; between <= thisIdx; between++) {
                        const currentEl = wrapperElements[between];
                        if (!currentEl.classList.contains(CHECK_MARK)) {
                            this.imgChkMethods.get(currentEl)?.select();
                            this.emit('click', currentEl, true);
                        }
                    }
                }
                else {
                    const isSelected = Utils.changeSelection(el, CHK_TOGGLE, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.emit('click', el, isSelected);
                    if (isSelected) {
                        this.emit('select', el);
                    }
                    else {
                        this.emit('deselect', el);
                    }
                    this.emit('change', el, isSelected);
                }
                lastClicked = el;
            });
        });
        return this;
    }
    target(index) {
        if (index >= 0 && index < this.element.length) {
            this.targetIndex = index;
            return this;
        }
        else {
            Utils.throwError('The given index is out of range.');
        }
    }
    state() {
        const element = Utils.getElem(this.element[this.targetIndex]);
        const parentElement = element.parentNode;
        return parentElement && parentElement.classList.contains(CHECK_MARK);
    }
    select(index) {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.imgChkMethods.get(this.element[index])?.select();
    }
    deselect(index) {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.imgChkMethods.get(this.element[index])?.deselect();
    }
    selectAll() {
        this.element.forEach((el) => {
            this.imgChkMethods.get(el)?.select();
        });
        this.emit('selectAll', this.element);
    }
    deselectAll() {
        this.element.forEach((el) => {
            this.imgChkMethods.get(el)?.deselect();
        });
        this.emit('deselectAll');
    }
    destroy() {
        let id = ImgCheckBox.instances.indexOf(this);
        if (id < 0) {
            Utils.throwError('Instance not found');
            return;
        }
        Utils.removeStylesheet(id.toString());
        this.element.forEach((element) => {
            let wrapper = element.parentNode;
            if (wrapper && wrapper.classList.contains('imgCheckbox' + id)) {
                wrapper.parentNode?.insertBefore(element, wrapper);
                wrapper.parentNode?.removeChild(wrapper);
            }
        });
        this.clearListener();
        ImgCheckBox.instances.splice(id, 1);
    }
    getChecked() {
        return this.element.filter((el) => el.parentElement?.classList.contains(CHECK_MARK));
    }
    getUnchecked() {
        return this.element.filter((el) => !el.parentElement?.classList.contains(CHECK_MARK));
    }
    get length() {
        return this.element.length;
    }
    static get constants() {
        return {
            CHECK_MARK: CHECK_MARK,
            CHK_DESELECT: CHK_DESELECT,
            CHK_TOGGLE: CHK_TOGGLE,
            CHK_SELECT: CHK_SELECT
        };
    }
}

export { ImgCheckBox as default };
