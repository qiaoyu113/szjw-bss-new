<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords />
    <h3>司机匹配线路</h3>
    <div class="lineTable">
      <AtableDriver
        ref="tableDriver"
        :list-query="listQuery"
        :is-show-percent="true"
        :driver-table-data="driverTableData"
        :is-more="true"
        :op-type="[-1,3,4,5]"
        @call="setCallHandle"
        @tag="setTagHandle"
        @creatRun="creatRunHandle"
        @detail="detailHandle"
      />
    </div>
    <SetTag ref="tagShow" />
    <CreateTryRun
      ref="tryRunShow"
      :obj="rowData"
    />
    <DetailDialog
      actived="third"
      :driver-id="detailId"
      :dialog-table-visible.sync="detailDialog"
    />
  </section>
</template>

<script lang="ts">
import SearchKeyWords from './SearchKeyWords.vue'
import AtableDriver from '../../chauffeurList/components/Atable.vue'
import SetTag from './SetTag.vue'
import CreateTryRun from '../../guestList/components/CreateTryRun.vue'
import DetailDialog from '../../chauffeurList/components/DetailDialog.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    AtableDriver,
    SearchKeyWords,
    SetTag,
    CreateTryRun,
    DetailDialog
  }
})
export default class DepartLine extends Vue {
  private tryRunShow:boolean = false
  private rowData:object = {}
  private driverTableData:IState[] = [] // 司机列表
  private detailDialog:Boolean = false
  private detailId:string = ''
  private pageSize:number = 1
  private listQuery:IState = {
    labelType: '',
    isBehavior: '',
    isRestriction: '',
    status: '',
    start: '',
    end: '',
    f1: '',
    f2: ''
  }
  setTagHandle(row:any) {
    (this.$refs.tagShow as any).isShow = true
    this.rowData = row
    console.log(row)
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
      (this.$refs.tableDriver as any).callPhone(phone, '123')
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消拨打'
      })
    })
  }
  creatRunHandle(data:any) {
    (this.$refs.tryRunShow as any).showDialog = true
    this.rowData = data
  }
  detailHandle() {
    this.detailDialog = true
  }
  // 获取列表数据
  async getLists() {
    try {
      this.pageSize++
      let num:number = 3
      // this.driverTableData = []
      for (let i = 0; i < num; i++) {
        let obj:IState = {
          driverName: '张道松',
          manager: '李加盟经理',
          driverId: 'SJ20210415',
          phoneNum: '132000000000',
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
          id: (this.pageSize - 1) * 3 + i,
          arr: [
            '商贸信息',
            '已创建30条线路',
            '15条在跑',
            '5条线路已掉线',
            '3条线路在上架找车'
          ],
          brr: [
            '1个点',
            '每日1趟',
            '每月12天',
            '每趟120公里',
            '走高速',
            '回单',
            '城配线',
            '稳定(2个月)'
          ],
          crr: [
            '已发起3次客邀',
            '已创建意向3次',
            '试跑失败2次',
            '司机爽约1次',
            '扭头就走1次',
            '掉线1次'
          ]
        }
        obj.isOpen = false
        obj.id = ((this.pageSize - 1) * 3 + i + 1)
        this.driverTableData.push({ ...obj })
      }
      if (this.pageSize > 3) {
        this.$emit('on-end')
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      console.log('')
    }
  }
  mounted() {
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
.matchDriver{
  background: #fff;
  padding-bottom: 20px;
  h3{
    padding: 0 30px;
    margin-top: 15px;
  }
  .lineTable{
    width:100%;
    padding: 0 30px;
    overflow: auto;
  }
}
</style>
