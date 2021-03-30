<template>
  <div class="new-line-container">
    <el-row class="row-status">
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">100</span>
        <span class="title">待维护（条）</span>
      </el-col>
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">100</span>
        <span class="title">已维护（条）</span>
      </el-col>
      <el-col
        :span="8"
        class="col-status"
      >
        <span class="number">100</span>
        <span class="title">今日完成（条）</span>
      </el-col>
    </el-row>
    <template v-if="hasAgent">
      <div class="no-source">
        <img
          src="../../../assets/image/no-source.png"
          alt=""
        >
        <div>暂无需要处理的代办，休息一下吧！</div>
      </div>
    </template>
    <template v-else>
      <!-- 基础信息  -->
      <section-container title="基础信息">
        <self-form
          label-position="top"
          :form-item="baseItem"
          :list-query="baseInfo"
        />
      </section-container>
      <CuratorialInformation :img-arr="imgArr" />
      <section-container title="标签信息">
        <el-form
          ref="lineFormRef"
          :model="form"
          :rules="rules"
          class="lable-form"
          label-width="80px"
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
                      北京市<br>
                      专车司机： 超肥、单肥、次肥、中肥、极瘦<br>
                      共享司机：次肥、中瘦、极瘦
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>

                <el-select
                  v-model="form.labelType"
                  placeholder="请选择活动区域"
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
        />
      </section-container>
      <section-container title="配送要求">
        <self-form
          label-position="top"
          :form-item="deliveryDemandItme"
          :list-query="baseInfo"
        />
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
          :form-item="SettlementItem"
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
          提示：检查不通过后，外线销售在H5的线路管理中操作“激活线路”，提交后需要再次检查线路
        </div>
        <el-form
          ref="ruleForm"
          :model="dialogForm"
          :rules="rules"
          :label-width="'60px'"
        >
          <el-form-item
            label="原因"
            prop="type"
          >
            <el-checkbox-group v-model="dialogForm.type">
              <el-checkbox
                label="0"
                name="type"
              >
                项目策展信息(卖点、爆款、肥瘦、万金油)
              </el-checkbox>
              <el-checkbox
                label="1"
                name="type"
              >
                线路基础信息(除策展信息)
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </SelfDialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
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
  showImgDialog = true
  private baseItem = [
    {
      type: 7,
      label: '线路名称',
      key: 'lineName',
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '线路编号',
      key: 'lineId',
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '窗口期',
      key: 'recruitWindowPeriod',
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
    checkbox: 'fadfas'
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
      type: 7,
      label: '配送区域',
      key: 'lineArea'
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
      type: 7,
      label: '服务要求和备注',
      key: 'serviceRequirementName'
    }
  ]
  private deliveryInfo = {}
  private deliveryDemandItme = [
    {
      type: 7,
      label: '配送时间',
      key: 'deliveryWeekCycle'
      // slot deliveryStartDate deliveryEndDate
    },
    {
      type: 7,
      label: '预计月出车天数',
      key: 'monthNum'
    },
    {
      type: 7,
      label: '每日出车趟数',
      key: 'dayNum'
    },
    {
      type: 7,
      label: '预计工作时间',
      key: 'timeDiff'
    },
    {
      type: 7,
      label: '配送数量',
      key: 'deliveryNum'
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
      label: '货物件数',
      key: 'cargoNum'
    },
    {
      type: 7,
      label: '是否需要搬运',
      key: 'carry'
    },
    {
      type: 7,
      label: '货物体积',
      key: 'volume'
    },
    {
      type: 7,
      label: '货物重量',
      key: 'goodsWeight'
    },
    {
      type: 7,
      label: '其他上岗要求',
      key: 'dutyRemark'
    }
  ]
  private goodsInfo = {}
  private SettlementItem = [
    {
      type: 7,
      label: '单趟报价',
      key: 'everyTripGuaranteed'
    },
    {
      type: 7,
      label: '单趟提成报价',
      key: 'everyUnitPrice'
    },
    {
      type: 7,
      label: '预计月报价',
      key: 'shipperOffer'
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
      key: 'settlementDays'
    }
  ]
  private imgArr = [
    {
      imgArr: [
        'https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF',
        'https://5b0988e595225.cdn.sohucs.com/images/20180706/762c46951d624675ab88874a61a11eb5.jpeg'
      ],
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
  showDialog: boolean = false
  dialogForm = {
    type: []
  }
  rules = {
    type: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
    isHot: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
    labelType: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
    isPanacea: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
    sellPoint: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
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
      await this.$refs['ruleForm'].validate()
      await this.checkNewlineSure('3', () => {
        this.showDialog = false
        this.getLineDetail()
        this.dialogForm = { type: [] }
      })
    } catch (error) {
      console.log(error)
    }
  }
  handleClosed() {}
  // 检查通过
  async checkSuccess(this: any) {
    try {
      await this.$refs['lineFormRef'].validate()
      await this.checkNewlineSure('3')
      this.$message({
        type: 'success',
        message: '检查通过'
      })
      this.$refs['lineFormRef'].resetFields()
      this.getLineDetail()
    } catch (error) {
      console.log(error)
    }
  }
  // 滚动到页面顶部
  scrollTo() {
    const ele: any = document.querySelector('.app-main')
    ele.scrollTo({ top: 0, behavior: 'smooth' })
  }
  private isSkip = false
  private labelTypeArr = []
  private queryId = {}
  private hasAgent = true
  // 获取详情数据
  async getLineDetail() {
    try {
      const { data } = await nextNewLineTodo()
      if (!data.success) {
        return this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      const { agentId, lineId, projectId } = data.data
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
      this.baseInfo = data.data.lineDetailVO
      const { isHot, isPanacea, labelType } = data.data.lineDetailVO
      const {
        sellPoint,
        cargoUrl, // 货物图片
        loadingPictureUrl, // zhunghuo
        sellPointName,
        warehousePictureUrl // cangweiz
      } = data.data.projectStrategyInfoVO
      const imgList = [warehousePictureUrl, cargoUrl, loadingPictureUrl]
      this.imgArr.forEach((item, index) => {
        item.imgArr = imgList[index]
      })

      const object = {
        isHot,
        isPanacea,
        labelType,
        sellPoint: sellPoint.split(',')
      }
      this.form = object
      // 页面滚动到具体的位置
      this.scrollTo()
    } catch (error) {
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
  // 检查新线维护代办
  async checkNewlineSure(checkType: string, callBack:Function) {
    try {
      const params: any = Object.assign({ checkType }, this.queryId)
      const { isHot, labelType, isPanacea, sellPoint } = this.form
      debugger
      isHot && (params.isHot = isHot)
      labelType && (params.labelType = labelType)
      isPanacea && (params.isPanacea = isPanacea)
      sellPoint && (params.sellPoint = sellPoint.join(','))
      // 检查不通过
      if (checkType === '3') {
        const rejectionReasons = this.dialogForm.type
        params.rejectionReasons = rejectionReasons.join(',')
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
