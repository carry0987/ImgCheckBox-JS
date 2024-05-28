import Utils from '../module/utils-ext';
import reportInfo from '../module/report';
import { ImgCheckBoxOptions, ConstantsType, ChangeEventDetail } from '../interface/interfaces';
import { ImgCheckBoxEvents } from '../interface/events';
import { CHK_TOGGLE, CHK_SELECT, CHK_DESELECT, CHECK_MARK, CHECKMARK_POSITION, defaults, defaultStyles } from './config';
import { EventEmitter } from '@carry0987/event-emitter';

class ImgCheckBox extends EventEmitter<ImgCheckBoxEvents> {
    private static instances: ImgCheckBox[] = [];
    private static version: string = '__version__';
    private element: HTMLElement[] = [];
    private options: ImgCheckBoxOptions = defaults;
    private targetIndex: number = 0;
    private imgChkMethods = new Map<HTMLElement, { deselect: () => void; select: () => void }>();

    constructor(element: string, option: Partial<ImgCheckBoxOptions>) {
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
    private initialize(element: string, option: Partial<ImgCheckBoxOptions>): void {
        let elems = Utils.getElem(element, 'all');
        if (!elems) Utils.throwError('Element not found');
        this.element = Array.isArray(elems) ? elems : (elems instanceof NodeList ? Array.from(elems) : [elems]) as HTMLElement[];
        if (this.element.length === 0) Utils.throwError('Element not found');
        // Replace default options with user defined options
        this.options = Utils.deepMerge({} as ImgCheckBoxOptions, defaults, option);
        // Create the imgCheckbox
        this.createImgCheckbox(ImgCheckBox.instances.length);
    }

    /**
     * Main function for creating the imgCheckbox
     */
    private createImgCheckbox(id: number): ImgCheckBox {
        const elements: HTMLElement[] = this.element;
        const options: ImgCheckBoxOptions = this.options;
        let lastClicked: HTMLElement | null = null;

        // Define the finalStyles object that will be aggregated and used later
        let finalStyles: { [key: string]: any } = {};
        // Define wrapper elements array
        let wrapperElements: HTMLElement[] = [];

        // Generate grayscale styles if enabled
        let grayscaleStyles = Utils.buildStyles('img', CHECK_MARK, {
            'transform': 'scale(1)',
            'filter': 'none',
            '-webkit-filter': 'grayscale(0)'
        }, {
            'filter': 'grayscale(1)',
            '-webkit-filter': 'grayscale(1)'
        });

        let scaleStyles = Utils.buildStyles('img', CHECK_MARK, {
            'transform': 'scale(1)'
        }, {
            'transform': 'scale(0.9)'
        });

        let scaleCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
            'transform': 'scale(0)'
        }, {
            'transform': 'scale(1)'
        });

        let fadeCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
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
            { doExtension: options.graySelected, style: grayscaleStyles },
            { doExtension: options.scaleSelected, style: scaleStyles },
            { doExtension: options.scaleCheckMark, style: scaleCheckMarkStyles },
            { doExtension: options.fadeCheckMark, style: fadeCheckMarkStyles }
        ];

        conditionalExtend.forEach(extension => {
            if (extension.doExtension) {
                Utils.deepMerge(finalStyles, extension.style);
            }
        });

        Utils.deepMerge(defaultStyles, Utils.buildStyles('', CHECK_MARK, {
            '': {'border-color': '#ccc'},
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
            if ((element.parentNode as Element)?.classList.contains('imgCheckbox' + id)) continue;
            // If the element is not an image, skip it
            if (element.tagName.toLowerCase() !== 'img') continue;

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
                },
                select: () => {
                    Utils.changeSelection(wrapper, CHK_SELECT, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.emit('select', wrapper);
                }
            };
            this.imgChkMethods.set(wrapper, methods);
            if (wrapper.firstChild && wrapper.firstChild instanceof HTMLElement) {
                this.imgChkMethods.set(wrapper.firstChild as HTMLElement, methods);
            }

            // Inject into form if necessary
            if (options.addToForm instanceof Element || options.addToForm === true) {
                let formElement: Element | null = null;
                if (options.addToForm === true) {
                    formElement = element.closest('form');
                } else {
                    formElement = options.addToForm as HTMLFormElement;
                }
                let inputElemValue = options.inputValueAttribute ? element.getAttribute(options.inputValueAttribute) || '' : '';
                if (formElement) {
                    let hiddenElementId = 'hEI' + id + '-' + index;
                    const parentElement = element.parentElement;
                    if (parentElement && 'dataset' in parentElement) {
                        parentElement.dataset.hiddenElementId = hiddenElementId;
                    }
                    let imgName = (element as HTMLImageElement).getAttribute('name') || (element as HTMLImageElement).src.match(/\/([^\/]+)\.\w+$/)?.[1] || '';
                    let inputElem = document.createElement('input');
                    inputElem.type = 'checkbox';
                    inputElem.name = imgName;
                    inputElem.className = hiddenElementId;
                    inputElem.style.display = 'none';
                    inputElem.value = inputElemValue;
                    formElement.appendChild(inputElem);
                } else if (options.debugMessages) {
                    console.warn('[ImgCheckBox]: No form found (looks for form by default)');
                }
            }
        }

        // Preselect elements
        if (Array.isArray(this.options.preselect)) {
            this.options.preselect.forEach(index => {
                if (index >= 0 && index < wrapperElements.length) {
                    this.imgChkMethods.get(wrapperElements[index])?.select();
                }
            });
        } else if (this.options.preselect === true) {
            wrapperElements.forEach(el => {
                this.imgChkMethods.get(el)?.select();
            });
        }

        // Set up event handler
        wrapperElements.forEach(el => {
            el.addEventListener('click', (e: MouseEvent) => {
                const isShiftClick = options.enableShiftClick && !options.radio && e.shiftKey;
                if (isShiftClick && lastClicked) {
                    let lastIdx = wrapperElements.indexOf(lastClicked);
                    let thisIdx = wrapperElements.indexOf(el);
                    if (lastIdx > thisIdx) [lastIdx, thisIdx] = [thisIdx, lastIdx];
                    for (let between = lastIdx; between <= thisIdx; between++) {
                        const currentEl = wrapperElements[between];
                        if (!currentEl.classList.contains(CHECK_MARK)) {
                            this.imgChkMethods.get(currentEl)?.select();
                            this.emit('click', currentEl, true);
                            this.emit('change', currentEl, true);
                        }
                    }
                } else {
                    const isSelected = Utils.changeSelection(el, CHK_TOGGLE, options.addToForm, options.radio, options.canDeselect, wrapperElements, ImgCheckBox.constants);
                    this.emit('click', el, isSelected);
                    if (isSelected) {
                        this.emit('select', el);
                    } else {
                        this.emit('deselect', el);
                    }
                }
                lastClicked = el;
            });

            el.addEventListener('change', (e: Event) => {
                const customEvent = e as CustomEvent<ChangeEventDetail>;
                this.emit('change', el, customEvent.detail.isSelected);
            });
        });

        return this;
    }

    public target(index: number): ImgCheckBox | void {
        if (index >= 0 && index < this.element.length) {
            this.targetIndex = index;
            return this;
        } else {
            Utils.throwError('The given index is out of range.');
        }
    }

    public state(): boolean {
        const element = Utils.getElem(this.element[this.targetIndex]) as HTMLElement;
        const parentElement = element.parentNode as HTMLElement;
        return parentElement && parentElement.classList.contains(CHECK_MARK);
    }

    public select(index: number): void {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.imgChkMethods.get(this.element[index])?.select();
    }

    public deselect(index: number): void {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.imgChkMethods.get(this.element[index])?.deselect();
    }

    public selectAll(): void {
        this.element.forEach(el => {
            this.imgChkMethods.get(el)?.select();
        });
        this.emit('selectAll', this.element);
    }

    public deselectAll(): void {
        this.element.forEach(el => {
            this.imgChkMethods.get(el)?.deselect();
        });
        this.emit('deselectAll');
    }

    public destroy(): void {
        let id = ImgCheckBox.instances.indexOf(this);
        if (id < 0) {
            Utils.throwError('Instance not found');
            return;
        }
        Utils.removeStylesheet(id.toString());
        this.element.forEach(element => {
            let wrapper = element.parentNode as HTMLElement;
            if (wrapper && wrapper.classList.contains('imgCheckbox' + id)) {
                wrapper.parentNode?.insertBefore(element, wrapper);
                wrapper.parentNode?.removeChild(wrapper);
            }
        });
        this.clearListener();
        ImgCheckBox.instances.splice(id, 1);
    }

    public getChecked(): HTMLElement[] {
        return this.element.filter(el => el.parentElement?.classList.contains(CHECK_MARK));
    }

    public getUnchecked(): HTMLElement[] {
        return this.element.filter(el => !el.parentElement?.classList.contains(CHECK_MARK));
    }

    public get length(): number {
        return this.element.length;
    }

    private static get constants(): ConstantsType {
        return {
            CHECK_MARK: CHECK_MARK,
            CHK_DESELECT: CHK_DESELECT,
            CHK_TOGGLE: CHK_TOGGLE,
            CHK_SELECT: CHK_SELECT,
        };
    }
}

export { ImgCheckBox as default };
export * from '../interface/interfaces';
