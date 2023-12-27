function reportError(...error) {
    console.error(...error);
}
function throwError(message) {
    throw new Error(message);
}

var errorUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    reportError: reportError,
    throwError: throwError
});

function getElem(ele, mode, parent) {
    if (typeof ele !== 'string')
        return ele;
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
function insertAfter(referenceNode, newNode) {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function insertBefore(referenceNode, newNode) {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
function addClass(ele, className) {
    ele.classList.add(className);
    return ele;
}
function removeClass(ele, className) {
    ele.classList.remove(className);
    return ele;
}
function toggleClass(ele, className) {
    ele.classList.toggle(className);
    return ele;
}
function hasClass(ele, className) {
    return ele.classList.contains(className);
}

var domUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addClass: addClass,
    createElem: createElem,
    getElem: getElem,
    hasClass: hasClass,
    insertAfter: insertAfter,
    insertBefore: insertBefore,
    removeClass: removeClass,
    toggleClass: toggleClass
});

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
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
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
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
    id = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + id);
    if (styleElement) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function isEmpty(str) {
    if (typeof str === 'number') {
        return false;
    }
    return !str || (typeof str === 'string' && str.length === 0);
}

class Utils {
    static throwError = errorUtils.throwError;
    static deepMerge = deepMerge;
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = domUtils.getElem;
    static changeSelection(chosenElement, howToModify, addToForm, radio, canDeselect, wrapperElements, constants) {
        const { CHECK_MARK, CHK_DESELECT, CHK_TOGGLE, CHK_SELECT } = constants;
        const isSelected = chosenElement.classList.contains(CHECK_MARK);
        if (radio && (howToModify !== CHK_DESELECT)) {
            wrapperElements.forEach(wrapper => (wrapper !== chosenElement) && wrapper.classList.remove(CHECK_MARK));
            canDeselect ? chosenElement.classList.toggle(CHECK_MARK) : chosenElement.classList.add(CHECK_MARK);
        }
        else {
            (howToModify === CHK_DESELECT && chosenElement.classList.remove(CHECK_MARK)) ||
                (howToModify === CHK_TOGGLE && chosenElement.classList.toggle(CHECK_MARK)) ||
                (howToModify === CHK_SELECT && chosenElement.classList.add(CHECK_MARK));
        }
        const currentIsSelected = chosenElement.classList.contains(CHECK_MARK);
        if (isSelected !== currentIsSelected) {
            const event = new CustomEvent('change', {
                detail: {
                    isSelected: currentIsSelected
                }
            });
            chosenElement.dispatchEvent(event);
        }
        if (addToForm) {
            Utils.updateFormValues(radio ? wrapperElements : chosenElement, CHECK_MARK);
        }
        return currentIsSelected;
    }
    static updateFormValues(element, CHECK_MARK) {
        let elements = (element instanceof Array) ? element : [element];
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

const CHK_TOGGLE = 0;
const CHK_SELECT = 1;
const CHK_DESELECT = 2;
const CHECK_MARK = 'imgChked';
const CHECKMARK_POSITION = {
    'top-left': {
        'top': '0.5%',
        'left': '0.5%',
    },
    'top': {
        'top': '0.5%',
        'left': 0,
        'right': 0,
        'margin': 'auto',
    },
    'top-right': {
        'top': '0.5%',
        'right': '0.5%',
    },
    'left': {
        'left': '0.5%',
        'bottom': 0,
        'top': 0,
        'margin': 'auto',
    },
    'right': {
        'right': '0.5%',
        'bottom': 0,
        'top': 0,
        'margin': 'auto',
    },
    'bottom-left': {
        'bottom': '0.5%',
        'left': '0.5%',
    },
    'bottom': {
        'bottom': '0.5%',
        'left': 0,
        'right': 0,
        'margin': 'auto',
    },
    'bottom-right': {
        'bottom': '0.5%',
        'right': '0.5%',
    },
    'center': {
        'top': '0.5%',
        'bottom': '0.5%',
        'left': '0.5%',
        'right': '0.5%',
        'margin': 'auto',
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
    debugMessages: false,
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
        'position': 'relative',
        'padding': '0',
        'margin': '2px',
        'display': 'inline-block',
        'border': '1px solid transparent',
        'transition-duration': '300ms',
    },
    'span.imgCheckbox img': {
        'display': 'block',
        'margin': '0',
        'padding': '0',
        'transition-duration': '300ms',
    },
    'span.imgCheckbox::before': {
        'display': 'block',
        'background-size': '100% 100%',
        'content': '\'\'',
        'color': 'white',
        'font-weight': 'bold',
        'border-radius': '50%',
        'position': 'absolute',
        'margin': '0.5%',
        'z-index': '1',
        'text-align': 'center',
        'transition-duration': '300ms',
    }
};

class ImgCheckBox {
    static instances = [];
    static version = '2.1.0';
    element;
    options;
    targetIndex = 0;
    imgChkMethods = new Map();
    // Constants for Event Types
    static EVENT_CLICK = 'click';
    static EVENT_CHANGE = 'change';
    static EVENT_SELECT = 'select';
    static EVENT_DESELECT = 'deselect';
    // Methods for external use
    _onClick = null;
    _onChange = null;
    _onSelect = null;
    _onDeselect = null;
    constructor(element, option = {}) {
        this.init(element, option);
        ImgCheckBox.instances.push(this);
        if (ImgCheckBox.instances.length === 1) {
            reportInfo(`ImgCheckBox is loaded, version: ${ImgCheckBox.version}`);
        }
    }
    /**
     * Initialization
     */
    init(element, option) {
        let elems = Utils.getElem(element, 'all');
        if (!elems)
            Utils.throwError('Element not found');
        this.element = Array.isArray(elems) ? elems : (elems instanceof NodeList ? Array.from(elems) : [elems]);
        if (this.element.length === 0)
            Utils.throwError('Element not found');
        // Replace default options with user defined options
        this.options = Utils.deepMerge({}, defaults, option);
        // Set event handlers' callback if provided
        this._onClick = option.onClick || null;
        this._onChange = option.onChange || null;
        this._onSelect = option.onSelect || null;
        this._onDeselect = option.onDeselect || null;
        // Call the onLoad callback if provided
        this.options?.onLoad?.();
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
            'transform': 'scale(1)',
            'filter': 'none',
            '-webkit-filter': 'grayscale(0)'
        }, {
            'filter': 'grayscale(1)',
            '-webkit-filter': 'grayscale(1)'
        }), scaleStyles = Utils.buildStyles('img', CHECK_MARK, {
            'transform': 'scale(1)'
        }, {
            'transform': 'scale(0.9)'
        }), scaleCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
            'transform': 'scale(0)'
        }, {
            'transform': 'scale(1)'
        }), fadeCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
            'opacity': '0'
        }, {
            'opacity': '1'
        });
        /* *** STYLESHEET STUFF *** */
        // Shove in the custom check mark
        if (options.checkMarkImage) {
            Utils.deepMerge(finalStyles, { 'span.imgCheckbox::before': { 'background-image': 'url(\'' + options.checkMarkImage + '\')' } });
        }
        // Give the checkmark dimensions
        let chkDimensions = options.checkMarkSize.split(' ');
        Utils.deepMerge(finalStyles, {
            'span.imgCheckbox::before': {
                'width': chkDimensions[0],
                'height': chkDimensions[chkDimensions.length - 1]
            }
        });
        // Give the checkmark a position
        Utils.deepMerge(finalStyles, { 'span.imgCheckbox::before': CHECKMARK_POSITION[options.checkMarkPosition] });
        // Fixed image sizes
        if (options.fixedImageSize && typeof options.fixedImageSize === 'string') {
            let imgDimensions = options.fixedImageSize.split(' ');
            Utils.deepMerge(finalStyles, {
                'span.imgCheckbox img': {
                    'width': imgDimensions[0],
                    'height': imgDimensions[imgDimensions.length - 1]
                }
            });
        }
        let conditionalExtend = [
            {
                doExtension: options.graySelected,
                style: grayscaleStyles
            },
            {
                doExtension: options.scaleSelected,
                style: scaleStyles
            },
            {
                doExtension: options.scaleCheckMark,
                style: scaleCheckMarkStyles
            },
            {
                doExtension: options.fadeCheckMark,
                style: fadeCheckMarkStyles
            }
        ];
        conditionalExtend.forEach(function (extension) {
            if (extension.doExtension) {
                Utils.deepMerge(finalStyles, extension.style);
            }
        });
        Utils.deepMerge(defaultStyles, Utils.buildStyles('', CHECK_MARK, {
            '': { 'border-color': '#ccc' },
            'img': {},
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
                    this.triggerEvent(ImgCheckBox.EVENT_DESELECT, wrapper);
                },
                select: () => {
                    Utils.changeSelection(wrapper, CHK_SELECT, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.triggerEvent(ImgCheckBox.EVENT_SELECT, wrapper);
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
                let inputElemValue = options.inputValueAttribute ? element.getAttribute(options.inputValueAttribute) || '' : '';
                if (formElement) {
                    let hiddenElementId = 'hEI' + id + '-' + index;
                    const parentElement = element.parentElement;
                    if (parentElement && 'dataset' in parentElement) {
                        parentElement.dataset.hiddenElementId = hiddenElementId;
                    }
                    let imgName = element.getAttribute('name') || element.src.match(/\/([^\/]+)\.\w+$/)?.[1] || '';
                    let inputElem = document.createElement('input');
                    inputElem.type = 'checkbox';
                    inputElem.name = imgName;
                    inputElem.className = hiddenElementId;
                    inputElem.style.display = 'none';
                    inputElem.value = inputElemValue;
                    formElement.appendChild(inputElem);
                }
                else if (options.debugMessages) {
                    console.warn('ImgCheckBox: no form found (looks for form by default)');
                }
            }
        }
        // Preselect elements
        if (Array.isArray(this.options.preselect)) {
            this.options.preselect.forEach((index) => {
                if (index >= 0 && index < wrapperElements.length) {
                    const selectMethod = this.imgChkMethods.get(wrapperElements[index])?.select;
                    selectMethod?.();
                }
            });
        }
        else if (this.options.preselect === true) {
            wrapperElements.forEach(el => {
                const selectMethod = this.imgChkMethods.get(el)?.select;
                selectMethod?.();
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
                            const selectMethod = this.imgChkMethods.get(currentEl)?.select;
                            selectMethod?.();
                            this.triggerEvent(ImgCheckBox.EVENT_CLICK, currentEl, true);
                            this.triggerEvent(ImgCheckBox.EVENT_CHANGE, currentEl, true);
                        }
                    }
                }
                else {
                    const isSelected = Utils.changeSelection(el, CHK_TOGGLE, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.triggerEvent(ImgCheckBox.EVENT_CLICK, el, isSelected);
                    isSelected ? this.triggerEvent(ImgCheckBox.EVENT_SELECT, el) : this.triggerEvent(ImgCheckBox.EVENT_DESELECT, el);
                }
                lastClicked = el;
            });
            el.addEventListener('change', (e) => {
                const customEvent = e;
                this.triggerEvent(ImgCheckBox.EVENT_CHANGE, el, customEvent.detail.isSelected);
            });
        });
        return this;
    }
    // Trigger event
    triggerEvent(eventType, element, isSelected) {
        switch (eventType) {
            case ImgCheckBox.EVENT_CLICK:
                if (isSelected !== undefined) {
                    this._onClick?.(element, isSelected);
                }
                break;
            case ImgCheckBox.EVENT_CHANGE:
                if (isSelected !== undefined) {
                    this._onChange?.(element, isSelected);
                }
                break;
            case ImgCheckBox.EVENT_SELECT:
                this._onSelect?.(element);
                break;
            case ImgCheckBox.EVENT_DESELECT:
                this._onDeselect?.(element);
                break;
            default:
                Utils.throwError(`Unsupported event type: ${eventType}`);
        }
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
        this.element[index].imgChkSelect?.();
    }
    deselect(index) {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.element[index].imgChkDeselect?.();
    }
    selectAll() {
        this.element.forEach(el => el.imgChkSelect?.());
    }
    deselectAll() {
        this.element.forEach(el => el.imgChkDeselect?.());
    }
    destroy() {
        let id = ImgCheckBox.instances.indexOf(this);
        if (id < 0) {
            Utils.throwError('ImgCheckBox instance not found');
            return;
        }
        Utils.removeStylesheet(id.toString());
        this.element.forEach(element => {
            let wrapper = element.parentNode;
            if (wrapper && wrapper.classList.contains('imgCheckbox' + id)) {
                wrapper.parentNode?.insertBefore(element, wrapper);
                wrapper.parentNode?.removeChild(wrapper);
            }
        });
        ImgCheckBox.instances.splice(id, 1);
    }
    getChecked() {
        return this.element.filter(el => el.parentElement?.classList.contains(CHECK_MARK));
    }
    getUnchecked() {
        return this.element.filter(el => !el.parentElement?.classList.contains(CHECK_MARK));
    }
    // Methods for external use
    set onClick(callback) {
        this._onClick = callback;
    }
    set onChange(callback) {
        this._onChange = callback;
    }
    set onSelect(callback) {
        this._onSelect = callback;
    }
    set onDeselect(callback) {
        this._onDeselect = callback;
    }
    get length() {
        return this.element.length;
    }
    static get constants() {
        return {
            CHECK_MARK: CHECK_MARK,
            CHK_DESELECT: CHK_DESELECT,
            CHK_TOGGLE: CHK_TOGGLE,
            CHK_SELECT: CHK_SELECT,
        };
    }
}

export { ImgCheckBox as default };
