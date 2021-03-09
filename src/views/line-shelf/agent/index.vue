<template>
  <div class="p15">
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <Basics
        :line-infor="lineInfor"
        :form-item="formItem"
      />
    </SectionContainer>
    <SectionContainer
      title="配送信息"
      :md="true"
    >
      <self-form
        label-suffix=" :"
        :list-query="listQuery"
        :form-item="formItem1"
        size="small"
        class="p15 SuggestForm"
        :pc-col="6"
      />
    </SectionContainer>
    <SectionContainer
      title="配送时间信息"
      :md="true"
    >
      <SelfForm />
    </SectionContainer>
    <SectionContainer
      title="结算信息"
      :md="true"
    >
      <self-form
        label-suffix=" :"
        :list-query="listQuery"
        :form-item="formItem3"
      />
    </SectionContainer>
    <SectionContainer
      title="货物信息"
      :md="true"
    >
      <self-form
        label-suffix=" :"
        :list-query="listQuery"
        :form-item="formItem4"
      />
    </SectionContainer>
    <SectionContainer
      title="标签信息"
      :md="true"
    >
      <self-form
        label-suffix=" :"
        :list-query="listQuery"
        :form-item="formItem5"
      />
    </SectionContainer>
    <SectionContainer
      title="现场信息"
      :md="true"
    >
      <SelfForm />
    </SectionContainer>
    <SectionContainer
      title="操作日志"
      :md="true"
    >
      <table-date
        :columns="columns"
        :table-data="tableData"
      />
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import Basics from '../components/LineShelfForm/BasicsInfor.vue'
import TableDate from '../components/LineShelfForm/tableDate.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { awitDetail, distribution, settlemen, goods } from '@/api/line-shelf'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Agent',
  components: {
    Basics,
    SectionContainer,
    SelfForm,
    TableDate
  }
})
export default class extends Vue {
   private listQuery:IState = {
     carType: '', // 车型
     carArea: '', // 配送区域
     trip: '', // 单趟报价
     tripCommission: '', // 单趟提成报价
     goodsType: '', // 货物类型
     goodsNum: '', // 货物件数
     ismove: '', // 是否需要搬运
     size: '', // 货物体积
     weight: '', // 货物重量
     other: ''// 其他上岗要求

   }
   // 基础信息
   private lineInfor : IState = [
     {
       key: 'lineNameKey',
       label: '线路名称'
     },
     {
       key: 'lineIdKey',
       label: '线路编号'
     },
     {
       key: 'projectNameKey',
       label: '项目名称'
     },
     {
       key: 'proojectIdKey',
       label: '项目编号'
     }
   ]

  private formItem :IState[] = []
  // 配送信息
  private formItem1 : IState[] = [
    {
      type: 7,
      label: '车型',
      key: 'carType'
    },
    {
      type: 7,
      label: '配送区域',
      key: 'carArea'
    },
    {
      type: 7,
      label: '详细地址',
      key: 'carArea'
    },
    {
      type: 7,
      label: '是否走禁行',
      key: 'carArea'
    },
    {
      type: 7,
      label: '是否走限行',
      key: 'carArea'
    }
  ]
  // 配送时间信息
  private formItem2 : IState[] = []
  // 结算信息
  private formItem3 : IState[] = [
    {
      type: 7,
      label: '单趟报价',
      key: 'trip'
    },
    {
      type: 7,
      label: '单趟提成报价',
      key: 'tripCommission'
    },
    {
      type: 7,
      label: '预计月报价',
      key: 'tripCommission'
    },
    {
      type: 7,
      label: '计价方式',
      key: 'tripCommission'
    },
    {
      type: 7,
      label: '结算周期',
      key: 'tripCommission'
    },
    {
      type: 7,
      label: '结算天数',
      key: 'tripCommission'
    }
  ]
  // 货物信息
  private formItem4 : IState[] = [
    {
      type: 7,
      label: '货物类型',
      key: 'goodsType'
    },
    {
      type: 7,
      label: '货物件数',
      key: 'goodsNum'
    },
    {
      type: 7,
      label: '是否需要搬运',
      key: 'ismove'
    },
    {
      type: 7,
      label: '货物体积',
      key: 'size'
    },
    {
      type: 7,
      label: '货物重量',
      key: 'weight'
    },
    {
      type: 7,
      label: '其他上岗要求',
      key: 'other'
    }
  ]
  // 标签信息
  private formItem5:IState[] = [
    {
      type: 7,
      label: '是否爆款',
      key: 'goodsType'
    },
    {
      type: 7,
      label: '线路肥瘦',
      key: 'goodsType'
    },
    {
      type: 7,
      label: '是否万金油',
      key: 'goodsType'
    },
    {
      type: 7,
      label: '卖点',
      key: 'goodsType'
    }
  ]
  // 操作日志
  private columns : IState = [
    {
      key: 'type',
      label: '类型'
    },
    {
      key: 'ueserName',
      label: '用户名'
    },
    {
      key: 'operationTime',
      label: '操作时间'
    },
    {
      key: 'operationBefore',
      label: '操作前'
    },
    {
      key: 'operationAfter',
      label: '操作后'
    }
  ]
    private tableData:IState= [{
      type: '激活线路',
      ueserName: '王小虎',
      operationTime: '2020-01-03 12:00:00',
      operationBefore: '未开跑下架/已开跑下架',
      operationAfter: '已上架'
    },
    {
      type: '下架线路',
      ueserName: '王小虎',
      operationTime: '2020-01-03 12:00:00',
      operationBefore: '已上架/已开跑',
      operationAfter: '已开跑下架/未来跑下架'
    },
    {
      type: '编辑线路',
      ueserName: '王小虎',
      operationTime: '2020-01-03 12:00:00',
      operationBefore: '',
      operationAfter: ''
    },
    {
      type: '创建线路',
      ueserName: '王小虎',
      operationTime: '2020-01-03 12:00:00',
      operationBefore: '',
      operationAfter: '已上架'
    }]

    // 获取基础信息
    private async getInformation() {
      try {
        let params = {
          lineId: 225
        }
        const { data: res } = await awitDetail(params)
        if (res.success) {
          this.formItem = res.data
        } else {
          this.$message.error(res.errorMsg || res.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    // 获取配送信息
    private async getDistribution() {
      try {
        let params = {
          lineId: 225
        }
        let { data: res } = await distribution(params)
        if (res.success) {
          this.listQuery.carType = res.data.carType
          this.listQuery.carArea = res.data.carArea
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`get duty list fail:${err}`)
      }
    }

    // 获取结算信息
    private async getSettlement() {
      try {
        let params = {
          lineId: 225
        }
        let { data: res } = await settlemen(params)
        if (res.success) {
          this.listQuery.trip = res.data.trip + '元'
          this.listQuery.tripCommission = res.data.tripCommission + '元'
        }
      } catch (err) {
        console.log(`get duty list fail:${err}`)
      }
    }
    //  获取货物信息
    private async getGoods() {
      try {
        let params = {
          lineId: 121
        }
        let { data: res } = await goods(params)
        if (res.success) {
          console.log(res)
          this.listQuery.goodsType = res.data.goodsType
          this.listQuery.goodsNum = res.data.goodsNum + '件'
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`get duty list fail:${err}`)
      }
    }
    mounted() {
      this.getInformation()
      this.getDistribution()
      this.getSettlement()
      this.getGoods()
    }
}
</script>

<style lang="scss" scoped>

</style>
