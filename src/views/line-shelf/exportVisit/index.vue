<template>
  <div class="exportVisit">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="120px"
      size="small"
      :pc-col="8"
    >
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="times === 10 ? false :true"
          type="primary"
          @click="_exportFile"
        >
          导出<template v-if="times !== 10">
            {{ times }} s
          </template>
        </el-button>
      </div>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import { exportFileTip } from '@/utils/exportTip'
import { visitExport } from '@/api/line-shelf'
import { lock } from '@/utils/index'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Agent',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  times:number = 10;
  private ExportClick:boolean = false
  private listQuery: IState = {
    visitTime: []
  }
  private formItem:any[]=[
    {
      type: 3,
      key: 'visitTime',
      label: '拜访时间',
      col: 12,
      tagAttrs: {
        clearable: true,
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一周',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近三月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      }
    },
    {
      type: 'mulBtn',
      col: 14,
      slot: true,
      w: '0px'
    }
  ]
  mounted() {

  }
  get isPC() {
    return SettingsModule.isPC
  }
  private async qwwer() {
    try {
      //
    } catch (error) {
      return error
    }
  }
  // 导出文件
  _exportFile() {
    exportFileTip(this, this.handleExportClick)
  }
  // 导出
  @lock
  private async handleExportClick(sucFun:Function) {
    try {
      this.ExportClick = true
      let params:IState = {}
      if (this.listQuery.visitTime && this.listQuery.visitTime.length > 0) {
        let startDate = new Date(this.listQuery.visitTime[0])
        let endDate = new Date(this.listQuery.visitTime[1])
        startDate.setHours(0, 0, 0)
        endDate.setHours(23, 59, 59)
        params.startDate = startDate.setHours(0, 0, 0)
        params.endDate = endDate.setHours(23, 59, 59)
        let { data: res } = await visitExport(params)
        if (res.success) {
          sucFun()
          this.ExportClick = false
          this.$message({
            type: 'success',
            message: '导出成功!'
          })
        } else {
          this.ExportClick = false
          this.$message.error(res.errorMsg)
        }
      } else {
        this.$message('请选取拜访时间后导出数据')
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    }
  }
}

</script>

<style lang="scss" scoped>
.exportVisit {
  margin: 12px 12px 0 12px;
  padding-top: 20px;
  height: 98%;
  background-color: #fff;
  box-sizing: content-box;
  .btnPc {
       width: 100%;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
}
</style>
