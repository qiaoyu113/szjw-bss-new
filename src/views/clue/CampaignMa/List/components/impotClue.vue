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
          :before-upload="beforeFileUpload"
          :auto-upload="false"
          :file-list="fileList"
          :http-request="uploadFile"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            选择导入文件
          </div>
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
  // 上传前的校验
  beforeFileUpload(file:File) {
    const isJPG = file.type
    return true
  }
  // 验证表单
  handleValidateForm() {
    ((this.$refs.form1) as any).submitForm()
  }
  // 调用上传
  handlePass() {
    (this.$refs.upload as any).submit()
  }
  uploadFile(file:any) {
    let formData = new FormData()
    formData.append('file', file.file)
    this.$emit('onPass', formData)
    this.fileList = []
  }
  // 下载模板
  handleDownloadClick() {

  }
}
</script>
<style lang="scss" scoped>
  .impotClueContainer {

  }
</style>
