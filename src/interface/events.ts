export interface ImgCheckBoxEvents {
    click: (element: HTMLElement, isSelected?: boolean) => void;
    change: (element: HTMLElement, isSelected?: boolean) => void;
    select: (element: HTMLElement) => void;
    deselect: (element: HTMLElement) => void;
    selectAll: (elements: HTMLElement[]) => void;
    deselectAll: () => void;
}
