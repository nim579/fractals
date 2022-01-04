/*
  @license
	fractals.js v1.0.0 - Tue, 04 Jan 2022 12:09:36 GMT
	https://github.com/nim579/fractals#readme
	Released under the MIT License.
*/

/** @module Fractal */

/**
 * @typedef {number[]} FractalColor
 */

/**
 * @typedef {FractalColor[][]} FractalFigure
 */

/**
 * @typedef {Object} FractalIteration
 * @property {number} ratio
 * @property {number} countX
 * @property {number} countY
 */

/** @type FractalColor */
const defaultColor = [255, 255, 255];

/** @type FractalFigure */
const defaultFigure = [[defaultColor]];


/** @class */
class Fractal {
  /**
   * @param {HTMLCanvasElement} selector
   * @param {FractalFigure} figure
   * @param {FractalColor} bg
   * @param {number} ratio
   */
  constructor(selector, figure, bg = [0, 0, 0], ratio = 2) {
    const canvas = selector instanceof HTMLCanvasElement
      ? selector
      : document.querySelector(selector);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.globalCompositeOperation = 'multiply';

    if (!figure) figure = defaultFigure;

    this.params = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      ratio, bg, figure
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
   * @type {FractalFigure}
   */
  get figure() {
    const alpha = Math.ceil(255 * (1 / this.iterations));

    return this.params.figure.map(row => {
      return row.map(point => {
        if (Array.isArray(point)) {
          return [(point[0] || 0), (point[1] || 0), (point[2] | 0), alpha];
        } else if (point) {
          return [255, 255, 255, alpha];
        } else {
          return [0, 0, 0, alpha];
        }
      });
    });
  }
  set figure(figure) {
    this.params.figure = figure;
  }

  get figureSize() {
    return {
      width: this.params.figure[0].length,
      height: this.params.figure.length
    };
  }

  get iterations() {
    let ratio = this.params.ratio;
    let iterations = 0;
    const {width, height} = this.figureSize;

    while (iterations < 100) {
      ratio = Math.pow(this.params.ratio, iterations);

      if (width * ratio > this.width || height * ratio > this.height) {
        break;
      } else {
        iterations++;
      }
    }

    return iterations;
  }

  get image() {
    const { width, height } = this.figureSize;
    const pixels = Uint8ClampedArray.from(this.figure.flat().flat());
    const imgData = new ImageData(pixels, width, height);

    const img = document.createElement('canvas');
    img.width = width;
    img.height = height;

    const ctx = img.getContext('2d');

    ctx.putImageData(imgData, 0, 0);

    return img;
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

  getFigure(iteration = 1, image = this.image) {
    const ratio = Math.pow(this.params.ratio, iteration);
    const width = image.width * ratio;
    const height = image.height * ratio;

    const fig = document.createElement('canvas');
    fig.width = width;
    fig.height = height;

    const ctx = fig.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, width, height);

    return fig;
  }

  getPatttern(iteration = 0, image = this.image) {
    const fig = this.getFigure(iteration, image);
    return this.ctx.createPattern(fig, 'repeat');
  }

  /**
   * Stop and clear screen
   */
  clear() {
    this.stop();

    this.iteration = 0;

    this.ctx.fillStyle = this.rgba(this.params.bg);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Stop drawing
   */
  stop() {
    // if (this._drawTO) clearTimeout(this._drawTO);
    if (this._drawTO) cancelAnimationFrame(this._drawTO);
  }

  /**
   * Start draw fractal
   * @param {Function} callback
   * @returns {HTMLCanvasElement}
   */
  draw() {
    this.clear();

    const iterations = this.iterations + 0;
    const image = this.image;

    const draw = callback => {
      this._drawTO = requestAnimationFrame(() => {
        const iteration = this._drawStep(image);

        if (iteration < iterations) {
          draw(callback);
        } else {
          callback(this.canvas);
        }
      });
    };

    return new Promise(resolve => {
      draw(resolve);
    });
  }

  _drawStep(image = this.image) {
    const pattern = this.getPatttern(this.iteration, image);

    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.width, this.height);

    return ++this.iteration;
  }

  step(iteration = this.iteration) {
    const pattern = this.getPatttern(iteration, this.image);
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.width, this.height);

    return iteration + 1;
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
}

export { Fractal, Fractal as default };
//# sourceMappingURL=fractals.es.js.map
