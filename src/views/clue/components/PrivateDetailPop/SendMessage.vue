/* eslint-disable vue/no-v-html */
<template>
  <div class="SendMessage">
    <SelfDialog
      :visible.sync="show"
      title="发送短信"
      :confirm="confirm"
      width="600px"
      :sumbit-again="submitLoading"
      @closed="handleDialogClosed"
    >
      <SelfForm
        ref="dialogSendMessage"
        :rules="rules"
        :list-query="dialogPopQuery"
        :form-item="sendFormItem"
        size="small"
        label-width="110px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div slot="type">
          <el-button
            v-for="(item,index) in typeArr"
            :key="index"
            :type="dialogPopQuery.messageType === item.code ? 'primary' : ''"
            @click="dialogPopQuery.messageType = item.code"
          >
            {{ item.name }}
          </el-button>
        </div>
      </SelfForm>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p
        v-if="canPreview"
        class="previewMessage"
      >
        <span style="color:#242020">预览：</span>
        <span
          class="messageTitle"
          v-html="messageText"
        />
        <ul v-if="itemData.length > 0">
          <li
            v-for="(item,index) in itemData"
            :key="index"
          >
            <span>{{ item.label }}：</span>
            <span style="color:#242020">{{ item.value }}</span>
          </li>
        </ul>
      </p>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { lock, Timestamp, phoneRegExp } from '@/utils/index'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'sendMessage',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog!: boolean;

  private submitLoading: boolean = false;

  private typeArr:object[] = [
    { name: '邀约成功', code: 0 },
    { name: '邀约失败', code: 1 },
    { name: '首邀未联系上', code: 2 }
  ]

  private checkPhone = (rule:any, value:any, callback:any) => {
    if (phoneRegExp.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确格式手机号'))
    }
  };

  private rules: IState = {
    messageType: [{ required: true, message: '请选择短信模板类型' }],
    name: [{ required: true, message: '请输入司机姓名' }],
    inviteAddress: [{ required: true, message: '请输入面试地址' }],
    inviteTime: [{ required: true, message: '请选择面试时间' }],
    linkman: [{ required: true, message: '请输入联系人' }],
    phone: [{ type: 'string', required: true, message: '请输入联系电话' }, { validator: this.checkPhone, trigger: 'blur' }]
  };

  private dialogPopQuery: IState = {
    messageType: 0,
    name: '',
    inviteAddress: '',
    inviteTime: '',
    linkman: '',
    phone: ''
  }

  private dialogFormItem :IState[] = [
    {
      slot: true,
      type: 'type',
      key: 'messageType',
      label: '短信模板类型',
      col: 24
    },
    {
      type: 1,
      key: 'name',
      label: '司机姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写司机姓名，例司机姓名+“师傅”',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 9,
      key: 'inviteTime',
      label: '面试时间',
      col: 24,
      tagAttrs: {
        placeholder: '请选择面试时间'
      }
    },
    {
      type: 1,
      key: 'inviteAddress',
      label: '面试地址',
      col: 24,
      tagAttrs: {
        placeholder: '请输入详细公司地址',
        maxlength: '30',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'linkman',
      label: '联系人',
      col: 24,
      tagAttrs: {
        placeholder: '请输入联系人',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '联系电话',
      col: 24,
      tagAttrs: {
        placeholder: '请输入联系电话'
      }
    }
  ]

  private canPreview:boolean = false;

  private messageText:string = ''

  private itemData:object[] = []

  get sendFormItem() {
    let arr:object[] = []
    let noneArr:string[] = ['linkman', 'inviteAddress', 'inviteTime']
    switch (this.dialogPopQuery.messageType) {
      case 0:
        arr = [...this.dialogFormItem]
        break
      case 1:
        arr = this.dialogFormItem.filter((ele:any) => {
          return ele.key !== 'inviteTime'
        })
        break
      case 2:
        arr = this.dialogFormItem.filter((ele:any) => {
          let log = noneArr.includes(ele.key)
          return !log
        })
        break
    }
    return arr
  }

  get show() {
    return this.showDialog
  }

  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  @Watch('dialogPopQuery.messageType')
  changeType(val:any) {
    (this.$refs['dialogSendMessage'] as any).clearValidate()
  }

  // 短信模板预览
  @Watch('dialogPopQuery', { deep: true })
  changeQuery(val: any, oldVal: any) {
    let arr:string[] = []
    this.sendFormItem.forEach((ele:any) => {
      if (ele.key) {
        arr.push(ele.key)
      }
    })

    this.canPreview = !Object.entries(val).filter(ele => {
      return arr.includes(ele[0])
    }).some(item => {
      return item[1] === '' || item[1] === null || item[1] === undefined
    })

    if (!phoneRegExp.test(val.phone)) {
      this.canPreview = false
    }

    if (this.canPreview) {
      this.showPreview(val)
    }
  }

  // 短信预览是否显示
  private showPreview(val:any) {
    if (val.messageType === 0) {
      this.messageText = `<span>  
      【云鸟配送】<span style="color:#242020">${this.dealWithName(val.name)}</span>师傅您好，已成功为您预约云鸟面试，现场已有专业的加盟经理等待您的到来。请您携带本人身份证，驾驶证，行驶证准时参加。路上注意安全，期待与您的会面！
      </span>`
    } else if (val.messageType === 1) {
      this.messageText = `<span>【云鸟配送】<span style="color:#242020">${this.dealWithName(val.name)}</span>师傅，您好，感谢您的接听，非常期待师傅您的加入。云鸟线路实时更新，更多更新的线路等待与您的匹配。</span>`
    } else {
      this.messageText = `<span>【云鸟配送】<span style="color:#242020">${this.dealWithName(val.name)}</span>师傅您好，您的信息已审核。诚邀您加入云鸟，不需要抢单，货源充足，有多条线路可以任你选择，详情请联系：<span style="color:#242020">${val.phone}</span>（微信同号）。回T退订。</span>`
    }

    this.itemData = []

    this.sendFormItem.forEach((ele:any) => {
      if (!ele.slot && val.messageType !== 2) {
        let item:IState = {
          label: ele.label,
          key: ele.key
        }
        for (let key in val) {
          if (key === ele.key) {
            if (key === 'inviteTime') {
              let timeArr = Timestamp(val[key]).split(' ')[0].split('-')
              item.value = `${timeArr[0]}年${timeArr[1]}月${timeArr[2]}日  ${Timestamp(val[key]).split(' ')[1]}`
            } else {
              item.value = val[key]
            }
          }
        }
        this.itemData.push(item)
      }
    })
  }

  private dealWithName(val:string) {
    return val.indexOf('师傅') !== -1 ? val.replace('师傅', '') : val
  }

  // 弹框确认
  private confirm() {}

  // 弹窗关闭
  private handleDialogClosed() {
    (this.$refs['dialogSendMessage'] as any).resetForm()
    setTimeout(() => {
      (this.$refs['dialogSendMessage'] as any).clearValidate()
    }, 10)
  }

  // 验证通过
  @lock
  private async handlePassClick(val: boolean) {}
}
</script>
<style lang="scss" scoped>
.SendMessage{
  .previewMessage{
    padding: 15px 30px;
    box-sizing: border-box;
    word-wrap:break-word;
    color: #9e9e9e ;
    line-height: 20px;
    ul,li{ padding:0;margin:0;list-style:none}
  }
}
  .messageTitle >>> .nameText{
    color: #242020;
  }
</style>
