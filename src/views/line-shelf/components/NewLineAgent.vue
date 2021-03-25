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
    <!-- 基础信息  -->
    <section-container title="基础信息">
      <self-form
        :form-item="baseItem"
        :list-query="baseInfo"
      />
    </section-container>
    <CuratorialInformation />
    <section-container title="标签信息">
      <el-form
        ref="lineFormRef"
        :model="form"
        :rules="rules"
        class="lable-form"
        label-width="80px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item
              label="是否爆款"
              prop="explosion"
            >
              <el-select
                v-model="form.explosion"
                placeholder="请选择"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="线路肥瘦"
              class="question-item"
              prop="lineM"
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
                v-model="form.lineM"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="是否万金油"
              class="question-item"
              prop="Panacea"
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
                  <i
                    class="el-icon-question"
                  />
                </el-tooltip>
              </template>
              <el-select
                v-model="form.Panacea"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
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
              prop="sellingPoint"
            >
              <template #label>
                卖点(多选)：
                <span style="font-size:12px;color:#838383">
                  修改卖点后，将修改该线路的项目下所有的线路的卖点
                </span>
              </template>
              <el-checkbox-group
                v-model="form.sellingPoint"
                size="mini"
              >
                <el-checkbox-button
                  v-for="city in cities"
                  :key="city"
                  class="check-label"
                  :label="city"
                >
                  {{ city }}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section-container>
    <section-container title="配送信息">
      <self-form
        :form-item="deliveryItem"
        :list-query="deliveryInfo"
      />
    </section-container>
    <section-container title="配送要求">
      <self-form
        :form-item="deliveryDemandItme"
        :list-query="deliveryDemandInfo"
      />
    </section-container>
    <section-container title="货物信息">
      <self-form
        :form-item="deliveryDemandItme"
        :list-query="deliveryDemandInfo"
      />
    </section-container>
    <section-container title="结算信息">
      <self-form
        :form-item="deliveryDemandItme"
        :list-query="deliveryDemandInfo"
      />
    </section-container>

    <!-- 按钮 -->
    <div class="new-line-btn">
      <el-button
        class="agent-button"
        type="info"
        plain
        :loading="isSkip"
        @click="skipCheck"
      >
        跳过暂不检查
      </el-button>

      <el-button
        class="agent-button"
        type="primary"
        @click="checkError"
      >
        检查不通过
      </el-button>

      <el-button
        class="agent-button"
        type="primary"
        @click="checkSuccess"
      >
        检查通过
      </el-button>
    </div>
    <!-- 分页 -->
    <!-- :operation-list="operationList" -->
    <pagination
      v-show="true"
      :operation-list="[]"
      :total="1000"
      :page="1"
      :limit="12"
    />

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
              label="项目策展信息(卖点、爆款、肥瘦、万金油)"
              name="type"
            />
            <el-checkbox
              label="线路基础信息(除策展信息)"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import pagination from '@/components/Pagination/index.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import CuratorialInformation from '../agent/CuratorialInformation.vue'
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
  showImgDialog= true
  private baseItem = [
    {
      type: 7,
      label: '线路名称:',
      key: 'lineName',
      col: 4,
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '线路编号:',
      key: 'lineId',
      col: 4,
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '窗口期:',
      key: 'windowDate',
      col: 4,
      tagAttrs: {
        class: 'error'
      }
    },
    {
      type: 7,
      col: 4,
      label: '线路分类:',
      key: 'lineCategory'
    },
    {
      type: 7,
      col: 4,

      label: '外线销售:',
      key: 'lineSaleName'
    },
    {
      type: 7,
      col: 4,

      label: '客推经理:',
      key: 'aaa'
    }
  ]
  private baseInfo = {
    checkbox: 'fadfas'
  }
  private listQuery = {}
  private hasOption = [
    {
      leble: '是',
      name: '0'
    },
    {
      leble: '否',
      name: '1'
    }
  ]
  private form = {
    explosion: '',
    lineM: '',
    Panacea: '',
    sellingPoint: []
  }
  private cities = ['上海', '北京', '广州', '深圳']
  private deliveryItem = [
    {
      type: 7,
      label: '车型:',
      key: 'carVal'
    },
    {
      type: 7,
      label: '配送区域:',
      key: 'deliveryAreaName'
    },
    {
      type: 7,
      label: '详细地址',
      key: 'districtArea'
    },
    {
      type: 7,
      label: '是否走禁行:',
      key: 'distributionWay'
    },
    {
      type: 7,
      label: '是否走限行:',
      key: 'distributionWay'
    },
    {
      type: 7,
      label: '油电要求:',
      key: 'oilElectricityRequirementName'
    },
    {
      type: 7,
      label: '装卸要求:',
      key: 'handlingDifficulty'
    },
    {
      type: 7,
      label: '是否走高速:',
      key: 'runSpeed'
    },
    {
      type: 7,
      label: '是否需要回单:',
      key: 'returnBill'
    },
    {
      type: 7,
      label: '服务要求和备注:',
      key: 'distance'
    }
  ]
  private deliveryInfo = {}
  private deliveryDemandItme = [
    {
      type: 7,
      label: '配送时间:',
      key: 'deliveryTime'
    },
    {
      type: 7,
      label: '预计月出车天数:',
      key: 'monthNum'
    },
    {
      type: 7,
      label: '每日出车趟数:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '预计工作时间:',
      key: 'timeDiff'
    },
    {
      type: 7,
      label: '配送数量:',
      key: 'aa'
    },
    {
      type: 7,
      label: '配送里程:',
      key: 'lineName'
    }
  ]
  private deliveryDemandInfo = {}
  private goodsItem = [
    {
      type: 7,
      label: '货物类型:',
      key: 'cargoTypeName'
    },
    {
      type: 7,
      label: '货物件数:',
      key: 'cargoNum'
    },
    {
      type: 7,
      label: '是否需要搬运:',
      key: 'carry'
    },
    {
      type: 7,
      label: '货物体积:',
      key: 'aa'
    },
    {
      type: 7,
      label: '货物重量:',
      key: 'aa'
    },
    {
      type: 7,
      label: '其他上岗要求:',
      key: 'dutyRemark'
    }
  ]
  private goodsInfo = {}
  private SettlementItem = [
    {
      type: 7,
      label: '单趟报价:',
      key: 'everyTripGuaranteed'
    },
    {
      type: 7,
      label: '单趟提成报价:',
      key: 'everyUnitPrice'
    },
    {
      type: 7,
      label: '预计月报价:',
      key: 'shipperOffer'
    },
    {
      type: 7,
      label: '计价方式:',
      key: 'incomeSettlementMethodName'
    },
    {
      type: 7,
      label: '结算周期:',
      key: 'settlementCycleName'
    },
    {
      type: 7,
      label: '结算天数:',
      key: 'settlementDays'
    }
  ]

  showDialog:boolean =false
  dialogForm={
    type: []
  }
  rules ={
    type: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ],
    explosion: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ],
    lineM: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ],
    Panacea: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ],
    sellingPoint: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]

  }
  checkError() {
    this.showDialog = true
  }
  async confirm(this:any) {
    try {
      await this.$refs['ruleForm'].validate()
    } catch (error) {
      console.log(error)
    }
  }
  handleClosed() {}

  async checkSuccess(this:any) {
    try {
      await this.$refs['lineFormRef'].validate()
      this.$message({
        type: 'success',
        message: '检查通过'
      })
    } catch (error) {
      console.log(error)
    }
  }
  private isSkip = false
  skipCheck() {
    // const ele = document.querySelector('.app-main').scrollTo(0, 1000)
    // if (!this.isSkip) {
    //   this.isSkip = true
    //   // setTimeout(() => {
    //   //   console.log('fasdfsa')
    //   //   this.isSkip = false
    //   // }, 2500)
    // }
  }
  getLineDetail() {
    console.log('eqweq')
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
  border: 1px solid #649CEE !important;
  border-radius: 4px !important;
  box-sizing: border-box;
  color: #649CEE;
}
::v-deep .is-checked {
  .el-checkbox-button__inner {
    border: 1px solid #649cee !important;
    box-shadow: none !important;
  }
}
.new-line-btn{
  display: flex;
  justify-content: flex-end;
  padding: 40px 60px;
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
    vertical-align: middle;
    margin-right: 6px;
    color: #656565;
  }
  ::v-deep .el-form-item {
    margin-bottom: 12px !important;
  }
  .lable-form{
    ::v-deep .el-form-item__label {
      color: #333 !important;
    }
  }
  .question-item {
    ::v-deep .el-form-item__label {
      padding: 0 !important;
      margin-right: 6px;
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
