<template>
  <div class="demoContainer">
    <el-card>
      <Atable
        obj="{}"
        :is-more="true"
        :is-show-percent="true"
        :table-data="tableData1"
      />
    </el-card>
    <el-card style="margin-top:30px;">
      <Atable
        :is-more="true"
        :obj="tableData1[0]"
        :is-show-percent="true"
        :table-data="tableData2"
      />
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Atable from '../guestList/components/Atable.vue'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    Atable
  }
})
export default class extends Vue {
  private obj:IState = {
    a: '京东传站',
    b: '李外线经理',
    lineId: 'XL202012300377',
    c: '3',
    d: '4.2米厢货',
    e: '油车',
    f: '能闯禁行',
    g: '能闯限行行',
    h: '共享',
    p1: '湖南省',
    c1: '长沙市',
    c2: '短沙县',
    m1: 500,
    time: '9:00~18:00',
    percent: 80,
    id: 1,
    arr: ['商贸信息', '已创建30条线路', '15条在跑', '5条线路已掉线', '3条线路在上架找车'],
    brr: ['1个点', '每日1趟', '每月12天', '每趟120公里', '走高速', '回单', '城配线', '稳定(2个月)'],
    crr: ['已发起3次客邀', '已创建意向3次', '试跑失败2次', '司机爽约1次', '扭头就走1次', '掉线1次'],
    isOpen: false
  }
  private tableData1:IState[] = []
  private tableData2:IState[] = []
  mounted() {
    for (let index = 0; index < 10; index++) {
      if (index === 0) {
        this.tableData1.push({ ...this.obj, id: `driverId${index}` })
      }
      this.tableData2.push({ ...this.obj, id: `lineId${index}` })
    }
  }
}
</script>
<style lang="scss" scoped>
  .demoContainer {
    padding: 20px 50px;
  }
</style>
