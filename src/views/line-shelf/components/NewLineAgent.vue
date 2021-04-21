<template>
  <div class="new-line-container">
    <el-row class="row-status">
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">{{ dnamicLable.toBeCheckedNum }}</span>
        <span class="title">待维护（条）</span>
      </el-col>
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">{{ dnamicLable.checkedNum }}</span>
        <span class="title">已维护（条）</span>
      </el-col>
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">{{ dnamicLable.checkedTodayNum }}</span>
        <span class="title">今日完成（条）</span>
      </el-col>
    </el-row>
    <template v-if="hasAgent">
      <div class="no-source">
        <img
          src="../../../assets/image/no-source.png"
          alt=""
        >
        <div>暂无需要处理的待办，休息一下吧！</div>
      </div>
    </template>
    <template v-else>
      <!-- 基础信息  -->
      <section-container title="基础信息">
        <self-form
          label-position="top"
          :form-item="baseItem"
          :list-query="baseInfo"
        >
          <template #lineName="scope">
            <el-link
              type="primary"
              @click="goDetails(scope.row.lineId)"
            >
              {{ scope.row.lineName }}
            </el-link>
          </template>
          <template #lineId="scope">
            <el-link
              type="primary"
              @click="goDetails(scope.row.lineId)"
            >
              {{ scope.row.lineId }}
            </el-link>
          </template>
          <template #waitDirveValidity="scope">
            <span
              :class="{error: timeError(scope.row.waitDirveValidity)}"
            >
              {{ scope.row.waitDirveValidity| parseTime('{y}-{m}-{d}') }}
            </span>
          </template>
        </self-form>
      </section-container>
      <CuratorialInformation
        :img-arr="imgArr"
        :depot-curation="depotCuration"
      />
      <section-container title="标签信息">
        <el-form
          ref="lineFormRef"
          :model="form"
          :rules="rules"
          class="lable-form"
          label-width="80px"
          @validate="toUp"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="是否爆款"
                prop="isHot"
              >
                <el-select
                  v-model="form.isHot"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in hasOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="线路肥瘦"
                class="question-item"
                prop="labelType"
                label-width="100px"
              >
                <template #label>
                  <span>线路肥瘦&nbsp;</span>
                  <el-tooltip
                    placement="top"
                    effect="light"
                    popper-class="new-line-popper"
                  >
                    <div slot="content">
                      说明：<br>
                      {{ lableData.cityName }}<br>
                      专车司机： {{ lableData.sepcialName }}<br>
                      共享司机：{{ lableData.shareName }}
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>

                <el-select
                  v-model="form.labelType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in labelTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="是否万金油"
                class="question-item"
                prop="isPanacea"
                label-width="120px"
              >
                <template #label>
                  <span>是否万金油</span>
                  <el-tooltip
                    placement="top"
                    effect="light"
                    popper-class="new-line-popper"
                  >
                    <template #content>
                      提示<br>
                      如：4.2米干厢货晚上干活，4.2米白天活，金杯下午活
                    </template>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
                <el-select
                  v-model="form.isPanacea"
                  placeholder="请选择活动区域"
                >
                  <el-option
                    v-for="item in hasOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="16"
              class="group-check"
            >
              <el-form-item
                class="checkbox-all"
                label-width="100%"
                prop="sellPoint"
              >
                <template #label>
                  卖点(多选)：
                  <span style="font-size: 12px; color: #838383">
                    修改卖点后，将修改该线路的项目下所有的线路的卖点
                  </span>
                </template>
                <el-checkbox-group
                  v-model="form.sellPoint"
                  size="mini"
                >
                  <el-checkbox-button
                    v-for="item in sellPointColumns"
                    :key="item.value"
                    class="check-label"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section-container>
      <section-container title="配送信息">
        <self-form
          label-position="top"
          :form-item="deliveryItem"
          :list-query="baseInfo"
        >
          <template #transArea="scope">
            {{ scope.row.transArea }}
          </template>
          <template #serviceRemark="scope">
            <div class="serviceRemark">
              <!-- {{ ceshi }}{{ !ceshi && !ceshi2 ? '暂无数据' : ceshi && ceshi2 ? '、' : '' }}{{ ceshi2 }} -->
              {{ scope.row.serviceRequirementName }}{{ !scope.row.serviceRequirementName && !scope.row.remark ? '暂无数据' : scope.row.serviceRequirementName && scope.row.remark ? '、' : '' }}{{ scope.row.remark }}
            </div>
          </template>
        </self-form>
      </section-container>
      <section-container title="配送要求">
        <self-form
          label-position="top"
          :form-item="deliveryDemandItme"
          :list-query="baseInfo"
        >
          <template #time="scope">
            <div v-if="scope.row.lineCategory === 1">
              {{ formatWeek(scope.row.deliveryWeekCycle) }}
            </div>
            <div v-else>
              {{ scope.row.deliveryStartDate.split(" ")[0] }}-{{
                scope.row.deliveryEndDate.split(" ")[0]
              }}
            </div>
          </template>
        </self-form>
      </section-container>
      <section-container title="货物信息">
        <self-form
          label-position="top"
          :form-item="goodsItem"
          :list-query="baseInfo"
        />
      </section-container>
      <section-container title="结算信息">
        <self-form
          label-position="top"
          :form-item="baseInfo.incomeSettlementMethod === 2 ? SettlementItem : SettlementItem2"
          :list-query="baseInfo"
        />
      </section-container>

      <!-- 按钮 -->
      <div class="new-line-btn">
        <el-button
          class="agent-button"
          type="info"
          plain
          :loading="isSkip"
          @click="checkSuccess('4')"
        >
          跳过暂不检查
        </el-button>

        <el-button
          class="agent-button"
          type="primary"
          @click="checkError('3')"
        >
          检查不通过
        </el-button>

        <el-button
          class="agent-button"
          type="primary"
          @click="checkSuccess('2')"
        >
          检查通过
        </el-button>
      </div>
      <SelfDialog
        :visible.sync="showDialog"
        title="检查不通过"
        :width="'40%'"
        :confirm="confirm"
        :destroy-on-close="true"
        @closed="handleClosed"
      >
        <div style="margin: 20px 0">
          <el-link
            :underline="false"
            type="primary"
          >
            提示：检查不通过后，外线销售在H5的线路管理中操作“激活线路”，提交后需要再次检查线路
          </el-link>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="dialogForm"
          :rules="rules"
          :label-width="'60px'"
        >
          <el-form-item
            label="原因（多选）"
            prop="type"
            label-width="120px"
          >
            <el-checkbox-group v-model="dialogForm.type">
              <el-checkbox
                label="1"
                name="type"
              >
                项目策展信息(卖点、爆款、肥瘦、万金油)
              </el-checkbox>
              <el-checkbox
                label="2"
                name="type"
              >
                线路基础信息(除策展信息)
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="备注"
            label-width="120px"
            prop="rejectionReasons"
            style="margin-top:30px"
          >
            <el-input
              v-model="dialogForm.rejectionReasons"
              placeholder="如 仓库图片/货物图片不合格"
              type="textarea"
              maxlength="150"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </SelfDialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import pagination from '@/components/Pagination/index.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import CuratorialInformation from '../agent/CuratorialInformation.vue'
import {
  getNewLineDetail,
  checkNewlineTodo,
  nextNewLineTodo
} from '@/api/line-shelf'
import { GetDictionary } from '@/api/common'
import { detailByUserId } from '@/api/driver-account'
import { lock } from '@/utils'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'NewLineAgent',
  components: {
    SectionContainer,
    SelfForm,
    pagination,
    SelfDialog,
    CuratorialInformation
  }
})
export default class extends Vue {
  @Prop({ default: () => { return { checkedNum: 0, checkedTodayNum: 0, toBeCheckedNum: 0 } } }) dnamicLable!:object
  showImgDialog = true
  private dayIndex = 1000
  private lineLabelVo:IState = {}
  private baseItem = [
    {
      type: 'lineName',
      label: '线路名称',
      key: 'lineName',
      tagAttrs: {
        class: 'active'
      },
      slot: true
    },
    {
      type: 'lineId',
      label: '线路编号',
      key: 'lineId',
      slot: true
    },
    {
      type: 'waitDirveValidity',
      label: '窗口期',
      key: 'waitDirveValidity',
      slot: true,
      tagAttrs: {
        class: 'error'
      }
    },
    {
      type: 7,
      label: '线路分类',
      key: 'lineCategoryName'
    },
    {
      type: 7,
      label: '外线销售',
      key: 'lineSaleName'
    },
    {
      type: 7,
      label: '客维经理',
      key: 'dutyManagerIdName'
    }
  ]
  private baseInfo = {
    checkbox: 'fadfas',
    distance: '',
    transArea: ''
  }
  private listQuery = {}
  private hasOption = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]
  private form = {
    isHot: '',
    labelType: '',
    isPanacea: '',
    sellPoint: []
  }
  private sellPointColumns = []
  private deliveryItem = [
    {
      type: 7,
      label: '车型',
      labelPosition: 'top',
      key: 'carTypeName'
    },
    {
      type: 'transArea',
      label: '配送区域',
      key: 'transArea',
      slot: true
    },
    {
      type: 7,
      label: '详细地址',
      key: 'districtArea'
    },
    {
      type: 7,
      label: '是否走禁行',
      key: 'isBehavior',
      filterText: '是:否'
    },
    {
      type: 7,
      label: '是否走限行',
      key: 'isRestriction',
      filterText: '是:否'
    },
    {
      type: 7,
      label: '油电要求',
      key: 'oilElectricityRequirementName'
    },
    {
      type: 7,
      label: '装卸要求',
      key: 'handlingDifficultyName'
    },
    {
      type: 7,
      label: '是否走高速',
      key: 'runSpeed',
      filterText: '是:否'
    },
    {
      type: 7,
      label: '是否需要回单',
      key: 'returnBill',
      filterText: '是:否'
    },
    {
      type: 'serviceRemark',
      label: '服务要求和备注',
      key: 'serviceRemark',
      slot: true
    }
  ]
  private deliveryInfo = {}
  private deliveryDemandItme = [
    {
      type: 'time',
      label: '配送时间',
      key: 'time',
      slot: true
      // slot deliveryStartDate deliveryEndDate
    },
    {
      type: 7,
      label: '预计月出车天数',
      key: 'monthNum',
      unit: '天'
    },
    {
      type: 7,
      label: '每日出车趟数',
      key: 'dayNum',
      unit: '趟'
    },
    {
      type: 7,
      label: '预计工作时间',
      key: 'timeDiff'
    },
    {
      type: 7,
      label: '配送数量',
      key: 'deliveryNum',
      unit: '个'

    },
    {
      type: 7,
      label: '配送里程',
      key: 'distance'
    }
  ]
  private deliveryDemandInfo = {}
  private goodsItem = [
    {
      type: 7,
      label: '货物类型',
      key: 'cargoTypeName'
    },
    {
      type: 7,
      label: '是否需要搬运',
      key: 'carry',
      filterText: '是:否'
    }
  ]
  private goodsInfo = {}
  private SettlementItem = [
    {
      type: 7,
      label: '单趟报价',
      key: 'everyTripGuaranteed',
      unit: '元'
    },
    {
      type: 7,
      label: '单趟提成报价',
      key: 'everyUnitPrice',
      unit: '元'
    },
    {
      type: 7,
      label: '预计月报价',
      key: 'shipperOffer',
      unit: '元'
    },
    {
      type: 7,
      label: '计价方式',
      key: 'incomeSettlementMethodName'
    },
    {
      type: 7,
      label: '结算周期',
      key: 'settlementCycleName'
    },
    {
      type: 7,
      label: '结算天数',
      key: 'settlementDays',
      unit: '天'
    }
  ]
  private SettlementItem2 = [
    {
      type: 7,
      label: '单趟报价',
      key: 'everyTripGuaranteed',
      unit: '元'
    },
    {
      type: 7,
      label: '预计月报价',
      key: 'shipperOffer',
      unit: '元'
    },
    {
      type: 7,
      label: '计价方式',
      key: 'incomeSettlementMethodName'
    },
    {
      type: 7,
      label: '结算周期',
      key: 'settlementCycleName'
    },
    {
      type: 7,
      label: '结算天数',
      key: 'settlementDays',
      unit: '天'
    }
  ]
  private imgArr = [
    {
      imgArr: [],
      tiele: '仓库图片'
    },
    {
      imgArr: [],
      tiele: '货物图片'
    },
    {
      imgArr: [],
      tiele: '装货图片'
    }
  ]
  private processingPriority: string = ''
  showDialog: boolean = false
  private dialogForm = {
    type: [],
    rejectionReasons: ''
  }
  rules = {
    type: [{ required: true, message: '请选择拒绝原因', trigger: 'blur' }],
    isHot: [{ required: true, message: '请选择是否爆款', trigger: 'blur' }],
    labelType: [{ required: true, message: '请选择线路标签', trigger: 'blur' }],
    isPanacea: [{ required: true, message: '请选择是否万金油', trigger: 'blur' }],
    sellPoint: [{ required: true, message: '请选择线路卖点', trigger: 'blur' }],
    rejectionReasons: [{ required: true, message: '请填写备注', trigger: 'blur' }]
  }
  page = {
    limit: 1,
    page: 1,
    total: 50
  }
  async mounted() {
    this.initSource()
    // this.sellPointColumns = await this.getDictData('selling_points_project')
  }
  goDetails(id:any) {
    this.$router.push({
      path: '/lineshelf/linedetail',
      query: { id }
    })
  }
  async checkError(this:any) {
    try {
      await this.$refs['lineFormRef'].validate()
      this.showDialog = true
    } catch (error) {
      return error
    }
  }
  // 检查不通过
  async confirm(this: any) {
    try {
      await this.$refs['ruleFormRef'].validate()
      await this.checkNewlineSure('3', () => {
        this.showDialog = false
        this.getLineDetail()
        this.dialogForm = { type: [] }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  toUp(e:string, s:boolean) {
    if (!s) {
      this.$message({ type: 'info', message: '请检查线路标签信息' })
      this.scrollTo(500)
    }
  }
  handleClosed(this:any) {
    this.$refs['ruleFormRef'].resetFields()
    this.dialogForm = {
      type: [],
      rejectionReasons: ''
    }
    console.log('fdsaf')
  }
  // 检查通过
  async checkSuccess(this: any, checkType:string) {
    try {
      if (checkType === '2') {
        await this.$refs['lineFormRef'].validate()
      }
      await this.checkNewlineSure(checkType, () => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$refs['lineFormRef'].resetFields()
        this.getLineDetail()
      })
    } catch (error) {
      console.log(error)
    }
  }
  // 滚动到页面顶部
  scrollTo(num:number = 0) {
    const ele: any = document.querySelector('.app-main')
    ele.scrollTo({ top: num, behavior: 'smooth' })
  }

  private workTimeText(item:any, idx:any) {
    const [start, end] = [item.workingTimeStart, item.workingTimeEnd]
    if (start && end) {
      if (idx > this.dayIndex) {
        return `次日${start}-次日${end}`
      } else if (Number(start.substring(0, 2)) > Number(end.substring(0, 2))) {
        this.dayIndex = idx
        return `${start}-次日${end}`
      }
    }
    return `${start}-${end}`
  }

  formatWeek(time:string) {
    const arr = [
      {
        label: '周一',
        value: 1
      },
      {
        label: '周二',
        value: 2
      },
      {
        label: '周三',
        value: 3
      },
      {
        label: '周四',
        value: 4
      },
      {
        label: '周五',
        value: 5
      },
      {
        label: '周六',
        value: 6
      },
      {
        label: '周日',
        value: 7
      }
    ]

    const str = time.split(',').map((item:any) => {
      return arr[Number(item) + -1].label
    })
    return str.join(',')
  }
  private isSkip = false
  private labelTypeArr = [] // 线路标签
  private queryId = {} // ID
  private hasAgent = true // 是否有待办
  private depotCuration = { // 仓策展信息
    warehouseName: '',
    warehouseDistrict: '',
    videoUrl: ''
  } // 视频地址
  // 获取详情数据
  private lableData = {
    cityName: '',
    sepcialName: '',
    shareName: ''
  }
  async getLineDetail() {
    try {
      const { data } = await nextNewLineTodo()
      if (!data.success) {
        return this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      const { agentId, lineId, projectId, processingPriority } = data.data
      // 是否有待办
      if (agentId === null) {
        this.hasAgent = true
        return
      } else {
        this.hasAgent = false
      }
      this.queryId = Object.assign(
        {},
        {
          agentId,
          lineId,
          projectId
        }
      )
      this.processingPriority = processingPriority
      this.baseInfo = data.data.lineDetailVO
      if (data.data.lineLabelVO) {
        const { cityName, sepcialName, shareName } = data.data.lineLabelVO
        this.lableData = {
          cityName,
          sepcialName: sepcialName.join('、'),
          shareName: shareName.join('、')
        }
      }
      this.baseInfo.transArea = data.data.lineDetailVO.provinceAreaName + data.data.lineDetailVO.cityAreaName + data.data.lineDetailVO.countyAreaName
      this.baseInfo.distance = data.data.lineDetailVO.distance + '公里'
      const { isHot, isPanacea, labelType, warehouseName, warehouseDistrict, lineDeliveryInfoFORMS } = data.data.lineDetailVO
      // 获取图片信息
      const {
        sellPoint,
        cargoUrl, // 货物图片
        loadingPictureUrl, // zhunghuo
        warehousePictureUrl, // cangweiz
        videoUrl
      } = data.data.projectStrategyInfoVO
      const imgList = [warehousePictureUrl, cargoUrl, loadingPictureUrl]
      this.imgArr.forEach((item, index) => {
        item.imgArr = imgList[index]
      })
      // 获取视频信息
      this.depotCuration = {
        warehouseName,
        warehouseDistrict,
        videoUrl
      }
      // 获取标签信息
      const object = {
        isHot,
        isPanacea,
        labelType,
        // 处理字符串为空
        sellPoint: sellPoint === '' ? [] : sellPoint.split(',')
      }
      object.sellPoint = object.sellPoint.map((item:string) => Number(item))
      this.form = object
      this.lineLabelVo = data.data.lineLabelVO
      const lineTiem:{[key:string]:any} = {}
      const activeFron:Array<any> = []
      this.deliveryDemandItme = [
        {
          type: 'time',
          label: '配送时间',
          key: 'time',
          slot: true
          // slot deliveryStartDate deliveryEndDate
        },
        {
          type: 7,
          label: '预计月出车天数',
          key: 'monthNum',
          unit: '天'
        },
        {
          type: 7,
          label: '每日出车趟数',
          key: 'dayNum',
          unit: '趟'
        },
        {
          type: 7,
          label: '预计工作时间',
          key: 'timeDiff'
        },
        {
          type: 7,
          label: '配送数量',
          key: 'deliveryNum',
          unit: '个'

        },
        {
          type: 7,
          label: '配送里程',
          key: 'distance'
        }
      ]
      // 获取预计工作时间段
      lineDeliveryInfoFORMS.forEach((item:any, index:number) => {
        let abc = this.workTimeText(item, index)
        lineTiem['lineDeliveryInfoFORMS' + index] = abc
        activeFron.push({ type: 7,
          label: '预计工作时间段',
          key: 'lineDeliveryInfoFORMS' + index
        })
      })
      this.deliveryDemandItme.splice(4, 0, ...activeFron)

      // this.listQuery = Object.assign({}, this.listQuery, object)
      this.baseInfo = { ...this.baseInfo, ...lineTiem }
      // 页面滚动到具体的位置
      setTimeout(() => {
        this.$emit('getnum')
      }, 1500)
      this.scrollTo()
    } catch (error) {
      console.log('nextNewLineTodo', error)
      return error
    }
  }
  // 获取卖点字典
  async getDictData(dictType: any) {
    try {
      let params = {
        dictType
      }
      let { data: res } = await GetDictionary(params)
      if (res.success && res.data) {
        return res.data.map((item: any) => ({
          label: item.dictLabel,
          value: +item.dictValue
        }))
      } else {
        // this.$fail(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict data fail:${err}`)
    }
  }
  async initSource() {
    let requestArr = [
      this.getDictData('selling_points_project'),
      this.getDictData('line_label')
    ]
    this.getLineDetail()
    let res = await Promise.all(requestArr)
    if (res && res.length === requestArr.length) {
      this.sellPointColumns = res[0]
      this.labelTypeArr = res[1]
    }
  }
  // 检查新线维护待办
  @lock
  async checkNewlineSure(checkType: string, callBack:Function) {
    try {
      const params: any = Object.assign({ checkType }, this.queryId, this.form)
      // const { isHot, labelType, isPanacea, sellPoint } = this.form
      // isHot && (params.isHot = isHot)
      // labelType && (params.labelType = labelType)
      // isPanacea && (params.isPanacea = isPanacea)
      // sellPoint && (params.sellPoint = sellPoint)
      // 检查不通过
      if (checkType === '4') {
        params.sellPoint.push(0) // 不检查传0
      }
      if (checkType === '3') {
        const rejectionReasons = this.dialogForm.type
        params.rejectionReasons = this.dialogForm.rejectionReasons// beiz
        params.rejectionReasonsType =
          rejectionReasons.length === 2 ? 3 : rejectionReasons.join(',')
      }

      const { data } = await checkNewlineTodo(params)
      if (data.success) {
        callBack()
      } else {
        this.$message({ type: 'error', message: data.errorMsg })
      }
    } catch (error) {
      return error
    }
  }
  // 时间
  timeError(time:number) {
    if (!time) return false
    let currentTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
    let oldTime = new Date(time).getTime()
    let num = (currentTime - oldTime) / 86400000
    return Math.abs(num) <= 3
  }
}
</script>

<style lang="scss" scoped>
.row-status {
  margin: 0 !important;
  background: linear-gradient(225deg, #64c9ee 0%, #649cee 100%);
  padding: 18px 0;
}
.col-status {
  border-right: 1px solid #eff5fe;
  padding: 4px 0;
  color: #fff;
  &:nth-last-child(1) {
    border: none;
  }
  span {
    display: block;
    text-align: center;
    width: 100%;
  }
  .number {
    font-size: 18px;
    margin-bottom: 4px;
  }
  .title {
    font-size: 14px;
  }
}
.agent-button {
  margin-right: 20px;
  min-width: 120px;
  border: none;
}

// 按钮组的样式
.check-label {
  margin-right: 20px;
}
::v-deep .el-checkbox-button__inner {
  border: none;
  border: 1px solid #649cee !important;
  border-radius: 4px !important;
  box-sizing: border-box;
  color: #649cee;
}
::v-deep .is-checked {
  .el-checkbox-button__inner {
    border: 1px solid #649cee !important;
    box-shadow: none !important;
  }
}
.new-line-btn {
  display: flex;
  justify-content: flex-end;
  padding: 40px 60px;
}
.no-source {
  display: flex;
  justify-content: center;
  padding: 60px;
  flex-wrap: wrap;
  img {
    margin: 0 auto;
  }
  div {
    width: 100%;
    text-align: center;
    margin-top: 22px;
    color: #999;
  }
}
::v-deep .active{
  color: #649cee;
}
::v-deep .error{
  color: #ff5256;
}
</style>

<style lang="scss" scoped>
.new-line-container {
  overflow: hidden;
  // padding: 0 12px;
  ::v-deep .SectionContainer {
    margin-top: 8px;
    box-shadow: none;
    border-bottom: 2px solid #f8f9fa;
    .title {
      border: none;
    }
    .context {
      padding: 0px 30px;
    }
  }
  .el-button--info.is-plain:hover,
  .el-button--info.is-plain:focus {
    background: #ccc;
    color: #333;
  }
  .el-icon-question {
    font-size: 18px;
    vertical-align: text-top;
    margin-right: 6px;
    color: #656565;
  }
  ::v-deep .el-form-item {
    margin-bottom: 12px !important;
  }
  .lable-form {
    ::v-deep .el-form-item__label {
      color: #333 !important;
    }
  }
  .question-item {
    ::v-deep .el-form-item__label {
      padding: 0 !important;
    }
  }
  .checkbox-all {
    display: flex;
    flex-wrap: wrap;
    ::v-deep .el-form-item__label {
      text-align: left;
    }
    ::v-deep .el-form-item__content {
      margin: 0 !important;
    }
  }
  .serviceRemark {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 24px;
  }
}
.group-check {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.new-line-popper {
  border: none !important;
  box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.24);
  .popper__arrow {
    border: none;
    box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.24);
  }
}
</style>
