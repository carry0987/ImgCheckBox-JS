import Util from './util';
import throwError from './error';
import reportInfo from './report';

class ImgCheckBox {
    constructor(element, option = {}) {
        this.init(element, option);
        ImgCheckBox.instance.push(this);

        if (ImgCheckBox.instance.length === 1) reportInfo(`ImgCheckBox is loaded, version: ${ImgCheckBox.version}`);
    }

    static CHK_TOGGLE = 0;
    static CHK_SELECT = 1;
    static CHK_DESELECT = 2;
    static CHECK_MARK = 'imgChked';
    static CHECKMARK_POSITION = {
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
        },
    };
    static defaults = {
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
        addToForm: true,
        preselect: [],
        radio: false,
        canDeselect: false,
        styles: {},
        onLoad: false,
        onClick: false,
        onSelect: null,
        onDeselect: null,
        debugMessages: false,
    };
    static defaultStyles = {
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
            'content':'\'\'',
            'color': 'white',
            'font-weight': 'bold',
            'border-radius': '50%',
            'position': 'absolute',
            'margin': '0.5%',
            'z-index': '1',
            'text-align': 'center',
            'transition-duration': '300ms',
        }
    }

    /**
     * Initialization
     */
    init(element, option) {
        let elem = Util.getElem(element, 'all');
        if (!elem || elem.length === 0) throwError('Element not found');
        if (!option) throwError('Option not found');
        ImgCheckBox.CHECK_MARK = option.checkMark || ImgCheckBox.CHECK_MARK;
        this.element = elem;
        this.targetElement = element;
        // Replace default options with user defined options
        this.options = Util.deepMerge({}, ImgCheckBox.defaults, option);
        if (this.options?.onLoad) {
            this.options.onLoad();
        }
        this.imgCheckboxClass(ImgCheckBox.instance.length);
    }

    /**
     * Main function for creating the imgCheckbox
     */
    imgCheckboxClass(id) {
        let elements = this.element,
            options = this.options;
        let lastClicked;
        let wrapperElement = [],
            finalStyles = {},
            grayscaleStyles = Util.buildStyles('img', ImgCheckBox.CHECK_MARK, {
                'transform': 'scale(1)',
                'filter': 'none',
                '-webkit-filter': 'grayscale(0)'
            }, {
                'filter': 'grayscale(1)',
                '-webkit-filter': 'grayscale(1)'
            }),
            scaleStyles = Util.buildStyles('img', ImgCheckBox.CHECK_MARK, {
                'transform': 'scale(1)'
            }, {
                'transform': 'scale(0.9)'
            }),
            scaleCheckMarkStyles = Util.buildStyles('::before', ImgCheckBox.CHECK_MARK, {
                'transform': 'scale(0)'
            }, {
                'transform': 'scale(1)'
            }),
            fadeCheckMarkStyles = Util.buildStyles('::before', ImgCheckBox.CHECK_MARK, {
                'opacity': '0'
            }, {
                'opacity': '1'
            });

        /* *** STYLESHEET STUFF *** */
        // Shove in the custom check mark
        if (options.checkMarkImage !== false) {
            Util.deepMerge(finalStyles, { 'span.imgCheckbox::before': { 'background-image': 'url(\'' + options.checkMarkImage + '\')' } });
        }
        // Give the checkmark dimensions
        let chkDimensions = options.checkMarkSize.split(' ');
        Util.deepMerge(finalStyles, {
            'span.imgCheckbox::before': {
                'width': chkDimensions[0],
                'height': chkDimensions[chkDimensions.length - 1]
            }
        });
        // Give the checkmark a position
        Util.deepMerge(finalStyles, { 'span.imgCheckbox::before': ImgCheckBox.CHECKMARK_POSITION[options.checkMarkPosition] });
        // Fixed image sizes
        if (options.fixedImageSize) {
            let imgDimensions = options.fixedImageSize.split(' ');
            Util.deepMerge(finalStyles, {
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
        conditionalExtend.forEach(function(extension) {
            if (extension.doExtension) {
                Util.deepMerge(finalStyles, extension.style);
            }
        });

        Util.deepMerge(ImgCheckBox.defaultStyles, Util.buildStyles('', ImgCheckBox.CHECK_MARK, {
            '': {'border-color': '#ccc'},
            'img': {},
            '::before': {}
        }));
        finalStyles = Util.deepMerge({}, ImgCheckBox.defaultStyles, finalStyles, options.styles);
        // Now that we've built up our styles, inject them
        Util.injectStylesheet(finalStyles, id);

        // Loop through each element
        for (let index = 0; index < elements.length; index++) {
            let element = elements[index];
            // If the element is already an imgCheckbox, skip it
            if (element.parentNode.classList.contains('imgCheckbox' + id)) continue;
            // If the element is not an image, skip it
            if (element.tagName.toLowerCase() !== 'img') continue;
            // If the element is not visible, skip it
            if (element.offsetWidth === 0 && element.offsetHeight === 0) continue;

            // Set img undraggable
            element.ondragstart = () => false;

            /* *** DOM STUFF *** */
            let wrapper = document.createElement('span');
            wrapper.className = 'imgCheckbox' + id;
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
            wrapperElement.push(wrapper);

            // Set up select/deselect functions
            wrapper.imgChkDeselect = () => {
                Util.changeSelection(wrapper, ImgCheckBox.CHK_DESELECT, options.addToForm, options.radio, options.canDeselect, wrapperElement, ImgCheckBox.constants);
                options.onDeselect?.(wrapper);
            }
            wrapper.imgChkSelect = () => {
                Util.changeSelection(wrapper, ImgCheckBox.CHK_SELECT, options.addToForm, options.radio, options.canDeselect, wrapperElement, ImgCheckBox.constants);
                options.onSelect?.(wrapper);
            }

            wrapper.firstChild.imgChkDeselect = () => {
                Util.changeSelection(wrapper, ImgCheckBox.CHK_DESELECT, options.addToForm, options.radio, options.canDeselect, wrapperElement, ImgCheckBox.constants);
                options.onDeselect?.(wrapper);
            }
            wrapper.firstChild.imgChkSelect = () => {
                Util.changeSelection(wrapper, ImgCheckBox.CHK_SELECT, options.addToForm, options.radio, options.canDeselect, wrapperElement, ImgCheckBox.constants);
                options.onSelect?.(wrapper);
            }

            // Inject into form if necessary
            if (options.addToForm instanceof Element || options.addToForm === true) {
                if (options.addToForm === true) {
                    let closestForm = element.closest('form');
                    options.addToForm = closestForm ? closestForm : false;
                }
                if (options.addToForm?.length && options.addToForm.length === 0) {
                    options.debugMessages ? reportInfo('imgCheckbox: no form found (looks for form by default)') : null;
                    options.addToForm = false;
                }
                if (options.addToForm) {
                    let hiddenElementId = 'hEI' + id + '-' + index;
                    element.parentNode.dataset.hiddenElementId = hiddenElementId;
                    let imgName = element.getAttribute('name');
                    imgName = imgName ? imgName : element.src.match(/\/(.*)\.[\w]+$/)[1];
                    let inputElem = document.createElement('input');
                    inputElem.setAttribute('type', 'checkbox');
                    inputElem.setAttribute('name', imgName);
                    inputElem.className = hiddenElementId;
                    inputElem.style.display = 'none';
                    inputElem.checked = element.parentNode.classList.contains(ImgCheckBox.CHECK_MARK);
                    options.addToForm.appendChild(inputElem);
                }
            }
        }

        // Preselect elements
        if (options.preselect === true || options.preselect.length > 0) {
            wrapperElement.forEach((el, index) => {
                if (options.preselect === true || options.preselect.indexOf(index) >= 0) {
                    el.classList.add(ImgCheckBox.CHECK_MARK);
                }
            });
        }

        // Set up event handler
        wrapperElement.forEach((el) => {
            el.addEventListener('click', (e) => {
                if (options.enableShiftClick && !options.radio && e.shiftKey && lastClicked) {
                    let lastIdx = wrapperElement.indexOf(lastClicked);
                    let thisIdx = wrapperElement.indexOf(el);
                    if (lastIdx > thisIdx) [lastIdx, thisIdx] = [thisIdx, lastIdx];
                    for (let between = lastIdx; between <= thisIdx; between++) {
                        if (!wrapperElement[between].classList.contains(ImgCheckBox.CHECK_MARK)) {
                            wrapperElement[between].imgChkSelect();
                            options.onClick && options.onClick(wrapperElement[between], true);
                            options.onChange && options.onChange(wrapperElement[between], true);
                        }
                    }
                } else {
                    const isSelected = Util.changeSelection(el, ImgCheckBox.CHK_TOGGLE, options.addToForm, options.radio, options.canDeselect, wrapperElement, ImgCheckBox.constants);
                    options.onClick && options.onClick(el, isSelected);
                    isSelected ? options.onSelect?.(el) : options.onDeselect?.(el);
                }
                // Store last clicked element
                lastClicked = el;
            });
            el.addEventListener('change', (e) => {
                options.onChange && options.onChange(el, e.detail.isSelected);
            });
        });

        return this;
    }

    target(index) {
        if (index >= 0 && index < this.element.length) {
            this.targetIndex = index;
            return this;
        } else {
            return throwError('The given index is out of range.');
        } 
    }

    state() {
        const element = Util.getElem(this.element[this.targetIndex]);
        return element.parentNode.classList.contains(ImgCheckBox.CHECK_MARK) ? true : false;
    }

    select(index) {
        if (index < 0 || index >= this.element.length) {
            return throwError('The given index is out of range.');
        }
        if (this.element[index].imgChkSelect) {
            this.element[index].imgChkSelect();
        }
    }

    deselect(index) {
        if (index < 0 || index >= this.element.length) {
            return throwError('The given index is out of range.');
        }
        if (this.element[index].imgChkDeselect) {
            this.element[index].imgChkDeselect();
        }
    }

    selectAll() {
        for (let i = 0; i < this.element.length; i++) {
            if (this.element[i].imgChkSelect) {
                this.element[i].imgChkSelect();
            }
        }
    }

    deselectAll() {
        for (let i = 0; i < this.element.length; i++) {
            if (this.element[i].imgChkDeselect) {
                this.element[i].imgChkDeselect();
            }
        }
    }

    destroy() {
        let elements = this.element;
        let id = ImgCheckBox.instance.indexOf(this);
        if (id < 0) return throwError('ImgCheckBox instance not found');
        Util.removeStylesheet(id);
        for (let index = 0; index < elements.length; index++) {
            let element = elements[index];
            if (element.parentNode.classList.contains('imgCheckbox' + id)) {
                let wrapper = element.parentNode;
                wrapper.parentNode?.insertBefore(element, wrapper);
                wrapper.parentNode?.removeChild(wrapper);
            }
        }
        ImgCheckBox.instance.splice(id, 1);
    }

    static get constants() {
        return {
            CHECK_MARK: ImgCheckBox.CHECK_MARK,
            CHK_DESELECT: ImgCheckBox.CHK_DESELECT,
            CHK_TOGGLE: ImgCheckBox.CHK_TOGGLE,
            CHK_SELECT: ImgCheckBox.CHK_SELECT,
        };
    }

    static get length() {
        return this.element.length;
    }
}

/* Common */
ImgCheckBox.version = '__version__';
ImgCheckBox.instance = [];

export default ImgCheckBox;
