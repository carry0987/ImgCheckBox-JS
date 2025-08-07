import { EventEmitter } from '@carry0987/event-emitter';

interface ImgCheckBoxEvents {
    click: (element: HTMLElement, isSelected?: boolean) => void;
    change: (element: HTMLElement, isSelected?: boolean) => void;
    select: (element: HTMLElement) => void;
    deselect: (element: HTMLElement) => void;
    selectAll: (elements: HTMLElement[]) => void;
    deselectAll: () => void;
}

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

declare class ImgCheckBox extends EventEmitter<ImgCheckBoxEvents> {
    private static instances;
    private static version;
    private element;
    private options;
    private targetIndex;
    private imgChkMethods;
    constructor(element: string, option?: Partial<ImgCheckBoxOptions>);
    /**
     * Initialization
     */
    private initialize;
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
    getChecked(): HTMLElement[];
    getUnchecked(): HTMLElement[];
    get length(): number;
    private static get constants();
}

export { ImgCheckBox };
export type { CheckmarkPositionStyles, ImgCheckBoxOptions };
