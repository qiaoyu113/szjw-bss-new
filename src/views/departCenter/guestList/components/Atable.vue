<template>
  <div>
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        highlight-current-row
        size="mini"
        :row-style="{height: '20px'}"
        fit
        :cell-style="{padding: '5px 0'}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            1212
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="基础信息"
          width="180"
        />
        <el-table-column
          prop="date"
          label="车辆"
          width="180"
        />
        <el-table-column
          prop="date"
          label="配送信息"
          width="180"
        />
        <el-table-column
          prop="date"
          label="结算"
          width="180"
        />
        <el-table-column
          prop="date"
          label="线路特点"
          width="180"
        />
        <el-table-column
          prop="date"
          label="标签"
          width="180"
        />
        <el-table-column
          prop="date"
          label="状态"
          width="180"
        />
        <el-table-column
          prop="date"
          label="操作"
          width="180"
        />
      </el-table>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component
export default class extends Vue {
  @Prop({ default: () => {} }) tableData!:IState[]
}
</script>
<style lang="scss" scoped>
</style>
