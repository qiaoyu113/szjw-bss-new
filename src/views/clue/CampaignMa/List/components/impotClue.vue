<template>
  <div class="impotClueContainer">
    <self-form
      ref="form1"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
      label-position="top"
      class="p15"
      :pc-col="24"
    >
      <template #file>
        <el-upload
          ref="upload"
          drag
          :show-file-list="false"
          :limit="1"
          action="/121"
          :auto-upload="false"
          :file-list="fileList"
          :http-request="uploadFile"
          :on-change="handleExcelChange"
          :class="selectFile ? 'uploadSuc':''"
        >
          <template v-if="selectFile">
            <i class="el-icon-document" />
            <div class="tipText">
              {{ filename }}
            </div>
          </template>
          <template v-else>
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              选择导入文件
            </div>
          </template>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            仅支持XLS/XLSX文件格式
          </div>
        </el-upload>
      </template>
      <template #download>
        <el-button
          type="text"
          @click="handleDownloadClick"
        >
          <strong>点击下载导入模板</strong>
        </el-button>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'importClue',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  fileList:any[] = [];
  private listQuery:IState = {};
  private selectFile:boolean = false // 是否选择文件
  private filename:string = ''// 文件名
  private formItem:any[] = [
    {
      type: 'file',
      key: 'file',
      label: '市场部线索导入',
      slot: true
    },
    {
      type: 'download',
      key: 'download',
      label: '',
      slot: true
    }
  ];
  handleExcelChange({ raw }:{raw:File}) {
    const type = raw.type
    this.filename = raw.name
    if (['application/vnd.ms-excel', 'application/x-xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
      this.selectFile = true
      return true
    }
    this.handleResetFile()
    this.$message.warning('请选择excel文件')
    return false
  }
  // 重置文件
  handleResetFile() {
    this.selectFile = false
    this.fileList = []
  }
  // 调用上传
  handlePass() {
    if (!this.selectFile) {
      return this.$message.warning('请选择要导入的excel文件')
    }
    (this.$refs.upload as any).submit()
  }
  uploadFile(file:any) {
    let formData = new FormData()
    formData.append('file', file.file)
    this.$emit('onPass', formData)
  }
  // 下载模板
  handleDownloadClick() {

  }
}
</script>
<style lang="scss" scoped>
  .impotClueContainer {
    .tipText {
      color: #1f2d3d;
      font-size: 14px;
      text-align: center;
    }
    .el-icon-document {
      color: #C0C4CC;
      font-size:50px;
    }
  }
</style>

<style scoped>
  .uploadSuc >>> .el-upload-dragger {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
