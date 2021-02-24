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
          v-permission="['root']"
          type="primary"
          size="small"
          @click="goRoute('addPay')"
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
          v-permission="['root']"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="times === 10 ? false :true"
          name="driverlist_offout_btn"
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
      >
        <template v-slot:num="scope">
          <template v-if="scope.header">
            <div style="line-height:1.2">
              入池次数<br>(该线索类型)
            </div>
          </template>
          <template v-else>
            {{ scope.row.createDate }}
          </template>
        </template>
        <template v-slot:createDate="scope">
          {{ scope.row.createDate }}
        </template>
        <template v-slot:op="scope">
          <el-button
            type="text"
            @click="handleAllotClick(scope.row)"
          >
            分配
          </el-button>
        </template>
      </self-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showWork } from '@/utils/index'
import { marketClue } from '@/api/driver-cloud'
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
  times:number = 10;
  private listLoading: boolean = false;
  private listQuery: IState = {
    clueType: 0,
    phone: '',
    haveCar: '',
    time: [],
    onlyMe: ''
  };
  private tableData: any[] = [];
  private multipleSelection: any[] = []; // 当前页选中的数据
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
      key: 'phone',
      rules: ['root'],
      tagAttrs: {
        placeholder: '请输入客群类型',
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      label: '目标画像标签',
      key: 'phone',
      rules: ['root'],
      tagAttrs: {
        type: 'tel',
        placeholder: '请输入',
        maxlength: 11,
        'show-word-limit': true,
        clearable: true
      },
      listeners: {
        input: this.oninputOnlyNum
      }
    },
    {
      type: 2,
      label: '分配机制',
      key: 'haveCar',
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
      col: 24,
      slot: true,
      w: '0px',
      rules: ['root']
    }
  ];
  private columns: any[] = [
    {
      key: 'marketClueId',
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
      key: 'name',
      label: '客群类型',
      rules: ['root']
    },
    {
      key: 'phone',
      label: '目标画像标签',
      width: '120px',
      rules: ['root']
    },
    {
      key: 'haveCar',
      label: '分配机制',
      rules: ['root']
    },
    {
      key: 'cityName',
      label: '分配机制管理员',
      width: '130px',
      rules: ['root']
    },
    {
      key: 'cityName1',
      label: 'policy干涉人',
      rules: ['root']
    },
    {
      key: 'cityName2',
      label: '分配人',
      rules: ['root']
    },
    {
      key: 'carTypeName',
      label: '监督人',
      rules: ['root']
    },
    {
      key: 'carTypeName1',
      label: '备注',
      rules: ['root']
    },
    {
      key: 'cityName3',
      label: '邀约语',
      rules: ['root']
    },
    {
      key: 'cityName4',
      label: '面试语',
      rules: ['root']
    },
    {
      key: 'cityName5',
      label: 'Campaign数',
      rules: ['root']
    },
    {
      key: 'cityName6',
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
    // (this.$refs['suggestForm'] as any).resetForm()
    // this.getLists()
  }
  // 批量分配
  private handleallAllotClick() {
    // this.dialogTit = '批量分配'
    // this.showDialog = true
    // this.rowData.push(...this.multipleSelection)
  }

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
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
        limit: this.page.limit
      }
      let { data: res } = await marketClue(params)
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
