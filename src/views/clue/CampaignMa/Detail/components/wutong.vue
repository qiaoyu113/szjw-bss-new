<template>
  <div>
    <self-table
      :index="false"
      :is-p30="false"
      :operation-list="[]"
      :table-data="tableData"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
      :columns="columns"
    >
      <template v-slot:d="{row,index}">
        <template v-if="isEdit && index !==0">
          <el-input
            v-model="row.d1"
            v-only-number="{min: 0, max: 999999,precision: 0}"
          />
        </template>
        <template v-else>
          {{ row.d | DataIsNull }}
        </template>
      </template>
      <template v-slot:e="{row,index}">
        <template v-if="isEdit && index !==0">
          <el-input
            v-model="row.e1"
            v-only-number="{min: 0, max: 999999,precision: 0}"
          />
        </template>
        <template v-else>
          {{ row.e | DataIsNull }}
        </template>
      </template>
      <template v-slot:m="{row,index}">
        <template v-if="isEdit && index !==0">
          <el-input
            v-model="row.m1"
            v-only-number="{min: 0, max: 999999.99,precision: 2}"
          />
        </template>
        <template v-else>
          {{ row.m | DataIsNull }}
        </template>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
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
  @Prop({ default: () => [] }) tableData!:any[]
  @Prop({ default: () => [] }) isEdit!:boolean
  private columns:IState[] = [
    {
      key: 'a',
      label: '导入批次',
      'width': '140px'
    },
    {
      key: 'b',
      label: '线索导入时间',
      'width': '140px'
    },
    {
      key: 'c',
      label: '导入人',
      'width': '140px'
    },
    {
      key: 'd',
      label: '展示量',
      'width': '140px',
      slot: true
    },
    {
      key: 'e',
      label: '点击量',
      'width': '140px',
      slot: true
    },
    {
      key: 'f',
      label: '线索量',
      'width': '140px'
    },
    {
      key: 'g',
      label: '面试量',
      'width': '140px'
    },
    {
      key: 'h',
      label: '成交量',
      'width': '140px'
    },
    {
      key: 'i',
      label: '展示-点击转化率',
      'width': '140px'
    },
    {
      key: 'j',
      label: '点击-线索转化率',
      'width': '140px'
    },
    {
      key: 'k',
      label: '线索-面试转化率',
      'width': '140px'
    },
    {
      key: 'l',
      label: '面试-成交转化率',
      'width': '140px'
    },
    {
      key: 'm',
      label: '实际费用(元)',
      'width': '140px',
      slot: true
    },
    {
      key: 'n',
      label: '点击成本(元)',
      'width': '140px'
    },
    {
      key: 'o',
      label: '线索成本(元)',
      'width': '140px'
    },
    {
      key: 'p',
      label: '面试成本(元)',
      'width': '140px'
    },
    {
      key: 'q',
      label: '成交成本(元)',
      'width': '140px'
    }
  ];
}
</script>
<style lang="scss" scoped>
</style>
