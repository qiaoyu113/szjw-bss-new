<template>
  <div>
    <section-container title="仓策展信息">
      <self-form
        label-position="top"
        :form-item="curationItem"
        :list-query="depotCuration"
      />
      <el-row
        :gutter="10"
        class="curation-row"
      >
        <el-col
          v-for="(item,index) in imgArr"
          :key="index"
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>{{ item.tiele }}({{ item.imgArr.length }})</span>
            <div class="img-container">
              <template v-if="item.imgArr[0]">
                <img
                  :src="item.imgArr[0]"
                  alt=""
                  @click="showImghandel(index)"
                >
                <div class="mask-img">
                  <span>预览</span>
                </div>
              </template>
              <template v-else>
                <img
                  src="../../../assets/image/no-img.png"
                  alt=""
                >
              </template>
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>讲解视频</span>
            <div :class="{'video-box': true}">
              <div
                v-if="hasvideo"
                class="video-mask"
                @click="showVideo"
              >
                <i class="el-icon-video-play" />
                <span>点击播放</span>
              </div>
              <img
                v-else
                src="../../../assets/image/no-video.png"
                alt=""
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </section-container>
    <SelfImageViewer
      v-show="showImgViewer"
      :on-close="closeViewer"
      :url-list="imgPreviewList"
    />
    <VideoWeb
      v-if="hasvideo"
      :show.sync="hasShowVideo"
      :video-src="hasvideo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SelfImageViewer from '@/views/line-shelf/components/SelfImageViewer.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import VideoWeb from '../components/VideoWeb.vue'
@Component({
  name: 'CuratorialInfoemation',
  components: {
    SelfImageViewer,
    SectionContainer,
    SelfForm,
    VideoWeb
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) imgArr!:Array<any>
  @Prop({ default: () => {} })depotCuration!:any
  showImgViewer = false
  private hasShowVideo = false
  imgPreviewList = []
  closeViewer() {
    this.showImgViewer = false
  }
  private curationItem = [
    {
      type: 7,
      label: '仓名称',
      key: 'warehouseName'
    },
    {
      type: 7,
      label: '仓位置',
      key: 'warehouseDistrict'
    }
  ]

  showImghandel(index:number) {
    this.imgPreviewList = this.imgArr[index].imgArr
    this.showImgViewer = true
  }
  private baseInfo = {
    checkbox: 'fadfas'
  }
  handleClosed() {}
  showVideo() {
    this.hasShowVideo = true
  }
  get hasvideo() {
    return this.depotCuration.videoUrl
  }
}
</script>

<style lang="scss" scoped>
.curation-row {
  padding: 15px;
}
.curation-col {
  position: relative;
  .curation-title {
    display: flex;
    font-size: 0;
    position: relative;
    span {
      font-size: 14px;
      color: #838383;
      line-height: 26px;
      width: 95px;
      display: inline-block;
    }
    .img-container {
      flex: 1;
      width: 260px;
      max-width: 260px;
      height: 160px;
      border-radius: 5px;
      overflow: hidden;
      &:hover .mask-img {
        height: 32px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .mask-img {
      position: absolute;
      max-width: 260px;
      border-radius: 5px;
      width: calc(100% - 95px);
      height: 0px;
      transition: all 0.7s;
      background: rgba(0, 0, 0, 0.4);
      bottom: 0;
      left: 95;
      z-index: 1;
      text-align: center;
      overflow: hidden;
      span {
        line-height: 32px;
        color: #fff;
        letter-spacing: 1px;
      }
    }
  }
  .video-box {
    position: relative;
    flex: 1;
    width: 260px;
    max-width: 260px;
    height: 160px;
    border-radius: 5px;
    background-image: url('../../../assets/image/video.png');
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    .video-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      color: #fff;
      background: rgba(43, 38, 38, 0.45);
      display: flex;
      align-items: center;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      opacity: 0.8;
      .el-icon-video-play {
        font-size: 52px;
        height: 52px;
        margin-bottom: 6px;
      }
      span {
        width: 100%;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        color: #fff;
        z-index: 12;
        text-align: center;
      }
    }
  }
  .no-video-box {
    background-image: url('../../../assets/image/no-video.png');
  }
}
</style>
