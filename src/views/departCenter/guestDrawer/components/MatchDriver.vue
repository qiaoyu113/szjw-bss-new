<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords />
    <h3>司机匹配线路</h3>
    <div class="lineTable">
      <AtableDriver
        ref="tableDriver"
        :list-query="listQuery"
        :is-more="true"
        :op-type="[2,3,4,5]"
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
import CancelTryRun from '../../guestList/components/CancelTryRun.vue'
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
    CancelTryRun,
    CreateTryRun,
    DetailDialog
  }
})
export default class DepartLine extends Vue {
  private tryRunShow:boolean = false
  private rowData:object = {}
  private detailDialog:Boolean = false
  private detailId:string = ''
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
  creatRunHandle(data:any) {
    (this.$refs.tryRunShow as any).showDialog = true
    this.rowData = data
  }
  detailHandle() {
    this.detailDialog = true
  }
  // 获取列表
  async getLists() {
    try {
      setTimeout(() => {
        (this.$refs.tableDriver as any).getLists()
      }, 1000)
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      // this.listLoading = false
      //
    }
  }
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
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
</style>
