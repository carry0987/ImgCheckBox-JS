interface ImgCheckBoxOptions {
    checkMarkImage?: string;
    enableShiftClick?: boolean;
    graySelected?: boolean;
    scaleSelected?: boolean;
    fixedImageSize?: boolean | string;
    checkMark?: string;
    checkMarkSize?: string;
    checkMarkPosition?: string;
    scaleCheckMark?: boolean;
    fadeCheckMark?: boolean;
    addToForm?: boolean | Element;
    inputValueAttribute?: string | null;
    preselect?: boolean | number[];
    radio?: boolean;
    canDeselect?: boolean;
    styles?: object;
    onLoad?: () => void;
    onClick?: (wrapper: Element, isSelected: boolean) => void;
    onChange?: (wrapper: Element, isSelected: boolean) => void;
    onSelect?: (wrapper: Element) => void;
    onDeselect?: (wrapper: Element) => void;
    debugMessages?: boolean;
}
interface HTMLElementWithSelection extends HTMLElement {
    imgChkSelect?: () => void;
    imgChkDeselect?: () => void;
}
interface ImgCheckBoxInstance {
    element: HTMLElementWithSelection[];
    options: ImgCheckBoxOptions;
}
interface ConstantsType {
    CHECK_MARK: string;
    CHK_DESELECT: number;
    CHK_TOGGLE: number;
    CHK_SELECT: number;
}

declare global {
    interface Array<T> {
        push(...items: ImgCheckBoxInstance[]): number;
    }
}
declare class ImgCheckBox {
    private static instances;
    private static version;
    private element;
    private options;
    private targetIndex;
    private imgChkMethods;
    constructor(element: string | Element, option?: ImgCheckBoxOptions);
    /**
     * Initialization
     */
    init(element: string | Element, option: ImgCheckBoxOptions): void;
    /**
     * Main function for creating the imgCheckbox
     */
    private createImgCheckbox;
    target(index: number): ImgCheckBox | void;
    state(): boolean;
    select(index: number): void;
    deselect(index: number): void;
    selectAll(): void;
    deselectAll(): void;
    destroy(): void;
    getChecked(): HTMLElementWithSelection[];
    getUnchecked(): HTMLElementWithSelection[];
    get length(): number;
    static get constants(): ConstantsType;
}

export { ImgCheckBox as default };
