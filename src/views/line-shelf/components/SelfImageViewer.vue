<template>
  <transition name="viewer-fade">
    <div
      ref="el-image-viewer__wrapper"
      tabindex="-1"
      class="el-image-viewer__wrapper"
      :style="{'z-index': zIndex}"
    >
      <div class="el-image-viewer__mask" />
      <!-- CLOSE -->
      <span
        class="el-image-viewer__btn el-image-viewer__close"
        @click="hide"
      >
        <i class="el-icon-close" />
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev left-arow"
          :class="{'is-disabled': !infinite && isFirst}"
          @click="prev"
        >
          <i class="el-icon-back" />
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next right-arow"
          :class="{'is-disabled': !infinite && isLast}"
          @click="next"
        >
          <i class="el-icon-right" />
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <i
            class="el-icon-zoom-out"
            @click="handleActions('zoomOut')"
          />
          <i
            class="el-icon-zoom-in"
            @click="handleActions('zoomIn')"
          />
          <i
            class="el-icon-refresh-left"
            @click="handleActions('anticlocelise')"
          />
          <i
            class="el-icon-refresh-right"
            @click="handleActions('clocelise')"
          />
        </div>
      </div>
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas autoflex">
        <template v-for="(url, i) in urlList">
          <img
            v-if="i === index"
            ref="img"
            :key="url"
            class="el-image-viewer__img"
            :src="currentImg"
            :style="imgStyle"
            :draggable="false"
            @load="handleImgLoad"
            @error="handleImgError"
          >
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from 'element-ui/src/utils/dom'
import { rafThrottle, isFirefox } from 'element-ui/src/utils/util'

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
}

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export default {
  name: 'SelfImageViewer',

  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 3000
    },
    onSwitch: {
      type: Function,
      default: () => { }
    },
    onClose: {
      type: Function,
      default: () => { }
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    }
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1
    },
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === this.urlList.length - 1
    },
    currentImg() {
      return this.urlList[this.index]
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    }
  },
  watch: {
    index: {
      handler: function(val) {
        this.reset()
        this.onSwitch(val)
      }
    },
    currentImg(val) {
      this.$nextTick(_ => {
        const $img = this.$refs.img[0]
        if (!$img.complete) {
          this.loading = true
        }
      })
    }
  },
  mounted() {
    this.deviceSupportInstall()
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['el-image-viewer__wrapper'].focus()
  },
  methods: {
    hide() {
      this.deviceSupportUninstall()
      this.onClose()
    },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode
        switch (keyCode) {
          // SPACE
          case 32:
            this.toggleMode()
            break
          // LEFT_ARROW
          case 37:
            this.prev()
            break
          // RIGHT_ARROW
          case 39:
            this.next()
            break
          // DOWN_ARROW
        }
      })
      // 滚轮缩放
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    handleImgLoad(e) {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return

      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler)
      })

      e.preventDefault()
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    toggleMode() {
      if (this.loading) return

      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    prev() {
      if (this.isFirst && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index - 1 + len) % len
    },
    next() {
      if (this.isLast && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index + 1) % len
    },
    handleActions(action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          break
      }
      transform.enableTransition = enableTransition
    }
  }
}
</script>
<style lang="scss" scoped>
.autoflex {
  display: flex;
  align-items: center;
  img {
    width: 60%;
    height: 50%;
    object-fit: contain;
  }
}
.left-arow {
  left: 15%;
  width: 60px;
  height: 60px;
  font-size: 38px;

}
.right-arow {
  right: 15%;
  width: 60px;
  height: 60px;
  font-size: 38px;

}
.el-image-viewer__close{
  top: 18%;
  right: 17%;
  color: #fff;
  font-weight: 700;
  font-size: 53px;
}
.el-image-viewer__actions__inner{
  font-size: 28px;
}
</style>
