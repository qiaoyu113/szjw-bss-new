<template>
  <div class="callLog1">
    <h4>通话操作日志</h4>
    <self-table
      :indexes="true"
      :index="false"
      :is-p30="false"
      :operation-list="[]"
      :table-data="tableData"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:callStatus="{row}">
        {{ row.callStatus === 0 ? '未接通' :row.callStatus === 1 ? '接通':'暂无数据' }}
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { GetListByBusinessId } from '@/api/clue'
import { HandlePages } from '@/utils/index'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CallLog',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: '' }) businessId!:string|number
  private tableData:IState[] = [];
  private columns:IState[] = [
    {
      key: 'inviteName',
      label: '拨打人',
      'width': '100px'
    },
    {
      key: 'callStatus',
      label: '拨打状态',
      'width': '100px',
      slot: true
    },
    {
      key: 'callDuration1',
      label: '拨打时长',
      'width': '100px'
    },
    {
      key: 'beginTime',
      label: '接通时间',
      'width': '140px'
    },
    {
      key: 'endTime',
      label: '挂断时间',
      'width': '140px'
    },
    {
      key: 'recordFileAddress',
      label: '通话录音文件',
      'width': '240px'
    }
  ];
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 20,
    total: 0
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  @Watch('businessId', { immediate: true })
  handleBusinessIdChange() {
    this.getLists()
  }
  // 获取列表
  async getLists() {
    try {
      let params:IState = {
        businessId: this.businessId,
        page: this.page.page,
        limit: this.page.limit
      }
      let { data: res } = await GetListByBusinessId(params)
      if (res.success) {
        this.tableData = res.data.map((item:IState) => {
          item.callDuration1 = this.parseTime(+item.callDuration)
          return item
        })
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get log lists fail:${err}`)
    } finally {
      //
    }
  }
  parseTime(time:number) {
    if (parseInt(String(time), 10) !== time) {
      return ''
    } else {
      let str:string = ''
      if (time > 86400) {
        str = `${parseInt(String(time / 86400))}天`
        time = parseInt(String(time % 86400))
      }
      if (time > 3600) {
        str += `${parseInt(String(time / 3600))}小时`
        time = parseInt(String(time % 3600))
      }
      if (time > 60) {
        str += `${parseInt(String(time / 60))}分钟`
        time = parseInt(String(time % 60))
      }
      if (time > 0) {
        str += `${parseInt(String(time))}秒`
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
  .callLog1 {
    padding: 30px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
</style>
