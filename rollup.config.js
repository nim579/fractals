import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies || {});

const banner = `/*
  @license
	${pkg.name} v${pkg.version} - ${new Date().toUTCString()}
	${pkg.homepage}
	Released under the ${pkg.license} License.
*/\n`;

export default {
  input: './index.js',
  external: [...dependencies],
  plugins: [],
  output: [{
    banner,
    file: './dist/fractals.es.js',
    format: 'es',
    sourcemap: true
  }, {
    banner,
    file: './dist/fractals.cjs.js',
    format: 'cjs',
    sourcemap: true
  }]
};
