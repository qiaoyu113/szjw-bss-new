<template>
  <SelfDialog
    :visible.sync="show"
    append-to-body
    width="500px"
    :title="allotTitle"
    :confirm="confirm"
    custom-class="a1111"
    :destroy-on-close="false"
    @close="close"
    @open="open"
  >
    <self-form
      ref="allotForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    />
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator'
import { delayTime } from '@/settings'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { updateDriverDmBatch } from '@/api/departCenter'
import { GetSpecifiedLowerUserListByCondition } from '@/api/common'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'allotDio',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) dialogVisible!: boolean; // 弹框显示
  @Prop({ default: '分配司撮' }) allotTitle?: string; // 标题
  @Prop({ default: '' }) cityCode!: number;
  @Prop({ default: [] }) driverIdList!: string[];
  @PropSync('dialogVisible', { type: Boolean }) show!: Boolean;
  private managerList: IState[] = []; // 取消原因
  private listQuery: IState = {
    dmId: ''
  };
  private formItem: any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司撮经理',
      key: 'dmId',
      options: this.managerList
    }
  ];
  private rules: IState = {
    dmId: [
      {
        required: true,
        message: '请选择司撮经理',
        trigger: 'blur'
      }
    ]
  };

  private async open() {
    try {
      let params = {
        roleTypes: [15],
        cityCode: String(this.cityCode),
        uri: '/v2/driver/updateDriverDmBatch'
      }
      let { data: res } = await GetSpecifiedLowerUserListByCondition(params)
      if (res.success) {
        let length = this.managerList.length
        if (length > 0) {
          this.managerList.splice(0, length)
        }
        if (res.data.length && res.data.length > 0) {
          let arr = res.data.map((item:IState) => {
            return { label: `${item.name}(${item.mobile})`, value: item.id }
          })
          this.managerList.push(...arr)
        }
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }

  private close() {
    (this.$parent as any).allotTitle = '';
    (this.$refs.allotForm as any).resetForm()
    let length = (this.$parent as any).driverIdList.length;
    (this.$parent as any).driverIdList.splice(0, length)
    this.$emit('close')
  }
  // 确定按钮
  private confirm() {
    (this.$refs.allotForm as any).submitForm()
  }
  // 验证通过
  async handlePassChange() {
    try {
      let params = {
        dmId: this.listQuery.dmId,
        driverIdList: this.driverIdList
      }
      let { data: res } = await updateDriverDmBatch(params)
      if (res.success) {
        if (res.data.flag) {
          this.$message.success(res.data.msg)
          this.show = false
          setTimeout(() => {
            (this.$parent as any).getLists()
          }, delayTime)
        } else {
          this.$message.warning(res.data.msg)
        }
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
}
</script>
<style >
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
</style>
