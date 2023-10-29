import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

export default {
    input: 'src/imgCheckBox.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'ImgCheckBox',
            plugins: [terser()],
        }
    ],
    plugins: [
        resolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};
