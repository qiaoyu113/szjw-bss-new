<template>
  <div>
    <SelfImageViewer
      v-show="showImgViewer"
      style="z-index:3000"
      :on-close="closeViewer"
      :url-list="imgPreviewList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
import SelfImageViewer from '@/views/line-shelf/components/SelfImageViewer.vue'

@Component({
  name: 'ImgDialog',
  components: {
    SelfImageViewer
  }
})
export default class extends Vue {
  onConfirm(callback: Function) {
    // this.setPolicyConfirm(callback)
  }
  showImgViewer = true
  imgPreviewList=[
    'https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF',
    'https://5b0988e595225.cdn.sohucs.com/images/20180706/762c46951d624675ab88874a61a11eb5.jpeg',
    'https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF'
  ]
  closeViewer() {
    this.showImgViewer = false
  }
}
</script>

<style>

</style>
