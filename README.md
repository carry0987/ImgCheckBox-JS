# ImgCheckBox-JS
[![version](https://img.shields.io/npm/v/@carry0987/imgcheckbox.svg)](https://www.npmjs.com/package/@carry0987/imgcheckbox)
![CI](https://github.com/carry0987/ImgCheckBox-JS/actions/workflows/ci.yml/badge.svg)  
Seamlessly transform your images into interactive checkboxes with **ImgCheckBox**, a versatile and easy-to-use JavaScript library designed to enhance user interfaces by introducing customizable image-based selection functionality.

## Description
**ImgCheckBox** is a modern, lightweight, and versatile JavaScript library for transforming regular image elements into clickable checkboxes. Wrapped in an intuitive API, it offers a range of customizable options to create a unique and interactive user experience. Whether you're implementing image selection features or looking for a creative way to handle user inputs, **ImgCheckBox** seamlessly integrates with your projects, elevating web interfaces with minimal effort.

## Installation
```bash
pnpm i @carry0987/imgcheckbox
```

## Usage
Here is a simple example of how to use **ImgCheckBox** in your project.

#### UMD
```html
<div>
    <div id="imgList">
        <div class="image">
            <img src="img/example-1.jpg">
        </div>
        <div class="image">
            <img src="img/example-2.jpg">
        </div>
        <div class="image">
            <img src="img/example-3.jpg">
        </div>
    </div>
</div>
<script src="dist/imgCheckBox.min.js"></script>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', () => {
    const imgCheckBox = new imgCheckBoxjs.ImgCheckBox('#imgList img', {
        graySelected: false,
        scaleSelected: true,
        checkMarkPosition: 'center',
        checkMarkSize: '50px',
        styles: {
            'span.imgCheckbox img': { 'border-radius': '0px' },
            '.image-box .image-layer ~ .imgChked': { 'background-color': 'transparent' }
        },
        preselect: [0, 2],
    });
    imgCheckBox.on('change', (el, checked) => {
        console.log(el);
    });
});
</script>
```

#### ES6
```ts
import { ImgCheckBox } from '@carry0987/imgcheckbox';

document.addEventListener('DOMContentLoaded', () => {
    const imgCheckBox = new ImgCheckBox('#imgList img', {
        //...
    });
    imgCheckBox.on('change', (el, checked) => {
        console.log(el);
    });
});
```
