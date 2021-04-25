
<template>
  <div
    v-loading="listLoading"
    class="LineList"
    :class="{
      p15: isPC
    }"
  >
    <div class="box">
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="110px"
        class="p15 SuggestForm"
        :pc-col="6"
      >
        <template slot="customerStatus">
          <el-badge
            v-for="item in btns"
            :key="item.text"
          >
            <el-button
              type="primary"
              margin-right="20px"
              :plain="item.name !== listQuery.customerStatus"
              @click="() => {
                listQuery.customerStatus = item.name
                handleFilterClick()
              }"
            >
              {{ item.text }}
            </el-button>
          </el-badge>
        </template>
        <div
          slot="mulBtn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <div>
            <el-button
              type="primary"
              @click="batchLaunchGuest"
            >
              批量发起客邀
            </el-button>
            <el-button
              type="primary"
            >
              批量取消客邀
            </el-button>
          </div>
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </self-form>
      <div class="table_box">
        <div class="middle" />
        <span>筛选结果：{{ 111 }}条</span>
        <!-- <self-table
          ref="RefundForm"
          :index="listQuery.status === '3'"
          :is-p30="false"
          :operation-list="[]"
          :table-data="tableData"
          :columns="columns"
          row-key="id"
          :page="page"
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:op="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick(scope.row)"
            >
              发起客邀
            </el-button>
            <el-button
              type="text"
              size="small"
            >
              取消客邀
            </el-button>
            <el-button
              type="text"
              size="small"
            >
              查看详情
            </el-button>
          </template>
        </self-table> -->
        <Btable
          :list-query="listQuery"
          :is-show-percent="true"
          :obj="{}"
          @launchGuest="handleLaunchGuest"
          @cancelGuest="handleCancelGuest"
        />
        <pagination
          :operation-list="[]"
          :total="page.total"
          :page.sync="page.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :limit.sync="page.limit"
          @pagination="handlePageSizeChange"
        />
      </div>
      <launch-guest
        ref="launchGuest"
        :obj="obj"
      />
      <cancel-guest ref="cancelGuest" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../js/index'
import Btable from './components/Btable.vue'
import LaunchGuest from './components/LaunchGuests.vue'
import CancelGuest from './components/CancelGuest.vue'
import Pagination from '@/components/Pagination/index.vue'

interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LineList',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog,
    Btable,
    Pagination,
    LaunchGuest,
    CancelGuest
  }
})
export default class extends Vue {
  private obj:IState = {}
  private listLoading:boolean = false
  private carLists:IState[] = [] // 车型列表
  private labelTypeArr:IState[] = [] // 线路肥瘦
  // private multipleSelection: any[] = []
  private showDialog: boolean = false
  private tableData:any[] = []
  private listQuery:IState = {
    workCity: [],
    carType: '',
    lineFineness: '',
    handlingDifficulty: '',
    freightSection: '',
    workTime: '',
    warehouseLocation: '',
    distributionArea: '',
    stabilityTemporary: '',
    lineName: '',
    status: ''
  }
  private formItem:any[] = [
    {
      type: 2,
      key: 'workCity',
      label: '城市',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 2,
      key: 'carType',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.carLists
    },
    {
      type: 2,
      key: 'lineFineness',
      label: '线路肥瘦',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.labelTypeArr
    },
    {
      type: 2,
      key: 'handlingDifficulty',
      label: '装卸难度',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '不装卸',
          value: 1
        },
        {
          label: '只装不卸（轻）',
          value: 2
        },
        {
          label: '只卸不装（轻）',
          value: 3
        },
        {
          label: '只装不卸（重）',
          value: 4
        },
        {
          label: '只卸不装（重）',
          value: 5
        },
        {
          label: '重装卸（重）',
          value: 6
        }
      ]
    },
    {
      type: 2,
      key: 'freightSection',
      label: '单趟运费区间',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 2,
      key: 'workTime',
      label: '工作时间段',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'warehouseLocation',
      label: '仓库位置',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      }
    },
    {
      type: 8,
      key: 'distributionArea',
      label: '配送区域',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      }
    },
    {
      type: 2,
      key: 'stabilityTemporary',
      label: '稳定/临时',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '稳定',
          value: 1
        },
        {
          label: '临时',
          value: 2
        }
      ]
    },
    {
      type: 1,
      key: 'lineName',
      label: '线路名称/编号',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      col: 14,
      label: '客邀状态',
      type: 'customerStatus',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 10,
      slot: true,
      w: '0px'
    }
  ]
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '未发起客邀'
    },
    {
      name: '3',
      text: '已发起客邀'
    },
    {
      name: '4',
      text: '客邀撮合成功'
    },
    {
      name: '2',
      text: '司推撮合成功'
    }
  ]
  // private columns:any[] = [
  //   {
  //     key: 'basicsMessage',
  //     label: '基础信息'
  //   },
  //   {
  //     key: 'car',
  //     label: '车辆'
  //   },
  //   {
  //     key: 'deliveryMessage',
  //     label: '配送信息'
  //   },
  //   {
  //     key: 'settlement',
  //     label: '结算'
  //   },
  //   {
  //     key: 'lineCharacteristic',
  //     label: '线路特点'
  //   },
  //   {
  //     key: 'label',
  //     label: '标签'
  //   },
  //   {
  //     key: 'status',
  //     label: '状态'
  //   },
  //   {
  //     key: 'op',
  //     label: '操作'
  //   }
  // ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 分页
  // handlePageSize(page:PageObj) {
  //   this.page.page = page.page
  //   this.page.limit = page.limit
  // }
  // 分页
  handlePageSizeChange(page:number, limit:number) {
    if (page) {
      this.page.page = page
    }
    if (limit) {
      this.page.limit = limit
    }
    this.getList()
  }
  // handleSelectionChange(val:any) {
  //   this.multipleSelection = val
  // }
  // 查询
  handleFilterClick() {
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      workCity: [],
      carType: '',
      lineFineness: '',
      handlingDifficulty: '',
      freightSection: '',
      workTime: [],
      warehouseLocation: '',
      distributionArea: '',
      stabilityTemporary: '',
      lineName: '',
      status: ''
    }
  }
  // 获取列表
  private async getList() {
    try {
      this.listLoading = true
      let params: IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.carType !== '' && (params.carType = this.listQuery.carTpe)
      this.listQuery.lineFineness !== '' && (params.lineFineness = this.listQuery.lineFineness)
      this.listQuery.handlingDifficulty !== '' && (params.handlingDifficulty = this.listQuery.handlingDifficulty)
      this.listQuery.freightSection !== '' && (params.freightSection = this.listQuery.freightSection)
      this.listQuery.warehouseLocation !== '' && (params.warehouseLocation = this.listQuery.warehouseLocation)
      this.listQuery.distributionArea !== '' && (params.distributionArea = this.listQuery.distributionArea)
      this.listQuery.stabilityTemporary !== '' && (params.stabilityTemporary = this.listQuery.stabilityTemporary)
      // let { data: res } = await getLists(params)
    } catch (err) {
      console.log(`getlist fail:${err}`)
    } finally {
      this.listLoading = false
      //
    }
  }
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['Intentional_compartment', 'line_label']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.labelTypeArr.push(...mapDictData(res.data.line_label || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
  }
  // 发起客邀
  handleLaunchGuest() {
    (this.$refs.launchGuest as any).showDialog = true
  }
  // 取消客邀
  handleCancelGuest() {
    (this.$refs.cancelGuest as any).showDialog = true
  }
  // 批量发起客邀
  private batchLaunchGuest() {
    (this.$refs.launchGuest as any).showDialog = true
    // (this.$refs.launchGuest as any).confirm()
  }
  init() {
    this.getDictList()
  }
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.LineList {
  .rejectBox{
      display: flex;
      align-items: center;
    }
    min-width: 860px;
  .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .el-button{
      margin-right: 8px;
    }
    .btnPc{
       width: 100%;
       padding: 0 10px;
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
    .middle {
      margin: 10px 0px;
      .count {
        font-size:14px;
        color:#666;
      }
    }
    .table_box {
      padding: 0px 20px 20px 20px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
}
</style>
