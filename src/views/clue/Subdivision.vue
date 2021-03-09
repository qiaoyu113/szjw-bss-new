<template>
  <div
    v-loading="listLoading"
    class="Subdivision"
    :class="{
      p15: isPC
    }"
  >
    <self-form
      ref="suggestForm"
      :list-query="listQuery"
      :form-item="formItems"
      size="small"
      label-width="7em"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div slot="tabGroup">
        <el-radio-group
          v-model="listQuery.clueType"
          style="margin-bottom: 30px;"
        >
          <el-radio-button
            v-for="item in clueArr"
            :key="item.code"
            :label="item.code"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          type="primary"
          size="small"
          @click="handleAddClick"
        >
          新建客群
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          :disabled="times === 10 ? false :true"
          name="driverlist_offout_btn"
          type="primary"
          size="small"
          @click="_exportFile"
        >
          导出<template v-if="times !== 10">
            {{ times }} s
          </template>
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <self-table
        ref="PublicClueTable"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="tableColumns"
        :index="true"
        :page="page"
        row-key="marketClueId"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :default-sort="{prop: 'createDate', order: 'descending'}"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!--新建客群-->
    <el-dialog
      title="新建客群"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        ref="ruleAddForm"
        :model="addForm"
        :rules="ruleAddForm"
        label-width="130px"
      >
        <el-form-item
          label="业务线"
          prop="busiType"
        >
          <el-select
            v-model="addForm.busiType"
            placeholder="请选择"
          >
            <el-option
              v-for="(sub,index) in busiTypeArr"
              :key="'select-'+sub.value+'-'+index"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="客群类型"
          prop="type"
        >
          <el-col :span="16">
            <el-input
              v-model="addForm.type"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="目标画像标签"
          prop="portraitLabel"
        >
          <el-col :span="16">
            <el-input
              v-model="addForm.portraitLabel"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="分配机制"
          prop="distributionType"
        >
          <el-select
            v-model="addForm.distributionType"
            placeholder="请选择"
          >
            <el-option
              v-for="(sub,index) in distributionTypeArr"
              :key="'select-'+sub.value+'-'+index"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="分配机制管理员"
          prop="distributionManageId"
        >
          <el-select
            v-model="addForm.distributionManageId"
            placeholder="请选择"
          >
            <el-option
              v-for="(sub,index) in distributionManageArr"
              :key="'select-'+sub.value+'-'+index"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="邀约语"
          prop="inviteWord"
        >
          <el-col :span="16">
            <el-input
              v-model="addForm.inviteWord"
              type="textarea"
              maxlength="300"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="面试语"
          prop="interviewWord"
        >
          <el-col :span="16">
            <el-input
              v-model="addForm.interviewWord"
              type="textarea"
              maxlength="300"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-col :span="16">
            <el-input
              v-model="addForm.remark"
              type="textarea"
              maxlength="300"
              show-word-limit
            />
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel('ruleAddForm')">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="addCustomers('ruleAddForm')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showWork } from '@/utils/index'
import { getClueUserGroupList } from '@/api/clue'
import { today, yesterday, sevenday, thirtyday } from '@/views/driver-freight/components/date'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}
interface formItem {
  [key: string]: any;
  type?: number | string;
  label?: string;
  key?: string;
  col?: number;
  tagAttrs?: object;
  listeners?: object;
  options?: IState[];
  slot?:boolean,
  w?:string
}
@Component({
  name: 'Subdivision',
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  @Watch('listQuery.clueType', { deep: true })
  private onListQueryChange(value: any) {
    this.getLists()
  }
  times:number = 10;
  private listLoading: boolean = false;
  private dialogFormVisible: boolean = false;
  private listQuery: IState = {
    clueType: 0,
    distributionType: '',
    limit: '',
    page: '',
    portraitLabel: '',
    startDate: '',
    endDate: '',
    time: [],
    type: ''
  };
  private showDialog: boolean = false;
  private tableData: any = [];
  private busiTypeArr: any = [];
  private distributionTypeArr: any = [];
  private distributionManageArr: any = [];

  private hasCarList: IState[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private clueArr:IState[] = [
    { name: '梧桐专车', code: 0 },
    { name: '梧桐共享', code: 1 },
    { name: '雷鸟车池', code: 2 },
    { name: '雷鸟租赁', code: 3 }
  ]
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  private shortcuts = [
    today,
    yesterday,
    sevenday,
    thirtyday
  ]
  // 新增表单校验
  private ruleAddForm: any = {
    type: [
      { required: true, message: '请输入客群类型', trigger: 'blur' },
      { min: 1, max: 20, message: '最多可输入20字', trigger: 'blur' }
    ],
    busiType: [
      { required: true, message: '请选择业务线', trigger: 'change' }
    ],
    portraitLabel: [
      { required: true, message: '请输入目标画像标签', trigger: 'blur' },
      { min: 1, max: 20, message: '最多可输入20字', trigger: 'blur' }
    ],
    distributionType: [
      { required: true, message: '请选择分配机制', trigger: 'change' }
    ],
    distributionManageId: [
      { required: true, message: '请选择分配机制管理员', trigger: 'change' }
    ]
  }
  // 表单addForm
  private addForm: any = {
    busiType: '',
    type: '',
    portraitLabel: '',
    distributionType: '',
    distributionManageId: '',
    inviteWord: '',
    interviewWord: '',
    remark: ''
  }
  /**
   * rules: []
   * root 为全局显示
   * */
  private formItem: formItem[] = [
    {
      type: 'tabGroup',
      col: 24,
      slot: true,
      w: '0px',
      rules: ['root']
    },
    {
      type: 1,
      label: '客群类型',
      key: 'type',
      rules: ['root'],
      tagAttrs: {
        placeholder: '请输入客群类型',
        maxlength: 20,
        clearable: true
      }
    },
    {
      type: 1,
      label: '目标画像标签',
      key: 'portraitLabel',
      rules: ['root'],
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 20,
        clearable: true
      }
    },
    {
      type: 2,
      label: '分配机制',
      key: 'distributionType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: ['root'],
      options: this.hasCarList
    },
    {
      type: 3,
      col: 12,
      rules: ['root'],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: this.shortcuts
        }
      },
      label: '创建时间',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 12,
      slot: true,
      w: '0px',
      rules: ['root']
    }
  ];
  private columns: any[] = [
    {
      key: 'groupId',
      label: '客群细分ID',
      width: '150px',
      rules: ['root']
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      rules: ['root']
    },
    {
      key: 'typeName',
      label: '客群类型',
      rules: ['root']
    },
    {
      key: 'portraitLabel',
      label: '目标画像标签',
      width: '120px',
      rules: ['root']
    },
    {
      key: 'distributionTypeName',
      label: '分配机制',
      rules: ['root']
    },
    {
      key: 'distributionManageName',
      label: '分配机制管理员',
      width: '130px',
      rules: ['root']
    },
    {
      key: 'remark',
      label: '备注',
      rules: ['root']
    },
    {
      key: 'inviteWord',
      label: '邀约语',
      rules: ['root']
    },
    {
      key: 'interviewWord',
      label: '面试语',
      rules: ['root']
    },
    {
      key: 'campaignNum',
      label: 'Campaign数',
      rules: ['root']
    },
    {
      key: 'createName',
      label: '创建人',
      rules: ['root']
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      attrs: {
        sortable: true
      },
      width: '150px',
      rules: ['root']
    }
  ];
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // formitem 筛选
  get formItems() {
    return this.formItem.filter((item: any) => {
      return item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)
    })
  }
  // formitem 筛选
  get tableColumns() {
    return this.columns.filter((item: any) => {
      return item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)
    })
  }
  // 查询
  private handleFilterClick() {
    // (this.$refs.PublicClueTable as any).toggleRowSelection()
    this.page.page = 1
    this.getLists()
  }
  // 重置
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
    this.getLists()
  }

  private handleSelectionChange(val:any) {
  }

  private oninputOnlyNum(value: string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }

  // 导出文件
  _exportFile() {
    // exportFileTip(this, this.)
  }

  // 获取列表
  @lock
  private async getLists() {
    try {
      this.listLoading = true
      let params: IState = {
        page: this.page.page,
        limit: this.page.limit,
        clueType: this.listQuery.clueType,
        distributionType: this.listQuery.distributionType,
        portraitLabel: this.listQuery.portraitLabel,
        startDate: this.listQuery.time[0],
        endDate: this.listQuery.time[1],
        type: this.listQuery.type
      }
      let { data: res } = await getClueUserGroupList(params)
      if (res.success) {
        // eslint-disable-next-line
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data || []
      } else {
        this.tableData = res.data || []
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }

  // 新增客群
  handleAddClick() {
    this.dialogFormVisible = true
  }

  // 确认新增
  addCustomers(formName: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        console.log(this.addForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 取消新建
  cancel(formName: any) {
    this.dialogFormVisible = false;
    (this.$refs[formName] as any).resetFields()
  }

  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
.Subdivision {
  .el-radio-group{
    margin-bottom: 0!important;
  }
  .btnPc {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  .mobile {
    width: 100%;
    text-align: center;
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width: 80%;
    }
  }
  .SuggestForm {
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    padding-bottom: 0;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  }
  .table_box {
    padding: 30px 30px 0px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
