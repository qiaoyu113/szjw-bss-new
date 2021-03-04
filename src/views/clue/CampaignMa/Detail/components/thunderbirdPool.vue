<template>
  <div class="thunderbirdPool">
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
      <template v-slot:clueAlreadyPoolRate="{row}">
        {{ row.clueAlreadyPoolRate }}%
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { CampaignDataGroupToThunderBirdTruckPool } from '@/api/clue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'thunderbirdPool',
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
      'width': '140px'
    },
    {
      key: 'importDate',
      label: '线索导入时间',
      'width': '180px'
    },
    {
      key: 'importUserName',
      label: '导入人',
      'width': '140px'
    },
    {
      key: 'showNum',
      label: '展示量',
      'width': '140px',
      slot: true
    },
    {
      key: 'clickNum',
      label: '点击量',
      'width': '140px',
      slot: true
    },
    {
      key: 'clueNum',
      label: '线索量',
      'width': '140px'
    },
    {
      key: 'surePoolNum',
      label: '可入池量',
      'width': '140px'
    },
    {
      key: 'stayPoolNum',
      label: '待入池量',
      'width': '140px'
    },
    {
      key: 'alreadyPoolNum',
      label: '已入池量',
      'width': '140px'
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
      key: 'clueAlreadyPoolRate',
      label: '线索-已入池转化率',
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
      'width': '140px'
    },
    {
      key: 'clueCost',
      label: '线索成本(元)',
      'width': '140px'
    },
    {
      key: 'alreadyPoolCost',
      label: '入池成本(元)',
      'width': '140px'
    }
  ];
  private tableData:any[] = [];
  // 获取数据统计
  async getTableData() {
    try {
      let params:IState = {
        campaignId: this.campaignId
      }
      let { data: res } = await CampaignDataGroupToThunderBirdTruckPool(params)
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

      const sumCols:string[] = ['showNum', 'clickNum', 'clueNum', 'surePoolNum', 'stayPoolNum', 'alreadyPoolNum'] // 存数字求和
      const percentCols:string[] = ['clickConversionRate', 'clickClueConversionRate', 'clueAlreadyPoolRate'] // %求平均数
      const costCols:string[] = ['actualCost', 'clickCost', 'clueCost', 'alreadyPoolCost'] // 成本求平均数

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
        sums[index] = this.sumFunc(sumArr)
      } else if (percentArr.length > 0) {
        let len:number = this.tableData.length
        sums[index] = this.sumFunc(percentArr, len) + '%'
      } else if (costArr.length > 0) {
        let len:number = this.tableData.length
        sums[index] = this.sumFunc(costArr, len)
      } else {
        sums[index] = ''
      }
    })
    return sums
  }
  // 求和函数
  sumFunc(values:number[], len:number = 0) {
    let sums:number = 0
    if (!values.every(value => isNaN(value))) {
      sums = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
      if (len > 0) {
        let num:number = sums / len
        if (parseInt(String(num), 10) === num) {
          return num
        }
        return num.toFixed(2)
      } else {
        return sums
      }
    }
  }
}
</script>
<style lang="css" scoped>
.thunderbirdPool >>> .el-table {
  display: flex;
  flex-direction: column;
}

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
.thunderbirdPool >>> .el-table__body-wrapper {
  order: 1;
}
</style>
