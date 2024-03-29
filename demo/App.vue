<template>
  <div class="layout">
    <aside class="layout__controls">
      <div class="layout__controls_group">
        <label class="layout__label">Size: {{ size.w }}x{{ size.h }}</label>
        <input v-model="size.w" class="range" type="range" min="1" max="15">
        <input v-model="size.h" class="range" type="range" min="1" max="15">
      </div>

      <div class="layout__controls_group">
        <div class="layout__label">
          Pixel color
        </div>
        <div class="colors">
          <label v-for="item in colorsKeys" :key="item" class="color" :style="{'background-color': `rgba(${colors[item].join(',')})`}">
            <input
              v-model="color" :value="item"
              type="radio" name="color" class="color__input"
            >
            <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
              <div v-if="item === color" class="color__check" />
            </transition>
          </label>
        </div>

        <div class="layout__label">
          Background color
        </div>
        <div class="colors">
          <label v-for="item in colorsKeys" :key="item" class="color" :style="{'background-color': `rgba(${colors[item].join(',')})`}">
            <input
              v-model="background" :value="item"
              type="radio" name="color" class="color__input"
            >
            <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
              <div v-if="item === background" class="color__check" />
            </transition>
          </label>
        </div>
      </div>

      <div class="layout__controls_group">
        <div class="layout__label">
          Figure
        </div>
        <div
          class="grid"
          :style="{ 'grid-template-columns': `repeat(${size.w}, 1fr)`, 'grid-template-rows': `repeat(${size.h}, 1fr)` }"
        >
          <label
            v-for="(point, index) in points" :key="index"
            class="pixel"
            :style="{'background-color': `rgba(${colors[point].join(',')})`}"
          >
            <input type="checkbox" :checked="point === color" class="pixel__input" @input="ev => onChangePoint(index, ev)">
          </label>
        </div>
        <div class="controls">
          <button type="button" class="button" :disabled="drawing" @click="clearPoints">
            Clear
          </button>
        </div>
      </div>

      <div class="layout__controls_group">
        <div class="layout__label">
          Image size
        </div>
        <div class="controls">
          <label v-for="item in figureSizes" :key="item.value" class="bool">
            <input v-model="figureSize" :value="item.value" type="radio" name="figure_size" class="bool__input">
            <span class="bool__label">{{ item.label }}</span>

            <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
              <div v-if="item.value === figureSize" class="bool__check" />
            </transition>
          </label>
        </div>
      </div>

      <div class="layout__controls_group">
        <div class="layout__label">
          Control
        </div>
        <div class="controls">
          <button type="button" class="button" :disabled="drawing" @click="draw">
            Draw
          </button>
          <button type="button" class="button" :disabled="drawing" @click="step">
            Step<span v-if="iteration">&nbsp;{{ iteration }}</span>
          </button>
          <button type="button" class="button" :disabled="drawing" @click="clear">
            Clear
          </button>
          <button type="button" class="button" :disabled="!drawing" @click="stop">
            Stop
          </button>
          <button type="button" class="button" :disabled="drawing" @click="permalink">
            <span v-if="!permalinkCopied">Parmalink</span>
            <span v-else>Copied</span>
          </button>
          <button type="button" class="button" :disabled="!(!drawing && drawed)" @click="download">
            Download
          </button>
        </div>
      </div>
    </aside>

    <article class="layout__content">
      <div ref="content" class="draw" :class="`m_${figureSize}`">
        <canvas ref="draw" class="draw__canvas" />
      </div>
    </article>
  </div>
</template>


<script>
import Fractal from '../src/fractal';

import map from 'lodash/map';
import chunk from 'lodash/chunk';

export default {
  data: () => ({
    size: {
      w: 4,
      h: 4
    },
    background: 'n',
    color: 'w',
    figureSize: 'screen',
    points: [],

    drawing: false,
    drawed: false,
    permalinkCopied: false,

    fractal: null,
    iteration: 0
  }),

  computed: {
    colors: () => ({
      n: [  0,   0,   0],
      w: [255, 255, 255],
      r: [255,  50,  50],
      g: [ 50, 255,  50],
      b: [ 50,  50, 255],
      y: [255, 255,  50]
    }),

    figureSizes: () => [{
      value: 'screen',
      label: 'Screen size'
    }, {
      value: 'fixed',
      label: '2500x2500'
    }],

    colorsKeys() {
      return Object.keys(this.colors);
    },

    params() {
      return {
        bg: this.colors[this.background],
        color: this.colors[this.color],
        fragment: chunk(map(this.points, point => this.colors[point]), this.size.w)
      };
    }
  },

  watch: {
    'size.w': {
      handler(newSize, oldSize) {
        if (this.size.h == oldSize) this.size.h = newSize;
        this.updateFragment();
      },
      immediate: true
    },
    'size.h': {
      handler() {
        this.updateFragment();
      },
      immediate: true
    },
    'color': {
      immediate: true,
      handler() {
        if (this.color === 'n' && this.background === 'n') this.background = 'w';
        if (this.color === 'w' && this.background === 'w') this.background = 'n';
      }
    },
    'background': {
      immediate: true,
      handler(newBg, oldBg) {
        if (this.background === 'n' && this.color === 'n') this.color = 'w';
        if (this.background === 'w' && this.color === 'w') this.color = 'n';

        this.points = this.points.map(point => {
          return point == oldBg ? newBg : point;
        });
      }
    },
    'figureSize': {
      handler() {
        requestAnimationFrame(() => {
          if (!this.$refs.draw) return;
          if (!this.fractal) return;

          const width = this.$refs.draw.offsetWidth;
          const height = this.$refs.draw.offsetHeight;

          this.fractal.width = width;
          this.fractal.height = height;
        });
      }
    },
    'params.fragment': {
      handler() {
        if (this.fractal) this.fractal.figure = this.params.fragment;
      }
    },
    'params.bg': {
      handler() {
        if (this.fractal) this.fractal.bg = this.params.bg;
      }
    }
  },

  mounted() {
    this.fractal = new Fractal(this.$refs.draw, this.params.fragment, this.params.bg);

    const search = new URLSearchParams(location.search);
    const query = Object.fromEntries(search.entries());

    if (query.w) {
      const w = parseInt(query.w);
      if (!isNaN(w) && w >= 1 && w <= 15) this.size.w = w;
    }
    if (query.h) {
      const h = parseInt(query.h);
      if (!isNaN(h) && h >= 1 && h <= 15) this.size.h = h;
    }

    if (query.b) {
      if (this.colors[query.b]) this.background = query.b;
    }
    if (query.c) {
      if (this.colors[query.c]) this.color = query.c;
    }
    if (query.s) {
      const avail = this.figureSizes.map(({value}) => value);
      if (avail.includes(query.s)) this.figureSize = query.s;
    }
    if (query.p) {
      const vals = query.p.split('');
      const points = new Array(this.size.w * this.size.h);

      this.points = map(points, (p, index) => {
        return this.colors[vals[index]] ? vals[index] : this.background;
      });
    }
  },

  methods: {
    updateFragment() {
      const count = this.size.w * this.size.h;
      if (this.points.length > count) {
        this.points = this.points.slice(0, count);
      } else if (this.points.length < count) {
        const newPoints = [];

        for (let i = 0; i < count - this.points.length; i++) {
          newPoints.push(this.background);
        }

        this.points = this.points.concat(newPoints);
      }
    },

    onChangePoint(index, ev) {
      this.points[index] = ev.target.checked
        ? this.color
        : this.background;
    },

    async draw() {
      if (this.drawing) return;

      this.drawed = false;
      this.drawing = true;
      this.iteration = 0;

      window.scrollTo({
        top: this.$refs.content.offsetTop,
        behavior: 'smooth'
      });

      await this.fractal.draw();

      this.drawing = false;
      this.drawed = true;
    },
    step() {
      if (this.drawing) return;

      this.iteration = this.fractal.step();
      this.fractal.iteration = this.iteration;
    },
    clear() {
      if (this.drawing) return;

      this.iteration = 0;
      this.fractal.clear();
    },
    clearPoints() {
      if (this.drawing) return;

      const count = this.size.w * this.size.h;

      const newPoints = [];

      for (let i = 0; i < count; i++) {
        newPoints.push(this.background);
      }

      this.points = newPoints;
    },
    stop() {
      if (!this.drawing) return;

      this.drawed = false;
      this.drawing = false;
      this.iteration = 0;

      this.fractal.stop();
    },

    async download() {
      if (!this.drawed) return;

      const type = 'image/png';
      const filename = 'fractal.png';

      const blob = await this.fractal.getBlob(type);
      const file = new File([blob], filename, {type});
      const url = URL.createObjectURL(file);

      const pom = document.createElement('A');
      pom.setAttribute('href', url);
      pom.setAttribute('download', filename);

      if (window.MouseEvent) {
        const event = new MouseEvent('click', {bubbles: true, cancelable: true});
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }

      URL.revokeObjectURL(url);
    },

    async permalink() {
      const query = {
        w: this.size.w,
        h: this.size.h,
        b: this.background,
        c: this.color,
        s: this.figureSize,
        p: this.points.join('')
      };

      const search = new URLSearchParams(query);

      history.replaceState(null, '', `?${search.toString()}`);

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.href);
        this.permalinkCopied = true;
        setTimeout(() => {
          this.permalinkCopied = false;
        }, 1500);
      }
    }
  }
};
</script>


<style lang="less">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: black;
  font-family: 'Fira Code', SFMono-Regular, Consolas, Liberation Mono, Menlo, Monaco, Courier, monospace;
  font-size: 10px;
  font-weight: normal;

  font-feature-settings:
    'ss01' off, 'ss02' off, 'ss03' off,'ss04' on, 'ss05' off, 'ss06' on, 'ss07' off,
    'zero' off, 'onum' off;
}

.layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 100%;
  height: 100vh;
  box-sizing: border-box;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;

  &__controls {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: flex-start;
    gap: 15px;
    flex: 0 0 240px;
    min-height: 0;
    max-height: 100%;
    padding: 2rem;
    overflow: auto;

    &_group {
      flex: 1 1 240px;
    }
  }
  &__content {
    flex: 1 1 auto;
    padding: 2rem;
    overflow: auto;
  }
  &__label {
    display: block;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-size: 1.4rem;
    font-weight: 500;
    color: white;

    &:first-child {
      margin-top: 0;
    }
  }

  @media screen and (max-width: 860px) {
    flex-direction: column;
    display: block;

    &__controls {
      flex-basis: auto;
    }
    &__content {
      flex-shrink: 0;
    }
  }
}

.range {
  display: block;
  width: 100%;
  margin: 10px 0 0 0;
  padding: 10px;
  background-color: white;
  box-sizing: border-box;

  border: 0;
  border-radius: 7px;
  background: white;
  outline: none;

  box-shadow: none;
  transition: all 0.4s;

  -webkit-appearance: none;

  &::-moz-range-track, &::-webkit-range-track {
    -webkit-appearance: none;
    height: 4px;
    border-radius: 4px;
    background-color: black;
  }
  &::-webkit-slider-thumb, &::-moz-range-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    border: 2px solid black;
    background-color: white;
  }
}

.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -3px;
}
.color {
  position: relative;
  flex: 1 1 auto;
  width: 30px;
  height: 30px;
  margin: 0 3px 3px;

  border: 1px solid white;
  border-radius: 3px;

  cursor: pointer;

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0.1;
    -webkit-appearance: none;
  }

  &__check {
    content: "";
    position: absolute;
    top: -3px;
    left: -3px;
    bottom: -3px;
    right: -3px;

    border-radius: 5px;
    box-shadow: 0 0 0 2px white;

    pointer-events: none;

    transition: all 0.2s;

    &.m_hidden {
      transform: scale(0.8);
      opacity: 0;
    }
  }
}

.bool {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 3px 3px;
  padding: 8px 15px;

  background: fade(white, 15%);
  border-radius: 3px;

  text-align: center;

  cursor: pointer;

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0.1;
    -webkit-appearance: none;
  }

  &__check {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    border-radius: 5px;
    box-shadow: 0 0 0 2px white;

    pointer-events: none;

    transition: all 0.2s;

    &.m_hidden {
      transform: scale(0.9);
      opacity: 0;
    }
  }
  &__label {
    font-size: 12px;
    font-weight: 600;
    color: white;
    text-align: center;
  }
}

.grid {
  display: grid;
  width: 100%;
  max-width: 250px;
  margin-bottom: 10px;
  grid-template-columns: repeat(var(--grid-width, 1), 1fr);
  grid-gap: 3px;

  &:last-child {
    margin-bottom: 0;
  }
}

.pixel {
  position: relative;
  height: 0;
  padding-top: 100%;

  border: 1px solid white;
  border-radius: 3px;

  cursor: pointer;
  transition: all 0.2s;

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0.1;
    -webkit-appearance: none;
  }
}

.controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.button {
  display: inline-block;
  flex: 0 0 auto;
  padding: 0.4em 1em;
  margin: 0 0.2em 0.2em;

  border-radius: 5px;
  border: 2px solid white;
  background: transparent;

  font-size: 1.2rem;
  font-weight: 500;

  color: white;

  cursor: pointer;

  -webkit-appearance: none;

  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }

}

.draw {
  position: relative;
  width: 100%;
  height: 100%;
  border-color: 1px solid white;
  vertical-align: top;

  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &.m_fixed {
    min-width: 2500px;
    min-height: 2500px;
  }

  @media screen and (max-width: 860px) {
    height: 0;
    min-height: 500px;
    padding-top: 100%;
    box-sizing: border-box;
  }
}
</style>
