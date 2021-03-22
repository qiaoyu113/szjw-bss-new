<template>
  <div class="wutongTable">
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
        <template v-if="isEdit ">
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
      <template v-slot:showClickRate="{row}">
        {{ row.showClickRate }}%
      </template>
      <template v-slot:clickClueRate="{row}">
        {{ row.clickClueRate }}%
      </template>
      <template v-slot:clueInterviewRate="{row}">
        {{ row.clueInterviewRate }}%
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
import { CampaignDataGroupToFirmiana } from '@/api/clue'
import { sumFunc, divisionFunc, accMulFunc } from './index'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'wutong',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: '' }) campaignId!:string
  @Prop({ default: () => [] }) isEdit!:boolean
  private columns:IState[] = [
    {
      key: 'importBatchNo',
      label: '导入批次',
      'width': '100px'
    },
    {
      key: 'createDate',
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
      key: 'interviewNum',
      label: '面试量',
      'width': '100px'
    },
    {
      key: 'dealNum',
      label: '成交量',
      'width': '100px'
    },
    {
      key: 'showClickRate',
      label: '展示-点击转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'clickClueRate',
      label: '点击-线索转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'clueInterviewRate',
      label: '线索-面试转化率',
      'width': '140px',
      slot: true
    },
    {
      key: 'interviewDealRate',
      label: '面试-成交转化率',
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
      key: 'interviewCost',
      label: '面试成本(元)',
      'width': '100px'
    },
    {
      key: 'dealCost',
      label: '成交成本(元)',
      'width': '100px'
    }
  ];
  private tableData:any[] = [];
  // 获取数据统计
  async getTableData() {
    try {
      let params:IState = {
        campaignId: this.campaignId
      }
      let { data: res } = await CampaignDataGroupToFirmiana(params)
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

      const sumCols:string[] = ['showNum', 'clickNum', 'clueNum', 'interviewNum', 'dealNum', 'actualCost'] // 存数字求和
      const percentCols:string[] = ['showClickRate', 'clickClueRate', 'clueInterviewRate', 'interviewDealRate'] // %求平均数
      const costCols:string[] = ['clickCost', 'clueCost', 'interviewCost', 'dealCost'] // 成本求平均数

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
        sums[index] = accMulFunc(percent, 100) + '%'
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
      case 'showClickRate':
        return divisionFunc(sums['clickNum'], sums['showNum'])
        // 点击-线索转化率
      case 'clickClueRate':
        return divisionFunc(sums['clueNum'], sums['clickNum'])
        // 线索-面试转化率
      case 'clueInterviewRate':
        return divisionFunc(sums['interviewNum'], sums['clueNum'])
        // 面试-成交转化率
      case 'interviewDealRate':
        return divisionFunc(sums['dealNum'], sums['interviewNum'])
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
        // 面试成本
      case 'interviewCost':
        return divisionFunc(sums['actualCost'], sums['interviewNum'])
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
.wutongTable >>> .el-table {
  display: flex;
  flex-direction: column;
}

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
.wutongTable >>> .el-table__body-wrapper {
  order: 1;
}
</style>
