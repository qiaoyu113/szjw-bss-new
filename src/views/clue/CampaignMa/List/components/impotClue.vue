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
      :rules="rules"
      @onPass="handlePass"
    >
      <template #file>
        <el-upload
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-success="handleFileSuccess"
          :before-upload="beforeFileUpload"
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
  private rules:IState = {
    file: [
      { required: true, message: '请选择导入文件', trigger: 'blur' }
    ]
  }
  // 上传前的校验
  beforeFileUpload(file:File) {
    const isJPG = file.type
    return true
  }
  // 上传成功的校验
  handleFileSuccess(res:IState) {

  }
  // 验证表单
  handleValidateForm() {
    ((this.$refs.form1) as any).submitForm()
  }
  handlePass() {
    this.$emit('onPass')
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
