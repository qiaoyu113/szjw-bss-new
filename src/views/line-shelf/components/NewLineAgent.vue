<template>
  <div class="new-line-container">
    <el-row
      class="row-status"
    >
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
    <section-container title="仓策展信息">
      <self-form
        :form-item="curationItem"
        :list-query="baseInfo"
      />
      <el-row
        :gutter="10"
        class="curation-row"
      >
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>仓库图片</span>
            <div>
              <img
                src="https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>货物图片(1)</span>
            <div>
              <img
                src="https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>装货图片(2)</span>
            <div>
              <img
                src="https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>讲解视频(1)</span>
            <div>
              <img
                src="https://t7.baidu.com/it/u=825057118,3516313570&fm=193&f=GIF"
                alt=""
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </section-container>
    <section-container title="标签信息">
      <el-form
        ref="form"
        :model="form"
        label-width="90px"
      >
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="是否爆款">
              <el-select
                v-model="form.region1"
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
            >
              <el-tooltip
                placement="top"
                effect="light"
              >
                <div slot="content">
                  说明：<br>
                  北京市<br>
                  专车司机： 超肥、单肥、次肥、中肥、极瘦<br>
                  共享司机：次肥、中瘦、极瘦
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
              <el-select
                v-model="form.region1"
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
            >
              <el-tooltip
                placement="top"
                effect="light"
                popper-class="adsadada"
              >
                <template #content>
                  提示<br>
                  如：4.2米干厢货晚上干活，4.2米白天活，金杯下午活
                </template>
                <i
                  class="el-icon-question"
                  style=""
                />
              </el-tooltip>
              <el-select
                v-model="form.region"
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
              label="是否万金油"
              label-width="100%"
            >
              <el-checkbox-group
                v-model="form.ccc"
                size="medium"
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
    <el-row :gutter="20">
      <el-col
        :span="5"
        :offset="4"
      >
        <el-button
          class="agent-button"
          type="info"
          plain
        >
          跳过暂不检查
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          class="agent-button"
          type="primary"
        >
          检查不通过
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          class="agent-button"
          type="primary"
        >
          检查通过
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
@Component({
  name: 'NewLineAgent',
  components: {
    SectionContainer,
    SelfForm
  }
})
export default class extends Vue {
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
      key: 'lineNo',
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
      key: 'lineType'
    },
    {
      type: 7,
      col: 4,

      label: '外线销售:',
      key: 'lineType'
    },
    {
      type: 7,
      col: 4,

      label: '客推经理:',
      key: 'lineType'
    }
  ]
  private curationItem = [
    {
      type: 7,
      label: '仓名称:',
      key: 'lineName',
      col: 4,
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '仓位置:',
      key: 'lineNo',
      col: 4,
      tagAttrs: {
        class: 'active'
      }
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
    name: '',
    region: '',
    region1: '',
    region2: '',
    ccc: []
  }
  private cities = ['上海', '北京', '广州', '深圳']
  private deliveryItem = [
    {
      type: 7,
      label: '车型:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '配送区域:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '详细地址',
      key: 'lineName'
    },
    {
      type: 7,
      label: '是否走禁行:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '是否走限行:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '油电要求:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '装卸要求:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '是否走高速:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '是否需要回单:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '服务要求和备注:',
      key: 'lineName'
    }
  ]
  private deliveryInfo = {}
  private deliveryDemandItme = [
    {
      type: 7,
      label: '配送时间:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '预计月出车天数:',
      key: 'lineName'
    }, {
      type: 7,
      label: '每日出车趟数:',
      key: 'lineName'
    }, {
      type: 7,
      label: '预计工作时间:',
      key: 'lineName'
    }, {
      type: 7,
      label: '配送数量:',
      key: 'lineName'
    }, {
      type: 7,
      label: '配送里程:',
      key: 'lineName'
    }
  ]
  private deliveryDemandInfo ={}
  private goodsItem = [
    {
      type: 7,
      label: '货物类型:',
      key: 'lineName'
    },
    {
      type: 7,
      label: '货物件数:',
      key: 'lineName'
    }, {
      type: 7,
      label: '是否需要搬运:',
      key: 'lineName'
    }, {
      type: 7,
      label: '货物体积:',
      key: 'lineName'
    }, {
      type: 7,
      label: '货物重量:',
      key: 'lineName'
    }, {
      type: 7,
      label: '其他上岗要求:',
      key: 'lineName'
    }
  ]
  private goodsInfo = {

  }
  private SettlementItem = [
    {
      type: 7,
      label: '单趟报价:',
      key: 'lineName'
    }, {
      type: 7,
      label: '单趟提成报价:',
      key: 'lineName'
    }, {
      type: 7,
      label: '预计月报价:',
      key: 'lineName'
    }, {
      type: 7,
      label: '计价方式:',
      key: 'lineName'
    }, {
      type: 7,
      label: '结算周期:',
      key: 'lineName'
    }, {
      type: 7,
      label: '结算天数:',
      key: 'lineName'
    }
  ]
}
</script>

<style lang="scss" scoped>
.row-status {
  margin: 0 !important;
  background: linear-gradient(225deg, #64C9EE 0%, #649CEE 100%);
  padding: 18px 0;
}
.col-status {
  border-right:1px solid #EFF5FE;
  padding: 4px 0;
  color: #FFF;
  &:nth-last-child(1){
    border: none;
  }
  span{
    display:block;
    text-align: center;
    width: 100%;
  }
  .number{
    font-size: 18px;
    margin-bottom:4px ;
  }
  .title{
    font-size: 14px;
  }
}
.agent-button {
  margin: 20px 0;
  width: 100% !important;
  border: none;
}
.curation-row {
  padding: 15px;
}
.curation-col {
  .curation-title {
    display: flex;
    font-size: 0;
    span {
      font-size: 14px;
      color: #838383;
      line-height: 26px;
      max-width: 120px;
      margin-right:16px ;
      display: inline-block;
    }
    div {
      flex: 1;
      width: 260px;
      height: 160px;
      border-radius: 5px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
// 按钮组的样式
.check-label {
  margin-right: 20px;
}
::v-deep .el-checkbox-button__inner {
  border: none;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  box-sizing: border-box;
}
::v-deep .is-checked {
  .el-checkbox-button__inner {
    border: 1px solid #649cee !important;
    box-shadow: none !important;
  }
}
</style>

<style lang="scss" scoped>
.new-line-container {
  ::v-deep .SectionContainer {
    margin-top: 8px;
    box-shadow: none;
    border-bottom: 2px solid #F8F9FA;
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
  ::v-deep .active {
    color: #4899d0;
  }
  ::v-deep .error {
    color: red;
  }
  .el-icon-question {
    font-size: 18px;
    line-height: 36px;
    margin-right: 6px;
  }
  ::v-deep .el-form-item{
    margin-bottom: 12px !important;
  }
  .question-item {
    ::v-deep .el-form-item__label {
      padding: 0 !important;
      margin-right: 6px;
    }
    .el-select {
      width: calc(100% - 50px);
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
  margin: 20px 0 0 20px;
}
</style>
<style lang="scss">
.adsadada{
  border: none !important;
  box-shadow: 0 -2px 6px 0 rgba(0,0,0,0.24);
  .popper__arrow{
    border: none;
  box-shadow: 0 -2px 6px 0 rgba(0,0,0,0.24);

  }
}
</style>
