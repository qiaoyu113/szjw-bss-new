<template>
  <div
    v-loading="listLoading"
    class="chauffeurListContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="120px"
      class="p15 SuggestForm"
      :pc-col="6"
    >
      <template slot="rents">
        <doubleInput v-model="listQuery.rents" />
      </template>
      <template slot="driverId">
        <div style="width:100%">
          <el-select
            v-model="listQuery.driverId"
            v-loadmore="loadmore"
            filterable
            clearable
            remote
            reserve-keyword
            :default-first-option="true"
            :remote-method="remoteMethod"
            :loading="driverLoading"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in driverOtions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
      <div
        slot="status"
        :class="isPC ? 'btnPc left' : 'mobile'"
      >
        <el-radio-group
          v-model="listQuery.status"
          size="small"
          @change="handleStatusChange"
        >
          <el-radio-button
            v-for="item in statusLists"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div
        slot="btnGroup"
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
      </div>
      <template slot="key">
        <el-autocomplete
          v-model="listQuery.key"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入"
        />
      </template>
      <template slot="start">
        <el-input
          v-model="listQuery.start"
          v-only-number="{min: 0, max: 20000, precision: 0}"
        />
      </template>
      <template slot="end">
        <el-input
          v-model="listQuery.end"
          v-only-number="{min: 0, max: 20000, precision: 0}"
        />
      </template>
    </self-form>
    <!-- 表格 -->
    <div class="table_box">
      <Atable
        :table-data="tableData"
        :is-show-percent="true"
        :is-more="true"
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
    <DetailDialog
      :driver-id="id"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import Atable from './components/Atable.vue'
import DetailDialog from './components/DetailDialog.vue'
import {
  today,
  yesterday,
  month,
  lastmonth,
  threemonth
} from '@/views/driver-freight/components/date'
import { getDriverNoAndNameList } from '@/api/driver'
import Pagination from '@/components/Pagination/index.vue'
import doubleInput from './components/doubleInput.vue'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'ChauffeurList',
  components: {
    SelfForm,
    Atable,
    doubleInput,
    Pagination,
    DetailDialog
  }
})
export default class extends Vue {
  private listLoading: boolean = false;
  private busiOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private carKindOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private hardOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private cycleOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private driverOptions: IState[] = [];
  private timeLists: IState[] = [];
  private tableData: IState[] = [{}, {}];
  private listQuery: IState = {
    busiType: '',
    carType: '',
    carKind: '',
    driverId: '',
    address: '',
    hard: '',
    hope: '',
    cycle: '',
    time: [],
    rents: [],
    status: ''
  };
  private driverLoading: Boolean = false;
  private driverOver: Boolean = false;
  private keyWord: String = '';
  private driverOtions: any[] = [];
  private driverPage: any = {
    page: 1,
    limit: 20
  };
  private formItem: any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属业务线',
      key: 'busiType',
      options: this.busiOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机车型',
      key: 'carType',
      options: this.driverOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '电油分类',
      key: 'carKind',
      options: this.carKindOptions
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '居住地址',
      key: 'address'
    },
    // {
    //   type: 8,
    //   key: "workCity",
    //   col: 8,
    //   label: "所属城市",
    //   tagAttrs: {
    //     placeholder: "请选择所属城市",
    //     clearable: true,
    //     "default-expanded-keys": true,
    //     "default-checked-keys": true,
    //     "node-key": "workCity",
    //     props: {
    //       lazy: true,
    //       lazyLoad: showWork,
    //     },
    //   },
    // },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '装卸接受度',
      key: 'hard',
      options: this.hardOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '期望稳定/临时',
      key: 'hope',
      options: [
        { label: '全部', value: '' },
        { label: '稳定', value: 1 },
        { label: '临时', value: 2 }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '期望结算周期',
      key: 'cycle',
      options: this.cycleOptions
    },
    {
      type: 'rents',
      label: '期望运费(趟)',
      key: 'rents',
      col: 6,
      slot: true
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
      label: '可工作时间段',
      key: 'time'
    },
    {
      type: 'driverId',
      label: '司机姓名/编号',
      key: 'driverId',
      col: 6,
      slot: true
    },
    {
      type: 'status',
      key: 'status',
      label: '司机状态',
      col: 16,
      slot: true
    },
    {
      type: 'btnGroup',
      col: 8,
      slot: true,
      w: '0px'
    }
  ];

  private statusLists: IState[] = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '已成交',
      value: 1
    },
    {
      label: '已上岗',
      value: 2
    }
  ];
  // 表格分页
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private loadmore() {
    this.getDriverInfo(this.keyWord)
  }
  async getDriverInfo(keyWord: any = '') {
    try {
      this.keyWord = keyWord
      let params = {
        // workCity: this.listQuery.workCity[1] || '',
        // busiType: this.listQuery.busiType,
        // gmId: this.listQuery.joinManagerId || '',
        key: ''
      }
      keyWord !== '' && (params.key = keyWord)
      params = { ...params, ...this.driverPage }
      if (this.driverOver) {
        return
      }
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/management/queryDriverList'
      })
      if (res.success) {
        if (
          res.data.length &&
          res.data.length > 0 &&
          res.data.length === this.driverPage.limit
        ) {
          this.driverPage.page++
        } else {
          this.driverOver = true
        }
        let driverInfos = res.data.map(function(item: any) {
          return {
            label: `${item.name}(${item.driverId})`,
            value: item.driverId
          }
        })
        this.driverOtions.push(...driverInfos)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
  private async remoteMethod(query: any) {
    this.keyWord = query
    this.driverLoading = true
    this.driverPage.page = 1
    this.driverOver = false
    this.driverOtions.splice(0, this.driverOtions.length)
    await this.getDriverInfo(this.keyWord)
    this.driverLoading = false
  }
  // 查询
  handleFilterClick() {
    if (
      this.listQuery.start &&
      this.listQuery.end &&
      Number(this.listQuery.start) > Number(this.listQuery.end)
    ) {
      return this.$message.warning('单趟运费起始金额不能大于终止金额')
    }
    if (
      this.listQuery.f1 &&
      this.listQuery.f2 &&
      this.listQuery.f1 === this.listQuery.f2
    ) {
      return this.$message.warning('起始时间与结束时间差>=1小时')
    }
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {}
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      this.listLoading = false
      //
    }
  }
  // 客邀状态变化
  handleStatusChange(val: string | number) {
    console.log('xxx:', val)
  }
  // 线路名称/编号 模糊搜索
  querySearch(queryString: string, cb: Function) {
    // eslint-disable-next-line standard/no-callback-literal
    cb([])
  }
  // 分页
  handlePageSizeChange(page: number, limit: number) {
    if (page) {
      this.page.page = page
    }
    if (limit) {
      this.page.limit = limit
    }
    this.getLists()
  }
  async init() {
    await this.getDriverInfo()
    for (let i = 0; i < 24; i++) {
      let count = i < 9 ? `0${i}:00` : `${i}:00`
      this.timeLists.push({
        label: count,
        value: count
      })
    }
  }
  mounted() {
    this.init()
  }
}

</script>
<style lang="scss" scoped>
.chauffeurListContainer {
  .btnPc {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    &.left {
      justify-content: flex-start;
    }
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

<style scoped>
.chauffeurListContainer >>> .end .el-form-item__label::before {
  content: "~";
  color: #9e9e9e;
}
</style>
