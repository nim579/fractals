/*
  @license
	fractals.js v0.0.0 - Mon, 27 Dec 2021 18:27:08 GMT
	https://github.com/nim579/fractals#readme
	Released under the MIT License.
*/

/** @module Fractal */

/**
 * @typedef {number[]} FractalColor
 */

/**
 * @typedef {FractalColor[][]} FractalFragment
 */

/**
 * @typedef {Object} FractalIteration
 * @property {number} ratio
 * @property {number} countX
 * @property {number} countY
 */

/**
 * @typedef {FractalIteration[]} FractalIteration
 */


/** @type FractalColor */
const defaultColor = [255, 255, 255];

/** @type FractalFragment */
const defaultFragment = [[defaultColor]];

/** @class */
class Fractal {
  /**
   * @param {HTMLCanvasElement} selector
   * @param {FractalFragment} fragment
   * @param {FractalColor} bg
   */
  constructor(selector, fragment, bg = [0, 0, 0]) {
    const canvas = selector instanceof HTMLCanvasElement
      ? selector
      : document.querySelector(selector);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.fragment = fragment || defaultFragment;

    this.params = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      bg: bg
    };

    canvas.width = this.params.width;
    canvas.height = this.params.height;

    this.clear();
  }

  get bg() {
    return this.params.bg;
  }
  set bg(bg) {
    this.params.bg = bg;
    this.clear();
  }

  get width() {
    return this.params.width;
  }
  set width(width) {
    this.params.width = width;
    this.canvas.width = width;
    this.clear();
  }

  get height() {
    return this.params.height;
  }
  set height(height) {
    this.params.height = height;
    this.canvas.height = height;
    this.clear();
  }

  /**
   * Return image blob of fractal
   * @param {string} type
   * @returns {Promise<Blob>}
   */
  getBlob(type = 'image/png') {
    return new Promise(callback => {
      this.canvas.toBlob(callback, type);
    });
  }

  /**
   * Return rgba()
   * @param {number|number[]} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @returns {string}
   */
  rgba(r, g, b, a) {
    if (Array.isArray(r)) [r, g, b, a] = r;
    return `rgba(${r || 0}, ${g || 0}, ${b || 0}, ${a || 1})`;
  }

  /**
   * Stop and clear screen
   */
  clear() {
    this.stop();

    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.ctx.fillStyle = this.rgba(this.params.bg);
    this.ctx.fillRect(0, 0, this.params.width, this.params.height);
  }

  /**
   * Stop drawing
   */
  stop() {
    if (this._drawTO) clearTimeout(this._drawTO);
    if (this._iterateTO) clearTimeout(this._iterateTO);
  }

  /**
   * Start draw fractal
   * @param {Function} callback
   * @returns {HTMLCanvasElement}
   */
  draw(callback) {
    const iterations = this._computeIterations();
    this.fragment = this._normalizeFragment(this.fragment, iterations.length);

    let count = iterations.length;

    this.clear();

    const call = (i = 0) => {
      this._drawTO = setTimeout(() => {
        this.iteration(0, iterations[i], () => {
          count--;
          if (iterations[i + 1]) call(i + 1);
          if (count <= 0) callback(this.canvas);
        });
      }, 100);
    };

    call();
  }

  /**
   * Draw iteration of fractal
   * @param {number} i
   * @param {FractalIteration} iteration
   * @param {Function} callback
   */
  iteration(i = 0, iteration, callback) {
    this._iterateTO = setTimeout(() => {
      let j = 0;

      while (j <= iteration.countY) {
        this.figure(i, j, iteration.ratio);
        j++;
      }

      i++;

      if (i <= iteration.countX) {
        return this.iteration(i, iteration, callback);
      }

      callback();
    }, 0);
  }

  /**
   * Draw one figure of fractal
   * @param {number} iX
   * @param {number} iY
   * @param {number} ratio
   */
  figure(iX, iY, ratio) {
    const height = this.fragment.length * ratio;

    this.fragment.forEach((points, row) => {
      const width = points.length * ratio;

      points.forEach((point, col) => {
        this.ctx.fillStyle = this.rgba(point);

        this.ctx.fillRect(
          iX * width + col * ratio,
          iY * height + row * ratio,
          ratio,
          ratio
        );
      });
    });
  }

  /**
   * Computes iterations data for draw
   * @returns {FractalIterations}
   */
  _computeIterations() {
    const iterations = [];
    let ratio = 1;
    const figureWidth = this.fragment[0].length;
    const figureHeight = this.fragment.length;

    const addIteration = () => {
      const countX = Math.floor(this.width / (ratio * figureWidth));
      const countY = Math.floor(this.height / (ratio * figureHeight));

      if (countX > 0 && countY > 0) {
        iterations.push({ ratio, countX, countY});
        ratio = ratio * 2;
        addIteration();
      } else {
        return iterations;
      }
    };

    addIteration();

    return iterations;
  }

  /**
   * Normalize fragment
   * @param {FractalFragment} fragment
   * @param {number} iterations
   * @returns {FractalFragment}
   */
  _normalizeFragment(fragment, iterations = 1) {
    const alpha = (1 / iterations).toFixed(2);

    return fragment.map(row => {
      return row.map(point => {
        let color;

        if (Array.isArray(point)) {
          color = [...point.slice(0, 3)];
        } else if (point) {
          color = [255, 255, 255];
        } else {
          color = [0, 0, 0];
        }

        return [...color, alpha];
      });
    });
  }
}

export { Fractal, Fractal as default };
//# sourceMappingURL=fractals.es.js.map
