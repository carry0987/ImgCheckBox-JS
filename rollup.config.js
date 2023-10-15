import terser from "@rollup/plugin-terser";
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

export default {
    input: 'src/imgCheckBox.js',
    output: [
        {
            file: 'dist/imgCheckBox.min.js',
            format: 'umd',
            name: 'ImgCheckBox',
            plugins: [terser()],
        }
    ],
    plugins: [
        replace({
            preventAssignment: true,
            __version__: pkg.version
        }),
        postcss({
            extract: true,
            minimize: true,
            sourceMap: false
        }),
    ]
};
