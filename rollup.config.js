import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-css-only';

export default [
  {
    input: 'src/synonym.js',
    output: [
      {
        file: 'dist/synonym.js',
        format: 'umd',
        name: 'QuillSynonym',
        globals: {
          quill: 'Quill'
        }
      },
      {
        file: 'dist/synonym.esm.js',
        format: 'es'
      },
      {
        file: 'dist/synonym.min.js',
        format: 'umd',
        name: 'QuillSynonym',
        plugins: [terser()],
        globals: {
          quill: 'Quill'
        }
      }
    ],
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      css({ output: 'synonym.css' })
    ],
    external: ['quill']
  }
];