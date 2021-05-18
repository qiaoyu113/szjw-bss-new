<template>
  <div class="searchForm">
    <self-form
      ref="searchForm"
      :list-query="listQuery"
      :form-item="items"
      size="small"
      label-width="130px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template slot="rents">
        <doubleInput
          v-model="listQuery.rents"
          v-only-number="{min: 1, max: 19999, precision: 0}"
          :range="[1,19999]"
        />
      </template>
      <template slot="time">
        <timeSelect
          v-model="listQuery.time"
        />
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
        <el-button
          v-permission="['/v2/driver/updateDriverDmBatch']"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleAllotClick"
        >
          批量分配司撮
        </el-button>
      </div>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import { GetDriverListByKerWord } from '@/api/driver'
import doubleInput from './doubleInput.vue'
import timeSelect from './timeSelect.vue'
import { GetDictionaryList, GetSpecifiedLowerUserListByCondition } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../../js'
import { render } from 'node_modules/@types/nprogress'
import store from '@/store'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}

@Component({
  name: 'searchForm',
  components: {
    SelfForm,
    doubleInput,
    timeSelect
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) listQuery!: IState;
 private busiOptions: IState[] = [
   { label: '全部', value: '' },
   { label: '专车', value: 0 },
   { label: '共享', value: 1 }
 ];
  private carKindOptions: IState[] = [
    { label: '全部', value: '' },
    { label: '油车', value: 1 },
    { label: '电车', value: 2 }
  ];
  private hardOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private cycleOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private driverOptions: IState[] = [];
  private timeLists: IState[] = [];

  private driverLoading: Boolean = false;
  private driverOver: Boolean = false;
  private keyWord: String = '';
  private driverOtions: any[] = [];
  private matchManIdOptions:IState[] = [];
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
      key: 'oilElectricityRequirement',
      options: this.carKindOptions
    },
    {
      type: 8,
      key: 'address',
      label: '居住地址',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          checkStrictly: true,
          lazyLoad: getProviceCityCountryData
        }
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '装卸接受度',
      key: 'heavyLifting',
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
      key: 'expectStabilityTemporary',
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
      key: 'expectAccountingPeriod',
      options: this.cycleOptions
    },
    {
      type: 'rents',
      label: '期望运费(趟)',
      key: 'rents',
      slot: true
    },
    {
      type: 'time',
      label: '可工作时间段',
      key: 'time',
      slot: true
    },
    {
      type: 'driverId',
      label: '司机姓名/编号',
      key: 'driverId',
      slot: true
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司撮经理',
      key: 'driverMatchManagerId',
      options: this.matchManIdOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司机是否分配司撮',
      key: 'hasDriverMatchManager',
      options: [{ label: '是', value: true }, { label: '否', value: false }]
    },
    {
      type: 'status',
      key: 'status',
      label: '司机状态',
      col: 20,
      slot: true
    },
    {
      type: 'btnGroup',
      col: 4,
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
      label: '已成交待上岗',
      value: 3
    },
    {
      label: '已上岗',
      value: 4
    }
  ];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  get items() {
    if (this.$store.state.user.roles.includes('/v2/driver/updateDriverDmBatch')) {
      return this.formItem
    } else {
      return this.formItem.filter((item) => {
        return (item.key !== 'driverMatchManagerId' && item.key !== 'hasDriverMatchManager')
      })
    }
  }

  handleStatusChange(val: string | number) {
    this.$emit('status', val)
  }

  // 查询
  handleFilterClick() {
    let rents = this.listQuery.rents.filter((ele:any) => ele)
    let time = this.listQuery.time.filter((ele:any) => ele)
    if (rents.length === 1) {
      return this.$message.warning('请完善期望运费')
    }
    if (rents.length === 2 && ((+rents[1] >= 20000 || +rents[0] >= 20000) || (+rents[1] <= 0 || +rents[0] <= 0))) {
      return this.$message.warning('超出期望运费范围0-20000')
    }
    if (rents.length === 2 && +rents[1] <= +rents[0]) {
      return this.$message.warning('期望运费后置参数大于前置参数')
    }
    if (time.length === 1) {
      return this.$message.warning('请完善可工作时间段')
    }
    (this.$parent as any).getLists()
  }
  // 重置
  handleResetClick() {
    (this.$refs['searchForm'] as any).resetForm()
  }
  // 批量查询
  handleAllotClick() {
    const length = (this.$parent as any).allotData.length
    if (length > 0) {
      (this.$parent as any).allotTitle = '批量分配司撮';
      (this.$parent as any).driverIdList = (this.$parent as any).allotData.map((item:IState) => item.driverId);
      (this.$parent as any).allotDialog = true
    } else {
      this.$message.warning('请选择需要分配的司机')
    }
  }
  private loadmore() {
    this.getDriverInfo(this.keyWord)
  }
  async getDriverInfo(keyWord: any = '') {
    try {
      this.keyWord = keyWord
      let params:IState = {}
      this.listQuery.busiType !== null && (params.busiType = this.listQuery.busiType)
      keyWord !== '' && (params.key = keyWord)
      params = { ...params, ...this.driverPage }
      if (this.driverOver) {
        return
      }
      let { data: res } = await GetDriverListByKerWord(params)
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
  async init() {
    await this.getDriverInfo()
  }
  async getManager() {
    try {
      let params = {
        roleTypes: [15],
        uri: '/v2/driver/updateDriverDmBatch'
      }
      let { data: res } = await GetSpecifiedLowerUserListByCondition(params)
      if (res.success) {
        let length = this.matchManIdOptions.length
        if (length > 0) {
          this.matchManIdOptions.splice(0, length)
        }
        if (res.data.length && res.data.length > 0) {
          let arr = res.data.map((item:IState) => {
            return { label: `${item.name}(${item.mobile})`, value: item.id }
          })
          this.matchManIdOptions.push(...arr)
        }
      } else {
        this.$message.warning(res.errMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
  async getOptions() {
    try {
      let params = ['Intentional_compartment', 'heavy_lifting_type', 'settlement_cycle']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.driverOptions.push(...mapDictData(res.data.Intentional_compartment || []))
        this.hardOptions.push(...mapDictData(res.data.heavy_lifting_type || []))
        this.cycleOptions.push(...mapDictData(res.data.settlement_cycle || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  mounted() {
    this.init()
    this.getOptions()
    this.getManager()
  }
}
</script>
<style scoped lang="scss">
.searchForm{
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
}
</style>
