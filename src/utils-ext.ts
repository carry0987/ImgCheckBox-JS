import {
    deepMerge as _deepMerge,
    setStylesheetId as _setStylesheetId,
    setReplaceRule as _setReplaceRule,
    injectStylesheet as _injectStylesheet,
    removeStylesheet as _removeStylesheet,
    errorUtils as _errorUtils,
    domUtils as _domUtils
} from '@carry0987/utils';

import { ConstantsType, StylesObject, ChangeEventDetail } from './interface/interfaces';

class Utils {
    static throwError = _errorUtils.throwError;
    static deepMerge = _deepMerge;
    static setStylesheetId = _setStylesheetId;
    static setReplaceRule = _setReplaceRule;
    static injectStylesheet = _injectStylesheet;
    static removeStylesheet = _removeStylesheet;
    static getElem = _domUtils.getElem;

    static changeSelection(
        chosenElement: HTMLElement,
        howToModify: number,
        addToForm: Element | boolean,
        radio: boolean,
        canDeselect: boolean,
        wrapperElements: HTMLElement[],
        constants: ConstantsType
    ): boolean {
        const { CHECK_MARK, CHK_DESELECT, CHK_TOGGLE, CHK_SELECT } = constants;
        const isSelected = chosenElement.classList.contains(CHECK_MARK);
        if (radio && (howToModify !== CHK_DESELECT)) {
            wrapperElements.forEach(wrapper => (wrapper !== chosenElement) && wrapper.classList.remove(CHECK_MARK));
            canDeselect ? chosenElement.classList.toggle(CHECK_MARK) : chosenElement.classList.add(CHECK_MARK);
        } else {
            (howToModify === CHK_DESELECT && chosenElement.classList.remove(CHECK_MARK)) ||
            (howToModify === CHK_TOGGLE && chosenElement.classList.toggle(CHECK_MARK)) ||
            (howToModify === CHK_SELECT && chosenElement.classList.add(CHECK_MARK));
        }
        const currentIsSelected = chosenElement.classList.contains(CHECK_MARK);
        if (isSelected !== currentIsSelected) {
            const event = new CustomEvent<ChangeEventDetail>('change', {
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

    static updateFormValues(
        element: HTMLElement | Array<HTMLElement>,
        CHECK_MARK: string
    ): void {
        let elements = (element instanceof Array) ? element : [element];
        elements.forEach((el) => {
            // Make sure el has dataset property
            if (!('dataset' in el)) return;
            const hiddenElements = Utils.getElem('.' + el.dataset.hiddenElementId, 'all') as NodeListOf<HTMLElement>;
            // Check if hiddenElements is null
            if (hiddenElements) {
                hiddenElements.forEach((hiddenElement) => {
                    // English: Check if hiddenElement is HTMLElement
                    if (hiddenElement instanceof HTMLElement && hiddenElement.tagName.toLowerCase() === 'input') {
                        const inputElement = hiddenElement as HTMLInputElement; // Type assertion to HTMLInputElement
                        inputElement.checked = el.classList.contains(CHECK_MARK);
                        // Set attribute checked for hidden element
                        if (inputElement.checked) {
                            inputElement.setAttribute('checked', 'checked');
                        } else {
                            inputElement.removeAttribute('checked');
                        }
                    }
                });
            }
        });
    }

    static buildStyles(
        baseSelector: string,
        checkedSelector: string,
        baseStyle: StylesObject,
        checkedStyle?: StylesObject
    ): Record<string, StylesObject> {
        let styles: Record<string, StylesObject> = {};
        const arrayBuilder = (
            selector: string,
            styleValues: StylesObject,
            checked = false
        ): void => {
            let space = selector.startsWith('::') ? '' : ' ';
            if (!selector) space = '.' + checkedSelector;
            styles[`span.imgCheckbox${checked ? '.' + checkedSelector : ''}${space}${selector}`] = styleValues;
        };

        if (typeof baseStyle === 'object' && typeof checkedStyle === 'object') {
            arrayBuilder(baseSelector, baseStyle);
            arrayBuilder(baseSelector, checkedStyle, true);
        } else {
            for (let [selector, value] of Object.entries(baseStyle)) {
                arrayBuilder(selector, value as StylesObject, !!selector);
            }
        }

        return styles;
    }
}

Utils.setStylesheetId('imgCheckbox-style');
Utils.setReplaceRule('.imgCheckbox', '.imgCheckbox');

export default Utils;