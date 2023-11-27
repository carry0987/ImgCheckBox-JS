import { deepMerge, setStylesheetId, setReplaceRule, injectStylesheet, removeStylesheet, errorUtils, domUtils } from '@carry0987/utils';

class Utils {
    static throwError = errorUtils.throwError;
    static deepMerge = deepMerge;
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = domUtils.getElem;
    static changeSelection = function(chosenElement, howToModify, addToForm, radio, canDeselect, wrapperElements, constants) {
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
            const event = new CustomEvent('change', {
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
    
    static updateFormValues = function(element, CHECK_MARK) {
        let elements = (element instanceof Array) ? element : [element];
        elements.forEach(function(element) {
            let hiddenElements = Utils.getElem('.' + element.dataset.hiddenElementId, 'all');
            hiddenElements.forEach(function(hiddenElement) {
                // Check if hiddenElement is input
                if (hiddenElement.tagName.toLowerCase() === 'input') {
                    hiddenElement.checked = element.classList.contains(CHECK_MARK) ? true : false;
                    // Set attribute checked for hidden element
                    if (hiddenElement.checked) {
                        hiddenElement.setAttribute('checked', 'checked');
                    } else {
                        hiddenElement.removeAttribute('checked');
                    }
                }
            });
        });
    }
    
    static buildStyles = function(baseSelector, checkedSelector, baseStyle, checkedStyle) {
        let styles = {};
        const arrayBuilder = (selector, value, checked = false) => {
            let space = selector.startsWith('::') ? '' : ' ';
            if (!selector) space = '.' + checkedSelector;
            styles[`span.imgCheckbox${checked ? '.' + checkedSelector : ''}${space}${selector}`] = value;
        };
        if (typeof baseStyle == 'object' && typeof checkedStyle == 'object') {
            arrayBuilder(baseSelector, baseStyle);
            arrayBuilder(baseSelector, checkedStyle, true);
        } else {
            for (let [selector, value] of Object.entries(baseStyle)) {
                arrayBuilder(selector, value, !!selector);
            }
        }
        return styles;
    }
}

Utils.setStylesheetId('imgCheckbox-style');
Utils.setReplaceRule('.imgCheckbox', '.imgCheckbox');

export default Utils;
