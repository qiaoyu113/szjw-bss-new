<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-28 17:48:58
 * @LastEditors: D.C.base
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
    @open="handleOpenClick"
  >
    <Scroll
      :on-reach-bottom="loadMoreHandle"
      :distance-to-edge="0"
    >
      <!-- 撮合线路 -->
      <section class="departLine">
        <h3>待撮合司机</h3>
        <AtableDriver
          ref="driverDrawer"
          :list-query="listQueryDriver"
          :driver-table-data.sync="driverTableData"
          :is-more="true"
          :is-show-percent="false"
          :op-type="[]"
          @tag="setTagHandle"
          @call="setCallHandle"
          @creatRun="creatRunHandle"
        />
      </section>
      <!-- 撮合匹配的司机列表 -->
      <section class="matchDriver">
        <!-- 搜索项 -->
        <SearchKeyWords />
        <h3>司机匹配线路</h3>
        <div class="lineTable">
          <AtableLine
            ref="lineTableDrawer"
            :line-table-data="lineTableData"
            :is-show-percent="true"
            obj="{}"
            :is-more="true"
          />
        </div>
      </section>
      <SetTag ref="tagShow" />
    </Scroll>
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Scroll from '@/components/Scroll/index.vue'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import CreateTryRun from '../chauffeurList/components/CreateTryRun.vue'
import AtableLine from '../guestList/components/Atable.vue'
import AtableDriver from '../chauffeurList/components/Atable.vue'
import SetTag from './components/SetTag.vue'
import { AppModule } from '@/store/modules/app'
  interface IState {
    [key: string]: any;
  }
  @Component({
    components: {
      Scroll,
      DrawerModel,
      SearchKeyWords,
      AtableLine,
      AtableDriver,
      CreateTryRun,
      SetTag
    }
  })
export default class GuestDrawer extends Vue {
    @Prop({ default: false }) private value !: boolean
    private visible : boolean = false // 抽屉显示隐藏
    private tagShow:boolean = false
    private pageSize:number = 1
    private tryRunShow:boolean = false
    private rowData:object = {}
    private lineTableData:IState[] = [] // 线路列表
    private driverTableData:IState[] = [] // 司机列表
    private listQueryLine:IState = {
      labelType: '',
      isBehavior: '',
      isRestriction: '',
      status: '',
      start: '',
      end: '',
      f1: '',
      f2: ''
    }
    private listQueryDriver:IState = {
      labelType: '',
      isBehavior: '',
      isRestriction: '',
      status: '',
      start: '',
      end: '',
      f1: '',
      f2: ''
    }
    $eventBus: any
    @Watch('value')
    onValueChanged(val: boolean, oldVal: boolean) {
      this.visible = val
      this.$eventBus.$emit('setIndex', val)
    }
    closeHandle() {
      this.visible = false
      this.$emit('input', false);
      // 关闭抽屉删掉线路表格的数据
      (this.$refs.driverDrawer as any).removeTableInfo()
    }
    setTagHandle() {
      (this.$refs.tagShow as any).isShow = true
    }
    setCallHandle(data:any) {
      let phone = data.phoneNum
      let repStr = phone.substr(3)
      let newStr = phone.replace(repStr, '********')
      this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(123)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消拨打'
        })
      })
    }
    handleOpenClick() {
      AppModule.CloseSideBar(false)
    }
    creatRunHandle(data:any) {
      (this.$refs.tryRunShow as any).showDialog = true
      this.rowData = data
    }
    // 获取列表数据
    async getLists() {
      try {
        // this.lineTableData = []
        this.pageSize++
        let num:number = 3
        for (let i = 0; i < num; i++) {
          let obj:IState = {
            a: '京东传站',
            b: '李外线经理',
            lineId: 'XL202012300377',
            c: '3',
            d: '4.2米厢货',
            e: '油车',
            f: '能闯禁行',
            g: '能闯限行',
            h: '单肥',
            p1: '湖南省',
            c1: '长沙市',
            c2: '短沙县',
            m1: 500,
            time: '9:00~18:00',
            percent: 80,
            id: (this.pageSize - 1) * 3 + i,
            arr: ['商贸信息', '已创建30条线路', '15条在跑', '5条线路已掉线', '3条线路在上架找车'],
            brr: ['1个点', '每日1趟', '每月12天', '每趟120公里', '走高速', '回单', '城配线', '稳定(2个月)'],
            crr: ['已发起3次客邀', '已创建意向3次', '试跑失败2次', '司机爽约1次', '扭头就走1次', '掉线1次'],
            createDate: '2021-04-15 12:00'
          }
          obj.isOpen = false
          obj.id = ((this.pageSize - 1) * 3 + i + 1)
          this.lineTableData.push({ ...obj })
        }
      } catch (err) {
        console.log(`get list fail fail:${err}`)
      } finally {
        console.log('')
      }
    }
    loadMoreHandle() {
      this.getLists()
    }
    mounted() {
      this.getLists()
    }
}
</script>
<style lang="scss" scoped>
  .drawerBox {
    width: 100%;
    height: 100%;
    overflow: auto;
    ::v-deep .el-drawer{
      overflow: initial;
      //background: #e6e9f0;
    }
  }
  .departLine{
    padding: 20px 30px;
    background: #fff;
    margin-bottom: 10px;
  }
  .matchDriver{
    background: #fff;
    padding-bottom: 20px;
    h3{
      padding: 0 30px;
    }
    .lineTable{
      width:100%;
      padding: 0 30px;
      overflow: auto;
    }
  }
  .actionBtn{
    display: flex;
    width: 25px;
    height: 60px;
    justify-content: center;
    align-items: center;
    position: absolute;
    left:-25px;
    top:50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 10px 0 0 10px;
    z-index: 1000;
  }
</style>
