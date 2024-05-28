import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isProduction = process.env.BUILD === 'production';
const sourceFile = 'src/index.ts';
const dtsFile = 'dist/dts/index.d.ts';

const jsConfig = {
    input: sourceFile,
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'ImgCheckBox',
            plugins: isProduction ? [terser()] : []
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    plugins: [
        typescript(),
        resolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

const dtsConfig = {
    input: dtsFile,
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: 'dist/dts' })
    ]
};

export default [jsConfig, dtsConfig];
