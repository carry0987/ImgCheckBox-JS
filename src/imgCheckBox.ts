import Utils from './utils-ext';
import reportInfo from './report';
import { ImgCheckBoxOptions, HTMLElementWithSelection, ImgCheckBoxInstance, ConstantsType, ChangeEventDetail } from './interface/interfaces';
import { CHK_TOGGLE, CHK_SELECT, CHK_DESELECT, CHECK_MARK, CHECKMARK_POSITION, defaults, defaultStyles } from './config';

declare global {
    interface Array<T> {
        push(...items: ImgCheckBoxInstance[]): number;
    }
}

class ImgCheckBox {
    private static instances: ImgCheckBox[] = [];
    private static version: string = '__version__';
    private element!: HTMLElementWithSelection[];
    private options!: ImgCheckBoxOptions;
    private targetIndex: number = 0;
    private imgChkMethods = new Map<HTMLElement, { deselect: () => void; select: () => void }>();

    constructor(element: string | Element, option: ImgCheckBoxOptions = {}) {
        this.init(element, option);
        ImgCheckBox.instances.push(this);

        if (ImgCheckBox.instances.length === 1) {
            reportInfo(`ImgCheckBox is loaded, version: ${ImgCheckBox.version}`);
        }
    }

    /**
     * Initialization
     */
    init(element: string | Element, option: ImgCheckBoxOptions): void {
        let elems = Utils.getElem(element, 'all');
        if (!elems) Utils.throwError('Element not found');
        this.element = Array.isArray(elems) ? elems : (elems instanceof NodeList ? Array.from(elems) : [elems]) as HTMLElementWithSelection[];
        if (this.element.length === 0) Utils.throwError('Element not found');
        // Replace default options with user defined options
        this.options = Utils.deepMerge({}, defaults, option);
        // Call the onLoad callback if provided
        this.options?.onLoad?.();
        this.createImgCheckbox(ImgCheckBox.instances.length);
    }

    /**
     * Main function for creating the imgCheckbox
     */
    private createImgCheckbox(id: number): ImgCheckBox {
        const elements: HTMLElementWithSelection[] = this.element;
        const options: ImgCheckBoxOptions = this.options;
        let lastClicked: HTMLElementWithSelection | null = null;

        // Define the finalStyles object that will be aggregated and used later
        let finalStyles: { [key: string]: any } = {};
        // Define wrapper elements array
        let wrapperElements: HTMLElementWithSelection[] = [];

        // Generate grayscale styles if enabled
        let grayscaleStyles = Utils.buildStyles('img', CHECK_MARK, {
                'transform': 'scale(1)',
                'filter': 'none',
                '-webkit-filter': 'grayscale(0)'
            }, {
                'filter': 'grayscale(1)',
                '-webkit-filter': 'grayscale(1)'
            }),
            scaleStyles = Utils.buildStyles('img', CHECK_MARK, {
                'transform': 'scale(1)'
            }, {
                'transform': 'scale(0.9)'
            }),
            scaleCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
                'transform': 'scale(0)'
            }, {
                'transform': 'scale(1)'
            }),
            fadeCheckMarkStyles = Utils.buildStyles('::before', CHECK_MARK, {
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
        let chkDimensions = options.checkMarkSize!.split(' ');
        Utils.deepMerge(finalStyles, {
            'span.imgCheckbox::before': {
                'width': chkDimensions[0],
                'height': chkDimensions[chkDimensions.length - 1]
            }
        });
        // Give the checkmark a position
        Utils.deepMerge(finalStyles, { 'span.imgCheckbox::before': CHECKMARK_POSITION[options.checkMarkPosition!] });
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
        conditionalExtend.forEach(function(extension) {
            if (extension.doExtension) {
                Utils.deepMerge(finalStyles, extension.style);
            }
        });

        Utils.deepMerge(defaultStyles, Utils.buildStyles('', CHECK_MARK, {
            '': {'border-color': '#ccc'},
            'img': {},
            '::before': {}
        }));
        finalStyles = Utils.deepMerge({}, defaultStyles, finalStyles, options.styles!);
        // Now that we've built up our styles, inject them
        Utils.injectStylesheet(finalStyles, id.toString());

        // Loop through each element
        for (let index = 0; index < elements.length; index++) {
            let element = elements[index] as HTMLElementWithSelection;
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
                    Utils.changeSelection(wrapper, CHK_DESELECT, options.addToForm!, options.radio!, options.canDeselect!, wrapperElements, ImgCheckBox.constants);
                    options.onDeselect?.(wrapper);
                },
                select: () => {
                    Utils.changeSelection(wrapper, CHK_SELECT, options.addToForm!, options.radio!, options.canDeselect!, wrapperElements, ImgCheckBox.constants);
                    options.onSelect?.(wrapper);
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
                    formElement = options.addToForm;
                }
                if (formElement) {
                    let hiddenElementId = 'hEI' + id + '-' + index;
                    element.dataset.hiddenElementId = hiddenElementId;
                    let imgName = (element as HTMLImageElement).getAttribute('name') || (element as HTMLImageElement).src.match(/\/([^\/]+)\.\w+$/)?.[1] || '';
                    let inputElem = document.createElement('input');
                    inputElem.type = 'checkbox';
                    inputElem.name = imgName;
                    inputElem.className = hiddenElementId;
                    inputElem.style.display = 'none';
                    inputElem.checked = wrapper.classList.contains(CHECK_MARK);
                    formElement.appendChild(inputElem);
                } else if (options.debugMessages) {
                    console.warn('ImgCheckBox: no form found (looks for form by default)');
                }
            }
        }

        // Preselect elements
        if (Array.isArray(this.options.preselect)) {
            this.options.preselect.forEach((index) => {
                if (index >= 0 && index < wrapperElements.length) {
                    wrapperElements[index].classList.add(CHECK_MARK);
                }
            });
        } else if (this.options.preselect === true) {
            wrapperElements.forEach(el => el.classList.add(CHECK_MARK));
        }

        // Set up event handler
        wrapperElements.forEach((el) => {
            el.addEventListener('click', (e: MouseEvent) => {
                const isShiftClick = options.enableShiftClick && !options.radio && e.shiftKey;
                if (isShiftClick && lastClicked) {
                    let lastIdx = wrapperElements.indexOf(lastClicked);
                    let thisIdx = wrapperElements.indexOf(el);
                    if (lastIdx > thisIdx) [lastIdx, thisIdx] = [thisIdx, lastIdx];
                    for (let between = lastIdx; between <= thisIdx; between++) {
                        const currentEl = wrapperElements[between];
                        if (!currentEl.classList.contains(CHECK_MARK)) {
                            currentEl.classList.add(CHECK_MARK);
                            options.onClick && options.onClick(currentEl, true);
                            options.onChange && options.onChange(currentEl, true);
                        }
                    }
                } else {
                    const isSelected = Utils.changeSelection(el, CHK_TOGGLE, options.addToForm!, options.radio!, options.canDeselect!, wrapperElements, ImgCheckBox.constants);
                    options.onClick && options.onClick(el, isSelected);
                    isSelected ? options.onSelect?.(el) : options.onDeselect?.(el);
                }
                lastClicked = el;
            });
            el.addEventListener('change', (e: Event) => {
                const customEvent = e as CustomEvent<ChangeEventDetail>;
                options.onChange && options.onChange(el, customEvent.detail.isSelected);
            });
        });

        return this;
    }

    target(index: number): ImgCheckBox | void {
        if (index >= 0 && index < this.element.length) {
            this.targetIndex = index;
            return this;
        } else {
            Utils.throwError('The given index is out of range.');
        }
    }

    state(): boolean {
        const element = Utils.getElem(this.element[this.targetIndex]) as HTMLElement;
        const parentElement = element.parentNode as HTMLElement;
        return parentElement && parentElement.classList.contains(CHECK_MARK);
    }

    select(index: number): void {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.element[index].imgChkSelect?.();
    }

    deselect(index: number): void {
        if (index < 0 || index >= this.element.length) {
            Utils.throwError('The given index is out of range.');
            return;
        }
        this.element[index].imgChkDeselect?.();
    }

    selectAll(): void {
        this.element.forEach(el => el.imgChkSelect?.());
    }

    deselectAll(): void {
        this.element.forEach(el => el.imgChkDeselect?.());
    }

    destroy(): void {
        let id = ImgCheckBox.instances.indexOf(this);
        if (id < 0) {
            Utils.throwError('ImgCheckBox instance not found');
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
        ImgCheckBox.instances.splice(id, 1);
    }

    static get constants(): ConstantsType {
        return {
            CHECK_MARK: CHECK_MARK,
            CHK_DESELECT: CHK_DESELECT,
            CHK_TOGGLE: CHK_TOGGLE,
            CHK_SELECT: CHK_SELECT,
        };
    }

    static get length(): number {
        return this.instances.length;
    }
}

export default ImgCheckBox;
