<template>
  <transition
    v-if="isShow"
    name="viewer-fade"
  >
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
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas autoflex">
        <video
          class="aa-vadio"
          :src="videoSrc"
          controls="controls"
          preload
          autoplay
        >
          您的浏览器不支持 video 标签。
        </video>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'VideoWeb',
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 3000
    },
    onClose: {
      type: Function,
      default: () => { }
    },
    show: {
      type: Boolean,
      default: false
    },
    videoSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isShow: {
    // getter
      get: function() {
        return this.show
      },
      // setter
      set: function(value) {
        this.$emit('update:show', value)
      }
    }
  },
  methods: {
    hide() {
      this.isShow = false
      this.onClose()
    }
  }
}
</script>
<style lang="scss" scoped>

.el-image-viewer__close{
  top: 18%;
  right: 17%;
  color: #fff;
  font-size: 48px;
}
.aa-vadio{
  width: 960px;
  height:540px;
  border: none;
  z-index: 12;
}
video:focus{
      outline: -webkit-focus-ring-color auto 0px;  //去除video获得焦点的边框
  }
</style>
