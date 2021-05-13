<template>
  <SelfDialog
    :visible.sync="show"
    append-to-body
    width="500px"
    title="更换工作城市"
    :confirm="confirm"
    custom-class="a1111"
    :destroy-on-close="false"
    @close="close"
  >
    <self-form
      ref="cityForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    />
    <span class="remark">注：操作更换工作城市后，您将不能在本城市下看到该司机！</span>
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { updateDriverWorkCityByDriverId } from '@/api/departCenter'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'chooseCity',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) dialogVisible!: boolean; // 弹框显示
  @Prop({ default: [] }) options!: []; // 弹框显示
  @Prop({ default: () => {} }) obj!: IState; // row data
  @PropSync('dialogVisible', { type: Boolean }) show!: Boolean;
  private listQuery: IState = {
    workCity: ''
  };
  private formItem: any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '新工作城市',
      key: 'workCity',
      options: this.options
    }
  ];
  private rules: IState = {
    workCity: [
      {
        required: true,
        message: '请选择新工作城市',
        trigger: 'blur'
      }
    ]
  };

  private close() {
    (this.$refs.cityForm as any).resetForm()
    let length = (this.$parent as any).cityOptions.length;
    (this.$parent as any).cityOptions.splice(0, length)
  }
  // 确定按钮
  private confirm() {
    // (this.$refs.cityForm as any).submitForm()
    this.handlePassChange()
  }
  // 验证通过
  async handlePassChange() {
    try {
      let params = {
        driverId: this.obj.driverId,
        workCity: this.listQuery.workCity,
        dmId: this.obj.joinManagerId
      }
      let { data: res } = await updateDriverWorkCityByDriverId(params)
      if (res.success) {
        this.show = false
        this.$message.success('操作成功');
        (this.$parent as any).getLists()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
}
</script>
<style scoped>
.a1111 .el-dialog__header {
  padding: 0;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  background: #2f448a;
  border-radius: 2px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
}
.remark{
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
