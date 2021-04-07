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
            @click="getList(true)"
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
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template #lineName="scope">
          <el-link
            type="primary"
            @click="goDetails(scope.row.lineId)"
          >
            {{ scope.row.lineName }}
          </el-link>
        </template>
        <template #btn="scope">
          <el-button
            type="text"
            @click="offShelfHandler(scope.row)"
          >
            下架线路
          </el-button>
          <el-button
            type="text"
            @click="openSelectIgnore(scope.row.agentId,true)"
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
        已选择
        <el-link
          :underline="false"
          type="primary"
        >
          {{ dialogLineNum }}
        </el-link>
        条线路
      </div>
      <el-form
        ref="ignoreFormRef"
        :model="dialogForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="原因"
          prop="shelvesReasons"
        >
          <el-input
            v-model="dialogForm.shelvesReasons"
            type="textarea"
            maxlength="150"
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
      label: '待办编号：',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 6
    },
    {
      type: 1,
      key: 'key',
      label: '线路名称：',
      tagAttrs: {
        placeholder: '请输入名称/编号',
        clearable: true
      },
      col: 6
    },
    {
      type: 3,
      key: 'time',
      label: '待办生成时间：',
      tagAttrs: {
        placeholder: '请选择',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近一月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近三月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
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
      label: '待办编号'
    },
    {
      key: 'lineName',
      label: '线路名称',
      slot: true
    },
    {
      key: 'lineId',
      label: '线路编号'
    },
    {
      key: 'lineStatusName',
      label: '线路状态',
      width: '100px'
    },
    {
      key: 'shelvesReasons',
      label: '原因',
      width: '240px'
    },
    {
      key: 'lineCreateDate',
      label: '线路创建时间',
      width: '140px'
    },
    {
      key: 'createDate',
      label: '待办生成时间',
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
    shelvesReasons: ''
  }
  rules= {
    shelvesReasons: [
      { required: true, message: '请填写下架原因', trigger: 'blur' }
    ]
  }
  multipleSelection= []
  private selectRow = []
  private dialogTitle = '下架线路'

  mounted() {
    this.getList()
  }
  handleClosed() {
    this.dialogForm.shelvesReasons = ''
  }
  resetFrom(this:any) {
    this.$refs['fromRef'].resetForm()
  }
  // 选择表格列
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  private agentIds:Array<any> = []
  // 批量下架
  batchOffShelfHandler() {
    this.agentIds = [...this.multipleSelection]
    this.showDialog = true
    this.dialogTitle = '批量下架线路'
  }
  // 下架
  offShelfHandler(row:any) {
    this.agentIds = [row]
    this.showDialog = true
  }
  // 下架线路
  async confirm(this:any, callBack:Function) {
    try {
      await this.$refs['ignoreFormRef'].validate()
      const agentIds = this.agentIds.map((item:any) => item.agentId)
      const { data } = await offShelf(agentIds, {
        logoType: 1,
        shelvesReasons: this.dialogForm.shelvesReasons
      })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '下架成功'
        })
        this.agentIds = []
        setTimeout(() => {
          this.getList()
        }, 1500)
        callBack();
        (this.$refs.agentRef as any).toggleRowSelection()
      } else {
        this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      // if (!isSelect) {
      //   (this.$refs.agentRef as any).toggleRowSelection()
      // }
    } catch (error) {
      return error
    }
  }
  // 忽略线路
  async openSelectIgnore(row:any, isSelect:boolean = false) {
    let str = '已选择1条线路'
    let title = '是否忽略线路'
    let arr = [row]

    if (!isSelect) {
      const num = this.multipleSelection.length
      str = `已选择${num}条线路，确定忽略`
      title = '批量忽略线路'
      arr = this.multipleSelection.map((item:any) => item.agentId)
    }
    const err = await this.$confirm(str, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(async() => {
      const { data } = await passLine(arr, { logoType: 1 })
      if (data.success) {
        this.$message({
          type: 'success',
          message: '操作成功'
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
  goDetails(id:any) {
    this.$router.push({
      path: '/lineshelf/linedetail',
      query: { id }
    })
  }
  // 获取列表
  async getList(isReset:boolean = false) {
    try {
      const params:any = {}
      params.page = this.page.page
      params.limit = this.page.limit
      if (isReset) {
        params.page = 0;
        (this.$refs.agentRef as any).toggleRowSelection()
      }
      params.processingStatus = 1

      const { key, agentId } = this.formData
      key && (params.key = key)
      agentId && (params.agentId = agentId)
      const timeArr = this.formData.time
      if (timeArr && timeArr.length === 2) {
        let createDateStart = new Date(timeArr[0])
        let createDateEnd = new Date(timeArr[1])
        params.startCreateDate = createDateStart.setHours(0, 0, 0) || undefined
        params.endCreateDate = createDateEnd.setHours(23, 59, 59, 999) || undefined
      }
      const { data } = await getReaundanLineList(params)
      if (data.success) {
        this.tableData = data.data
        this.page.total = data.page.total
      }
      this.$emit('getnum')
    } catch (error) {
      return error
    }
  }
  get isBatch() {
    return this.multipleSelection.length === 0
  }
  get dialogLineNum() {
    return this.agentIds.length
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
