interface ImgCheckBoxOptions {
    checkMarkImage: string;
    enableShiftClick: boolean;
    graySelected: boolean;
    scaleSelected: boolean;
    fixedImageSize: boolean | string;
    checkMark: string;
    checkMarkSize: string;
    checkMarkPosition: string;
    scaleCheckMark: boolean;
    fadeCheckMark: boolean;
    addToForm: boolean | Element;
    inputValueAttribute: string | null;
    preselect: boolean | number[];
    radio: boolean;
    canDeselect: boolean;
    styles: object;
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
    static readonly EVENT_CLICK = "click";
    static readonly EVENT_CHANGE = "change";
    static readonly EVENT_SELECT = "select";
    static readonly EVENT_DESELECT = "deselect";
    private onClickCallback;
    private onChangeCallback;
    private onSelectCallback;
    private onDeselectCallback;
    constructor(element: string | Element, option: Partial<ImgCheckBoxOptions>);
    /**
     * Initialization
     */
    init(element: string | Element, option: Partial<ImgCheckBoxOptions>): void;
    /**
     * Main function for creating the imgCheckbox
     */
    private createImgCheckbox;
    private triggerEvent;
    target(index: number): ImgCheckBox | void;
    state(): boolean;
    select(index: number): void;
    deselect(index: number): void;
    selectAll(): void;
    deselectAll(): void;
    destroy(): void;
    getChecked(): HTMLElementWithSelection[];
    getUnchecked(): HTMLElementWithSelection[];
    set onClick(callback: (element: HTMLElementWithSelection) => void);
    set onChange(callback: (element: HTMLElementWithSelection, isSelected: boolean) => void);
    set onSelect(callback: (element: HTMLElementWithSelection) => void);
    set onDeselect(callback: (element: HTMLElementWithSelection) => void);
    get length(): number;
    static get constants(): ConstantsType;
}

export { ImgCheckBox as default };
