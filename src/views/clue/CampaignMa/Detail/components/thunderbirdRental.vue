<template>
  <div class="thunderbirdRental">
    <self-table
      :index="false"
      :is-p30="false"
      :operation-list="[]"
      :summary-method="getSummaries"
      show-summary
      :table-data="tableData"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
      :columns="columns"
    >
      <template v-slot:showNum="{row}">
        <template v-if="isEdit">
          <el-input
            v-model="row.showNum1"
            v-only-number="{min: 0, max: 999999,precision: 0}"
          />
        </template>
        <template v-else>
          {{ row.showNum | DataIsNull }}
        </template>
      </template>
      <template v-slot:clickNum="{row}">
        <template v-if="isEdit">
          <el-input
            v-model="row.clickNum1"
            v-only-number="{min: 0, max: 999999,precision: 0}"
          />
        </template>
        <template v-else>
          {{ row.clickNum | DataIsNull }}
        </template>
      </template>
      <template v-slot:actualCost="{row}">
        <template v-if="isEdit">
          <el-input
            v-model="row.actualCost1"
            v-only-number="{min: 0, max: 999999.99,precision: 2}"
          />
        </template>
        <template v-else>
          {{ row.actualCost | DataIsNull }}
        </template>
      </template>
      <template v-slot:clickConversionRate="{row}">
        {{ row.clickConversionRate }}%
      </template>
      <template v-slot:clickClueConversionRate="{row}">
        {{ row.clickClueConversionRate }}%
      </template>
      <template v-slot:interviewDealRate="{row}">
        {{ row.interviewDealRate }}%
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { CampaignDataGroupToThunderBirdRental } from '@/api/clue'
import { sumFunc, divisionFunc, isInteger } from './index'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'thunderbirdRental',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: '' }) campaignId!:string
  @Prop({ default: () => [] }) isEdit!:boolean
  private columns:IState[] = [
    {
      key: 'importBatch',
      label: '导入批次',
      'width': '100px'
    },
    {
      key: 'importDate',
      label: '线索导入时间',
      'width': '180px'
    },
    {
      key: 'importUserName',
      label: '导入人',
      'width': '100px'
    },
    {
      key: 'showNum',
      label: '展示量',
      'width': '100px',
      slot: true
    },
    {
      key: 'clickNum',
      label: '点击量',
      'width': '100px',
      slot: true
    },
    {
      key: 'clueNum',
      label: '线索量',
      'width': '100px'
    },
    {
      key: 'intentionNum',
      label: '有意向量',
      'width': '100px'
    },
    {
      key: 'toFancyNum',
      label: '已看中量',
      'width': '100px'
    },
    {
      key: 'dealNum',
      label: '已成交量',
      'width': '100px'
    },
    {
      key: 'clickConversionRate',
      label: '展示-点击转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'clickClueConversionRate',
      label: '点击-线索转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'interviewDealRate',
      label: '线索-成交转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'actualCost',
      label: '实际费用(元)',
      'width': '140px',
      slot: true
    },
    {
      key: 'clickCost',
      label: '点击成本(元)',
      'width': '100px'
    },
    {
      key: 'clueCost',
      label: '线索成本(元)',
      'width': '100px'
    },
    {
      key: 'dealCost',
      label: '成交成本(元)',
      'width': '100px'
    }
  ];
  private tableData:any[] = [];
  async getTableData() {
    try {
      let params:IState = {
        campaignId: this.campaignId
      }

      let { data: res } = await CampaignDataGroupToThunderBirdRental(params)
      if (res.success) {
        this.tableData = res.data.map((item:IState) => {
          item.showNum1 = item.showNum
          item.clickNum1 = item.clickNum
          item.actualCost1 = item.actualCost
          return item
        })
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get table fail:${err}`)
    } finally {
      //
    }
  }
  getSummaries(param:IState) {
    const { columns, data } = param
    const sums:any[] = []

    columns.forEach((column:IState, index:number) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      let sumArr:number[] = []
      let percentArr:number[] = []
      let costArr:number[] = []

      const sumCols:string[] = ['showNum', 'clickNum', 'clueNum', 'intentionNum', 'toFancyNum', 'dealNum', 'actualCost'] // 存数字求和
      const percentCols:string[] = ['clickConversionRate', 'clickClueConversionRate', 'interviewDealRate'] // %求平均数
      const costCols:string[] = ['clickCost', 'clueCost', 'dealCost'] // 成本求平均数

      data.forEach((item:IState) => {
        if (sumCols.includes(column.property)) {
          sumArr.push(item[column.property])
        } else if (percentCols.includes(column.property)) {
          percentArr.push(item[column.property])
        } else if (costCols.includes(column.property)) {
          costArr.push(item[column.property])
        }
      })
      if (sumArr.length > 0) {
        sums[index] = sumFunc(sumArr)
        sums[column.property] = sumFunc(sumArr)
      } else if (percentArr.length > 0) {
        let percent:number = this.percentFunc(sums, column.property)
        sums[index] = isInteger(percent * 100) + '%'
      } else if (costArr.length > 0) {
        let coast:number = this.coastFunc(sums, column.property)
        sums[index] = coast
      } else {
        sums[index] = ''
      }
    })
    return sums
  }

  // 计算转化率
  percentFunc(sums:any, prop:string) {
    switch (prop) {
      // 展示-点击转化率
      case 'clickConversionRate':
        return divisionFunc(sums['clickNum'], sums['showNum'])
        // 点击-线索转化率
      case 'clickClueConversionRate':
        return divisionFunc(sums['clueNum'], sums['clickNum'])
        // 线索-成交转化率
      case 'interviewDealRate':
        return divisionFunc(sums['dealNum'], sums['clueNum'])
      default:
        return 0
    }
  }
  // 计算成本
  coastFunc(sums:any, prop:string) {
    switch (prop) {
      // 点击成本
      case 'clickCost':
        return divisionFunc(sums['actualCost'], sums['clickNum'])
        // 线索成本
      case 'clueCost':
        return divisionFunc(sums['actualCost'], sums['clueNum'])
        // 成交成本
      case 'dealCost':
        return divisionFunc(sums['actualCost'], sums['dealNum'])
      default:
        return 0
    }
  }
}
</script>
<style lang="css" scoped>
.thunderbirdRental >>> .el-table {
  display: flex;
  flex-direction: column;
}

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
.thunderbirdRental >>> .el-table__body-wrapper {
  order: 1;
}
</style>
