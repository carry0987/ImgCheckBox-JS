/* Util */
const Util = {
    getElem(ele, mode, parent) {
        if (typeof ele === 'object') {
            return ele;
        } else if (mode === undefined && parent === undefined) {
            return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
        } else if (mode === 'all' || mode === null) {
            return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } else if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
    },
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    deepMerge(target, ...sources) {
        const source = sources.shift();
        if (!source) return target;
        if (Util.isObject(target) && Util.isObject(source)) {
            for (const key in source) {
                if (Util.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    Util.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return Util.deepMerge(target, ...sources);
    },
    // CSS Injection
    injectStylesheet(stylesObject, id) {
        // Create a style element
        let style = document.createElement('style');
        // WebKit hack
        style.id = 'imgCheckbox-style' + id;
        style.appendChild(document.createTextNode(''));
        // Add the style element to the document head
        document.head.appendChild(style);

        let stylesheet = document.styleSheets[document.styleSheets.length - 1];

        for (let selector in stylesObject) {
            if (stylesObject.hasOwnProperty(selector)) {
                Util.compatInsertRule(stylesheet, selector, Util.buildRules(stylesObject[selector]), id);
            }
        }
    },
    buildRules(ruleObject) {
        let ruleSet = '';
        for (let [property, value] of Object.entries(ruleObject)) {
            ruleSet += `${property}:${value};`;
        }
        return ruleSet;
    },
    compatInsertRule(stylesheet, selector, cssText, id) {
        let modifiedSelector = selector.replace('.imgCheckbox', '.imgCheckbox' + id);
        stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
    },
    removeStylesheet(id) {
        let styleElement = Util.getElem('#imgCheckbox-style' + id);
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    },
    isEmpty(str) {
        return (!str?.length);
    },
    changeSelection(chosenElement, howToModify, addToForm, radio, canDeselect, wrapperElements, constants) {
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
            Util.updateFormValues(radio ? wrapperElements : chosenElement, CHECK_MARK);
        }

        return currentIsSelected;
    },
    updateFormValues(element, CHECK_MARK) {
        let elements = (element instanceof Array) ? element : [element];
        elements.forEach(function(element) {
            let hiddenElements = Util.getElem('.' + element.dataset.hiddenElementId, 'all');
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
    },
    buildStyles(baseSelector, checkedSelector, baseStyle, checkedStyle) {
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
};

export default Util;
