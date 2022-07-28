import path from 'path';
import process from 'process';
import fs from 'fs';
import jsx from 'rollup-plugin-jsx';
import { terser } from 'rollup-plugin-terser';
import tsPlugin from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const cwd = process.cwd();
const resolvePath = _path => path.resolve(cwd, _path);

const camelCase = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase());

const defineRollupConfig = (packageInfo, { external = [] } = {}) => {
    const externalGlobals = {};
    external.forEach(name => {
        externalGlobals[name] = camelCase(name);
    });
    const config = {
        input: fs.existsSync(resolvePath('./src/index.ts'))
            ? resolvePath('./src/index.ts')
            : resolvePath('./src/index.js'),
        output: [
            {
                file: 'cjs/index.cjs',
                format: 'cjs',
                exports: 'auto',
                sourcemap: true
            },
            {
                file: 'esm/index.js',
                format: 'es',
                sourcemap: true
            },
            {
                file: 'umd/index.js',
                format: 'umd',
                name: camelCase(packageInfo.name),
                globals: {
                    react: 'React',
                    ...externalGlobals
                }
            },
            {
                file: 'umd/index.min.js',
                format: 'umd',
                name: camelCase(packageInfo.name),
                globals: {
                    react: 'React',
                    ...externalGlobals
                },
                sourcemap: true,
                plugins: [terser()]
            }
        ],
        plugins: [tsPlugin(), nodeResolve(), commonjs(), jsx({ factory: 'React.createElement' })],
        external: ['react', ...external]
    };
    config.output = config.output.map(output => ({
        ...output,
        file: resolvePath(output.file)
    }));
    return config;
};

export default defineRollupConfig;
