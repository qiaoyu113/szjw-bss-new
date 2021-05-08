<template>
  <div class="launchGuestContainer">
    <SelfDialog
      :visible.sync="showDialog"
      title="发起客邀"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="tryForm"
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="140px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassChange"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { CreateLaunchGuests, CreateLaunchGuestsBatch } from '@/api/departCenter'
import { GetDictionaryCity } from '@/api/common'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LaunchGuest',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) obj!:IState
  @Prop({ default: () => ({ lineId: '', matchId: '' }) }) launchArguments !:IState
  @Prop({ default: () => [] }) id!:any[]
  private showDialog:boolean = false
  private cityList:IState[] = []; // 城市列表
  private matchCustInviteInfo: any[] = []
  private listQuery:IState = {
    city: '',
    remarks: ''
  }
  private launchGuestState :number = 0
  private formItem:any[] = [
    {
      type: 2,
      label: '客邀城市',
      key: 'city',
      options: this.cityList
    },
    {
      type: 1,
      label: '备注',
      key: 'remarks',
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填,20字以内',
        clearable: true,
        maxlength: 20,
        'show-word-limit': true
      }
    }
  ]
  // 确定按钮
  private confirm() {
    (this.$refs.tryForm as any).submitForm()
    this.saveData()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.tryForm as any).resetForm()
  }
  // 验证通过
  handlePassChange() {
    this.showDialog = false
  }
  // 根据大区获取城市列表
  async cityDetail() {
    this.cityList.push({
      value: 0,
      label: '全部城市'
    })
    let { data: city } = await GetDictionaryCity()
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: +item.code,
          label: item.name
        }
      })
      this.cityList.push(...nodes)
    }
  }
  // 发起客邀
  async saveData() {
    if (this.launchGuestState === 1) {
      try {
        let params:IState = {
          matchId: this.launchArguments.matchId,
          lineId: this.launchArguments.lineId,
          city: this.listQuery.city,
          remarks: this.listQuery.remarks
        }
        let { data: res } = await CreateLaunchGuests(params)
        if (res.success) {
          this.$message.success('操作成功')
          this.$emit('success')
        } else {
        // this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`launch guest fail:${err}`)
      } finally {
      //
      }
    }
    if (this.launchGuestState === 2) {
      try {
        let params:IState = {
          matchCustInviteInfos: this.id,
          city: this.listQuery.city,
          remarks: this.listQuery.remarks
        }
        let { data: res } = await CreateLaunchGuestsBatch(params)
        if (res.success) {
          this.$message.success('操作成功')
          this.$emit('success')
        } else {
        // this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`launch guest fail:${err}`)
      } finally {
      //
      }
    }
  }
  init() {
    this.cityDetail()
  }
  mounted() {
    this.init()
  }
}
</script>
