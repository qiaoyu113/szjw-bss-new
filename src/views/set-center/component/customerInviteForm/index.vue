<template>
  <div class="FreightListForm">
    <div class-name="sub-navbar">
      <div class="filter-container">
        <div :class="isPC ? 'menuBox' : 'menuBox-m'">
          <el-row>
            <el-form
              :label-width="isPC ? '120px' : '30%'"
              size="small"
            >
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="城市">
                  <el-cascader
                    v-model="arrayCity"
                    :props="{
                      lazy: true,
                      lazyLoad: showWork
                    }"
                    placeholder="请选择"
                    clearable
                    @clear="
                      () => {
                        arrayCity = []
                      }
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="车型">
                  <el-select
                    v-model="carOptions.value"
                    multiple
                    clearable
                    filterable
                    collapse-tags
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in carOptions"
                      :key="'select-' + item.value + '-' + index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="线路肥瘦">
                  <el-select
                    v-model="lineFat.value"
                    placeholder="请选择"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in lineFat"
                      :key="item.value + '-' + index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="装卸难度">
                  <el-select
                    v-model="loadLevel.value"
                    filterable
                    name="freightlist_gmId_input"
                    placeholder="请选择"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in loadLevel"
                      :key="item.value + '-' + index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="是否闯禁行">
                  <el-select
                    v-model="rushForbiddenArea.value"
                    name="freightlist_gmId_input"
                    placeholder="请选择"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in rushForbiddenArea"
                      :key="item.value + '-' + index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="是否闯限行">
                  <el-select
                    v-model="rushBan.value"
                    name="freightlist_business_input"
                    placeholder="请选择"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="item in rushBan"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="单趟运费区间">
                  <div class="freight">
                    <el-input
                      v-model="minFee"
                      type="number"
                      min="1"
                      max="19999"
                      @change="handleMinChange"
                    />
                    --
                    <el-input
                      v-model="maxFee"
                      type="number"
                      min="1"
                      max="19999"
                      @change="handleMaxChange"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="工作时间段">
                  <div class="workTime">
                    <el-time-select
                      v-model="startTime"
                      placeholder="起始"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00'
                      }"
                    />
                    --
                    <el-time-select
                      v-model="endTime"
                      placeholder="结束"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00',
                        minTime: startTime
                      }"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="仓库位置">
                  <el-select
                    v-model="listQuery.dutyManagerId"
                    filterable
                    clearable
                    name="freightlist_dutyManagerId_input"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in optionsClassification"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="配送区域">
                  <el-select
                    v-model="listQuery.feeDiff"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    filterable
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="item in hasDiff"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="稳定/临时">
                  <el-select
                    v-model="listQuery.driverUpLoadState"
                    name="freightlist_feeDiff_input"
                    placeholder="请选择"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="item in stable"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="isPC ? 6 : 24">
                <el-form-item label="线路名称/编号">
                  <el-input
                    v-model="lineName"
                    maxlength="50"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="isPC ? 24 : 24"
                class="btn-box"
              >
                <el-form-item label="客邀状态">
                  <div style="display: inline-block; float: left">
                    <el-badge
                      v-for="i in cusStatus"
                      :key="i.name"
                      class="item"
                      type="primary"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        :plain="listQuery.cusState !== i.name"
                        @click="handleClick(i)"
                      >
                        {{ i.label }}
                      </el-button>
                    </el-badge>
                  </div>
                  <el-button
                    :class="isPC ? 'filter-item' : 'filter-item-m'"
                    size="small"
                    name="ownerlist_reset_btn"
                    @click="reset"
                  >
                    重置
                  </el-button>
                  <el-button
                    :class="isPC ? 'filter-item' : 'filter-item-m'"
                    type="primary"
                    size="small"
                    name="ownerlist_query_btn"
                    @click="research"
                  >
                    查询
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  GetOpenCityData,
  GetDictionaryList,
  GetManagerLists,
  GetSpecifiedLowerUserListByCondition,
  getOfficeByType,
  getOfficeByTypeAndOfficeId,
  GetDutyListByLevel
} from '@/api/common'
import { GetSpecifiedRoleList, managementDerive } from '@/api/freight'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import { TimestampYMD } from '@/utils/index'
import '@/styles/common.scss'
import { exportFileTip } from '@/utils/exportTip'

@Component({
  name: 'SuggestForm',
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) private listQuery: any
  @Prop({ default: () => [] }) private cusStatus!: any[]
  private arrayCity: any[] = [] // 城市
  private carTypes: string = '' // 车型
  private endTime: string = ''
  private minFee: string = ''
  private maxFee: string = ''
  private lineName: string = '' // 线路名称/编号
  private carOptions: any[] = [] // 车型列表
  private optionsCity: any[] = [] // 字典查询定义(命名规则为options + 类型名称)
  private optionsCompany: any[] = []
  private optionsJoin: any[] = []
  private optionsSale: any[] = []
  private isExport: boolean = false
  private dutyListOptions: any[] = []
  private optionsClassification: any[] = []
  private QUERY_KEY_LIST: any[] = [
    'page',
    'limit',
    'state'
  ] // 添加过滤listQuery中key的名称
  private hasDiff: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '1', dictLabel: '有' },
    { dictValue: '0', dictLabel: '无' }
  ]
  // 临时 稳定
  private stable: any[] = [
    { dictValue: '', dictLabel: '全部' },
    { dictValue: '0', dictLabel: '稳定' },
    { dictValue: '1', dictLabel: '临时' }
  ]

  // listQuery同步tags公共方法
  @Watch('listQuery', { deep: true })

  get isPC() {
    return SettingsModule.isPC
  }

  get routes() {
    return PermissionModule.routes
  }

  get showLogo() {
    return SettingsModule.showSidebarLogo
  }

  created() {
    this.getBaseInfo()
  }

  // 状态点击逻辑
  private handleClick(tab: any) {
    this.listQuery.dispatchState = tab.name
    this.listQuery.page = 1
    this.$emit('handle-check')
    this.$emit('handle-query', this.listQuery)
  }

  // 获取客户城市
  private async showWork(node:any, resolve:any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.getOpenCityData({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }

  private async getOpenCityData(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 根据大区获取城市列表
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }

  private research() {
    this.$emit('handle-query', this.listQuery)
    this.$emit('handle-check')
  }

  private reset() {
    for (let key in this.listQuery) {
      if (key !== 'page' && key !== 'limit') {
        this.listQuery[key] = ''
      } else {
        this.listQuery['page'] = 1
      }
    }
    this.arrayCity = []
  }

  // 获取车型
  private async getBaseInfo() {
    try {
      let carLen: number = this.carOptions.length
      if (carLen > 0) {
        this.carOptions.splice(0, carLen)
      }
      let params = ['Intentional_compartment', 'driver_clue_contact_situation']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item: any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
        this.carOptions.push(...cars)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  // 线路肥瘦
  private lineFat: any[] = [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '超肥'
    },
    {
      value: '2',
      label: '单肥'
    },
    {
      value: '3',
      label: '次肥'
    },
    {
      value: '4',
      label: '中瘦'
    },
    {
      value: '5',
      label: '极瘦'
    }
  ]

  // 装卸难度
  private loadLevel: any[] = [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '不装卸'
    },
    {
      value: '2',
      label: '只装不卸（轻）'
    },
    {
      value: '3',
      label: '只卸不装（轻）'
    },
    {
      value: '4',
      label: '只装不卸（重）'
    },
    {
      value: '5',
      label: '只卸不装（重）'
    },
    {
      value: '6',
      label: '重装卸'
    }
  ]

  // 是否闯禁行
  private rushForbiddenArea: any[] = [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '是'
    },
    {
      value: '2',
      label: '否'
    }
  ]

  // 是否闯限行
  private rushBan: any[] = [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '是'
    },
    {
      value: '2',
      label: '否'
    }
  ]

  private handleMinChange(val: any) {
    console.log('最小值', val)
    if (val.includes('.')) {
      console.log('===')
    } else if (val.includes('-')) {
      console.log('===')
    } else {
      this.minFee = val
      if (Number(this.maxFee) && Number(this.maxFee) < Number(val)) {
        //
        this.$message.error('最小值不能大于最大值')
      } else if (Number(this.maxFee) && Number(this.maxFee) === Number(val)) {
        this.$message.error('最小值不能等于最大值')
      } else {
        console.log('===')
      }
    }
  }

  private handleMaxChange(val: any) {
    console.log('最大值', val)
    if (val.includes('.')) {
      console.log('===')
    } else if (val.includes('-')) {
      console.log('===')
    } else {
      this.maxFee = val
      if (Number(this.minFee) && Number(this.minFee) > Number(val)) {
        //
        this.$message.error('最小值不能大于最大值')
      } else if (Number(this.minFee) && Number(this.minFee) === Number(val)) {
        this.$message.error('最小值不能等于最大值')
      } else {
        console.log('===')
      }
    }
  }
}
</script>

<style lang="scss" scope>
.FreightListForm {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  .filter-container {
    padding: 0;
  }
  .menuBox-m {
    padding: 20px 10px;
    box-sizing: border-box;
    .el-date-m {
      width: 79%;
    }
    .btn-box {
      text-align: center;
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 78%;
    }
  }
  .menuBox {
    padding: 20px 30px 0 0;
    box-sizing: border-box;
    .btn-box {
      text-align: center;
      .filter-item {
        float: right;
        // height: 34px;
        // font-size: 14px;
        margin-left: 10px;
      }
      .filter-item-m {
        width: 80%;
        margin: 0 auto 10px;
      }
    }
    .el-select {
      display: block;
    }
    // .el-input {
    // width: 75%;
    // }
  }
}
</style>

<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
.el-badge {
  margin-right: 20px;
}
.el-cascader {
  display: block;
}
.el-date-editor.el-input {
  width: 43%;
}
.freight .el-input {
  width: 43%;
}
.workTime .el-input__inner,
.freight .el-input__inner {
  border: 0px;
}
.freight .el-input__inner {
  text-align: center;
  padding-right: 10px;
}
.workTime,
.freight {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #dcdfe6;
}
.workTime .el-input--suffix .el-input__inner {
  padding-right: 10px;
}
</style>
