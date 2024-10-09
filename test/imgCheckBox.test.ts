import { ImgCheckBox } from '@/component/imgCheckBox';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ImgCheckBox Component', () => {
    let imgCheckBox: ImgCheckBox;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="imgList">
                <img src="img/meme-1.jpg" alt="image" class="img-fluid" style="max-width: 100px;">
                <img src="img/meme-2.jpg" alt="image" class="img-fluid" style="max-width: 100px;">
                <img src="img/meme-3.jpg" alt="image" class="img-fluid" style="max-width: 100px;">
            </div>
        `;

        imgCheckBox = new ImgCheckBox('#imgList img', {
            graySelected: false,
            scaleSelected: true
        });
    });

    it('should select all images', () => {
        imgCheckBox.selectAll();
        const checkedImages = imgCheckBox.getChecked();
        expect(checkedImages.length).toBe(3); // Check length of checked images
    });

    it('should deselect a specific image', () => {
        imgCheckBox.selectAll();
        imgCheckBox.deselect(1); // Deselect second image
        const uncheckedImages = imgCheckBox.getUnchecked();
        expect(uncheckedImages.length).toBe(1); // Ensure only one is unchecked
    });

    it('should get the state of a specific image', () => {
        imgCheckBox.selectAll();
        imgCheckBox.target(2); // Target third image
        const state = imgCheckBox.state();
        expect(state).toBe(true); // Should be selected

        imgCheckBox.deselect(2);
        const newState = imgCheckBox.state();
        expect(newState).toBe(false); // Should be deselected after deselect
    });
});
