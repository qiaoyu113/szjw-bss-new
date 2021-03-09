<template>
  <div class="TableDate">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[item.key] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'TableData'
})
export default class extends Vue {
  @Prop({ default: () => [] })columns!:any[]
  @Prop({ default: () => [] })tableData!:any[]
}
</script>
