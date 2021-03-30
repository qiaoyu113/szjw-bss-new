<template>
  <div class="cpmplate-container">
    <self-form
      ref="fromRef"
      :list-query="formData"
      :form-item="formItem"
      label-width="120px"
      label-position="right"
      :pc-col="24"
    >
      <template #btn>
        <div style="float: right">
          <el-button
            type="primary"
            @click="getList"
          >
            查询
          </el-button>
          <el-button

            @click="resetFrom"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            :disabled="isBatch"
            @click="batchOffShelfHandler"
          >
            批量下架
          </el-button>
          <el-button
            type="primary"
            :disabled="isBatch"
            style="margin-right: 10px"
            @click="openSelectIgnore"
          >
            批量忽略
          </el-button>
        </div>
      </template>
    </self-form>
    <div class="table-container">
      <SelfTable
        ref="agentRef"
        style="padding: 30px 10px"
        :is-p30="false"
        :columns="columns"
        :table-data="tableData"
        :page="page"
        :operation-list="[]"
        row-key="a"
        @onPageSize="getList"
        @selection-change="handleSelectionChange"
      >
        <template #btn="scope">
          <el-button
            type="text"
            @click="offShelfHandler(scope.row)"
          >
            下架线路
          </el-button>
          <el-button
            type="text"
            @click="openSelectIgnore(scope.row.agentID,true)"
          >
            忽略
          </el-button>
        </template>
      </SelfTable>
    </div>
    <SelfDialog
      :visible.sync="showDialog"
      :title="dialogTitle"
      :width="'40%'"
      :confirm="confirm"
      :destroy-on-close="true"
      @closed="handleClosed"
    >
      <div style="margin: 20px 0">
        已选择{{ dialogLineNum }}条线路
      </div>
      <el-form
        ref="ignoreFormRef"
        :model="dialogForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="desc"
        >
          <el-input
            v-model="dialogForm.desc"
            type="textarea"
            placeholder="如：客户无用车需求"
          />
        </el-form-item>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getReaundanLineList, passLine, offShelf } from '@/api/line-shelf'
import { times } from 'lodash'
@Component({
  name: 'Agent',
  components: {
    LineLayout,
    NewLineAgent,
    SelfForm,
    SelfTable,
    SelfDialog
  }
})
export default class extends Vue {
  showVideo = false
  private active: string = '0'
  formItem = [
    {
      type: 1,
      key: 'agentId',
      label: '代办编号：',
      tagAttrs: {
        placeholder: '请输入'
      },
      col: 6
    },
    {
      type: 1,
      key: 'key',
      label: '线路名称：',
      tagAttrs: {
        placeholder: '请输入名称/编号'
      },
      col: 6
    },
    {
      type: 3,
      key: 'time',
      label: '代办生成时间：',
      tagAttrs: {
        placeholder: '请选择'
      },
      col: 12
    }
  ]
  formData = {
    agentId: '',
    key: '',
    time: []
  }
  columns = [
    {
      key: 'agentId',
      label: '代办编号'
    },
    {
      key: 'lineName',
      label: '线路名称',
      width: '140px'
    },
    {
      key: 'lineId',
      label: '线路编号',
      width: '140px'
    },
    {
      key: 'lineStatus',
      label: '线路状态',
      width: '140px'
    },
    {
      key: 'yunyin',
      label: '原因',
      width: '240px'
    },
    {
      key: 'createTime',
      label: '线路创建时间',
      width: '140px'
    },
    {
      key: 'argentTime',
      label: '代办生成时间',
      width: '140px'
    },
    {
      key: 'btn',
      label: '操作',
      width: '150px',
      fixed: 'right',
      slot: true
    }]
  private tableData = []
  page={
    limit: 30,
    page: 1,
    total: 50
  }
  showDialog:boolean= false
  dialogForm ={
    desc: ''
  }
  rules= {
    desc: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]
  }
  multipleSelection= []
  private selectRow = []
  private dialogTitle = '下架线路'

  mounted() {
    this.getList()
  }
  handleClosed() {
    this.dialogForm.desc = ''
  }
  resetFrom(this:any) {
    this.$refs['fromRef'].resetForm()
  }
  // 选择表格列
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  private offLine:Array<any> = []
  // 批量下架
  batchOffShelfHandler() {
    this.offLine = [...this.multipleSelection]
    this.showDialog = true
    this.dialogTitle = '批量下架线路'
  }
  // 下架
  offShelfHandler(row:any) {
    this.offLine = [row]
    this.showDialog = true
  }
  // 下架线路
  async confirm(this:any, callBack:Function) {
    try {
      await this.$refs['ignoreFormRef'].validate()
      const lineNo = this.offLine.map((item:any) => item.lineId).join(',')
      const { data } = await offShelf({ lineNo })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '下架成功'
        })
        this.lineNo = []
        setTimeout(() => {
          this.getList()
        }, 1500)
        callBack()
      } else {
        this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      (this.$refs.agentRef as any).toggleRowSelection()
      // if (!isSelect) {
      //   (this.$refs.agentRef as any).toggleRowSelection()
      // }
    } catch (error) {
      return error
    }
  }
  // 忽略线路
  async openSelectIgnore(row:any, isSelect:boolean = false) {
    console.log(row, isSelect)
    let str = '已选择1条线路'
    let title = '是否忽略线路'
    let arr = row
    if (!isSelect) {
      const num = this.multipleSelection.length
      str = `已选择${num}条线路`
      title = '批量忽略线路'
      arr = this.multipleSelection.map((item:any) => item.lineId).join(',')
    }
    const err = await this.$confirm(str, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(async() => {
      const { data } = await passLine({ arr })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '取消成功'
        })
        setTimeout(() => {
          this.getList()
        }, 1500)
      } else {
        this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      if (!isSelect) {
        (this.$refs.agentRef as any).toggleRowSelection()
      }
    }).catch(() => {
    })
  }
  // 获取列表
  async getList() {
    try {
      const params:any = {}
      params.page = this.page.page
      params.limit = this.page.limit
      params.agentStatus = 1
      const { key, agentId } = this.formData
      key && (params.key = key)
      agentId && (params.agentId = agentId)
      const timeArr = this.formData.time
      if (timeArr && timeArr.length === 2) {
        params.startCreateDate = timeArr[0]
        params.endCreateDate = timeArr[1]
      }
      const { data } = await getReaundanLineList(params)
      this.tableData = data.data
    } catch (error) {
      return error
    }
  }
  get isBatch() {
    return this.multipleSelection.length === 0
  }
  get dialogLineNum() {
    return this.offLine.length
  }
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 12px;
  padding: 12px;
  background: #fff;
}
</style>
