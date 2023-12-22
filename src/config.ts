import { ImgCheckBoxOptions, CheckmarkPositionStyles } from './interface/interfaces';

export const CHK_TOGGLE: number = 0;
export const CHK_SELECT: number = 1;
export const CHK_DESELECT: number = 2;
export const CHECK_MARK: string = 'imgChked';
export const CHECKMARK_POSITION: CheckmarkPositionStyles = {
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

export const defaults: ImgCheckBoxOptions = {
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
    debugMessages: false,
};

export const defaultStyles = {
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
