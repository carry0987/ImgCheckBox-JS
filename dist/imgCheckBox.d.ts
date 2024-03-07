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
interface CheckmarkPositionStyles {
    [position: string]: {
        top?: string | number;
        left?: string | number;
        right?: string | number;
        bottom?: string | number;
        margin?: string | number;
    };
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
interface ChangeEventDetail {
    isSelected: boolean;
}
interface StylesObject {
    [selector: string]: string | number | StylesObject;
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
    private static readonly EVENT_CLICK;
    private static readonly EVENT_CHANGE;
    private static readonly EVENT_SELECT;
    private static readonly EVENT_DESELECT;
    private onClickCallback;
    private onChangeCallback;
    private onSelectCallback;
    private onDeselectCallback;
    constructor(element: string, option: Partial<ImgCheckBoxOptions>);
    /**
     * Initialization
     */
    private init;
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
    private static get constants();
}

export { type ChangeEventDetail, type CheckmarkPositionStyles, type ConstantsType, type HTMLElementWithSelection, type ImgCheckBoxInstance, type ImgCheckBoxOptions, type StylesObject, ImgCheckBox as default };
