<template>
  <div
    v-loading="listLoading"
    class="PublicClue"
    :class="{
      p15: isPC
    }"
  >
    <self-form
      ref="suggestForm"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="80px"
      class="p15 SuggestForm"
      :pc-col="6"
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
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleallAllotClick"
        >
          批量分配
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="times === 10 ? false :true"
          @click="_exportFile"
        >
          导出<template v-if="times !== 10">
            {{ times }} s
          </template>
        </el-button>
      </div>
    </self-form>

    <div class="table_box">
      <div>
        <el-badge
          v-for="item in btns"
          :key="item.text"
          :value="item.num"
          :max="9999"
          :hidden="item.num === 0"
        >
          <el-button
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="() => {
              listQuery.status = item.name
              handleFilterClick()
            }"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </div>
      <self-table
        ref="PublicClueTable"
        :height="tableHeight"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :index="true"
        :page="page"
        row-key="marketClueId"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
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
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import { HandlePages, lock } from '@/utils/index'
import SelfForm from '@/components/Base/SelfForm.vue'
import { delayTime } from '@/settings'
import { exportFileTip } from '@/utils/exportTip'
import { marketClue, allocationClue } from '@/api/driver-cloud'
import {
  today,
  yesterday,
  month,
  lastmonth,
  threemonth
} from '../driver-freight/components/date'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}

interface formItem {
  type?: number | string;
  label?: string;
  key?: string;
  col?: number;
  tagAttrs?: object;
  listeners?: object;
  options?: IState[];
  slot?: boolean;
  w?: string;
}
@Component({
  name: 'PublicClue',
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  times: number = 10;
  private listLoading: boolean = false;
  private clueArr: IState[] = [
    { name: '梧桐专车', code: 0 },
    { name: '梧桐共享', code: 1 },
    { name: '雷鸟供给C', code: 2 },
    { name: '雷鸟租赁C', code: 3 },
    { name: '雷鸟租赁B', code: 4 }
  ];
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
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  private btns: any[] = [
    {
      name: '',
      text: '全部',
      num: 0
    },
    {
      name: '10',
      text: '待跟进',
      num: 0
    },
    {
      name: '30',
      text: '跟进中',
      num: 0
    },
    {
      name: '40',
      text: '邀约成功',
      num: 0
    },
    {
      name: '50',
      text: '已面试',
      num: 0
    },
    {
      name: '60',
      text: '已成交',
      num: 0
    }
  ];
  private formItem: formItem[] = [
    {
      type: 'tabGroup',
      col: 24,
      slot: true,
      w: '0px'
    },
    {
      type: 2,
      label: '所属城市',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 1,
      label: '姓名',
      key: 'name',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      }
    },
    {
      type: 1,
      label: '手机号',
      key: 'phone',
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
      label: '是否有车',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '车型',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '加盟小组',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '跟进人',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '渠道',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '邀约情况',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '意向度',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 2,
      label: '邀约失败原因',
      w: '120px',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.hasCarList
    },
    {
      type: 5,
      label: '只看自己',
      key: 'onlyMe',
      options: [
        {
          label: '',
          value: 1
        }
      ]
    },
    {
      type: 3,
      col: 12,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [today, yesterday, month, lastmonth, threemonth]
        }
      },
      label: '创建日期',
      key: 'time'
    },
    {
      type: 'mulBtn',
      col: 12,
      slot: true,
      w: '0px'
    }
  ];

  private columns: any[] = [
    {
      key: 'phone',
      label: '手机号',
      width: '120px'
    },
    {
      key: 'haveCar',
      label: '是否有车'
    },
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'busiTypeName',
      label: '业务线',
      width: '100px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      width: '150px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 400
    return (
      document.body.offsetHeight - otherHeight ||
      document.documentElement.offsetHeight - otherHeight
    )
  }

  // 查询
  private handleFilterClick() {
    (this.$refs.PublicClueTable as any).toggleRowSelection()
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

  private handleSelectionChange(val: any) {
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
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data || []
        this.btns.forEach((item) => {
          let key = item.name
          key = +key
          item.num = res.title[key]
        })
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
<style lang="scss" scope>
.PublicClue {
  .el-radio-group {
    margin-bottom: 0 !important;
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
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  }
  .table_box {
    padding: 10px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
