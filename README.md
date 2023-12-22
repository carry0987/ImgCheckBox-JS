# ImgCheckBox-JS
[![version](https://img.shields.io/npm/v/@carry0987/imgcheckbox.svg)](https://www.npmjs.com/package/@carry0987/imgcheckbox)  
A library for create checkable img tags

## Installation
```bash
npm install @carry0987/imgcheckbox
```

## Usage
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
    const imgCheckBox = new ImgCheckBox('#imgList img', {
        graySelected: false,
        scaleSelected: true,
        checkMarkPosition: 'center',
        checkMarkSize: '50px',
        styles: {
            'span.imgCheckbox img': { 'border-radius': '0px' },
            '.image-box .image-layer ~ .imgChked': { 'background-color': 'transparent' }
        },
        preselect: [0, 2],
        onChange: (el, checked) => {
            console.log(el);
        }
    });
});
</script>
```
