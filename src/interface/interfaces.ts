export interface ImgCheckBoxOptions {
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

export interface CheckmarkPositionStyles {
    [position: string]: {
        top?: string | number;
        left?: string | number;
        right?: string | number;
        bottom?: string | number;
        margin?: string | number;
    };
}

export interface ConstantsType {
    CHECK_MARK: string;
    CHK_DESELECT: number;
    CHK_TOGGLE: number;
    CHK_SELECT: number;
}

export interface StylesObject {
    [selector: string]: string | number | StylesObject;
}
