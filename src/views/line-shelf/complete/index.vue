<template>
  <div
    class="cpmplate-container"
  >
    <line-layout
      :active.sync="active"
      :dnamic-lable="numImg"
    />
    <div v-if="active-0===0">
      <newLine-table
        :form-item="formItem"
        :columns="columns"
        :page="page"
        @getnum="getLineShelfNumSure"
      />
    </div>

    <div v-if="active-0===1">
      <MoreLineTable
        :form-item="formItem1"
        :columns="columns1"
        :page="page"
        @getnum="getLineShelfNumSure"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineTable, MoreLineTable } from '../components'
import { getFinishedLine, getLineShelfNum } from '@/api/line-shelf'
import SelfTable from '@/components/Base/SelfTable.vue'
  interface IState {
  [key: string]: any;
}
interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}
@Component({
  name: 'Complete',
  components: {
    LineLayout,
    NewLineTable,
    MoreLineTable,
    SelfTable
  }
})
export default class extends Vue {
  private active: string = '0'
  private statusActive: number = 0
  private page: PageObj = {
    page: 1,
    limit: 10,
    total: 120
  };
  mounted() {
    this.getLineShelfNumSure()
  }
private numImg = {
  toBeCheckedNum: 0,
  checkedTodayNum: 0,
  lineShelfNewNum: 0,
  redundantNewNum: 0,
  checkedNum: 0
}
private async getLineShelfNumSure() {
  try {
    const { data } = await getLineShelfNum()
    // console.log(data)
    if (data.success) {
      this.numImg = data.data
    }
  } catch (error) {
    return error
  }
}
  //  新线维护
  private formItem:any[]=[
    {
      type: 1,
      key: 'agentId',
      col: 8,
      label: '待办编号',
      tagAttrs: {
        placeholder: '请输入'
      }
    },
    {
      type: 1,
      key: 'lineName',
      col: 8,
      label: '线路名称',
      tagAttrs: {
        placeholder: '请输入名称/编号'
      }
    },
    {
      type: 2,
      key: 'result',
      col: 8,
      label: '原因',
      tagAttrs: {
        placeholder: '请选择原因'
      },
      options: [
        {
          label: '全部',
          value: 3
        },
        {
          label: '项目策展信息',
          value: 1
        },
        {
          label: '线路基础信息',
          value: 2
        }
      ]
    },
    {
      type: 3,
      key: 'agencyTime',
      label: '待办完成时间',
      col: 12,
      tagAttrs: {
        clearable: true,
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一周',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近三月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, start])
              }
            }
          ]
        }
      }
    },
    {
      slot: true,
      label: '检查状态',
      col: 22,
      type: 'checkStatus'
    },
    {
      slot: true,
      col: 2,
      w: '0px',
      type: 'btn1'

    }

  ]
  //  新线维护表格
  private columns: any[] = [
    {
      key: 'agentId',
      label: '待办编号'
    },
    {
      key: 'lineName',
      label: '线路名称',
      slot: true
    },
    {
      key: 'lineId',
      label: '线路编号'
    },
    {
      key: 'lineSnapshotFlag',
      label: '线路快照',
      slot: true
    },
    {
      key: 'inspectionStatus',
      label: '状态', // 检查状态
      slot: true
    },
    {
      key: 'rejectionReasonsTypeName',
      label: '原因', // 拒绝原因类型名
      slot: true
    },
    {
      key: 'rejectionReasons',
      label: '备注',
      slot: true,
      'width': '82px'
    },
    {
      key: 'updateName',
      label: '操作人'
    },
    {
      key: 'updateDate',
      label: '操作时间'
    },
    {
      key: 'createDate',
      label: '待办生成时间'
    }

  ]

  // 冗余线路盘点
  private formItem1:any[]=[
    {
      type: 1,
      key: 'agentId',
      col: 8,
      label: '待办编号',
      tagAttrs: {
        placeholder: '请输入'
      }
    },
    {
      type: 1,
      key: 'lineName',
      col: 8,
      label: '线路名称',
      tagAttrs: {
        placeholder: '请输入名称/编号'
      }
    },
    {
      type: 3,
      key: 'agencyTime',
      label: '待办完成时间',
      col: 12,
      tagAttrs: {
        clearable: true,
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一周',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近一月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近三月',
              onClick(picker: any) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, start])
              }
            }
          ]
        }
      }
    },
    {
      slot: true,
      label: '检查状态',
      col: 22,
      type: 'checkStatus'
    },
    {
      slot: true,
      col: 2,
      w: '0px',
      type: 'btn1'

    }

  ]

   private columns1: any[] = [
     {
       key: 'agentId',
       label: '待办编号'
     },
     {
       key: 'lineName',
       label: '线路名称',
       slot: true
     },
     {
       key: 'lineId',
       label: '线路编号'
     },
     {
       key: 'agentStatus',
       label: '状态',
       slot: true

     },
     {
       key: 'shelvesReasons',
       label: '原因', // 下架原因
       slot: true,
       'width': '72px'
     },

     {
       key: 'updateName',
       label: '操作人'
     },
     {
       key: 'updateDate',
       label: '操作时间'
     },
     {
       key: 'lineCreateDate',
       label: '线路创造时间'
     },
     {
       key: 'createDate',
       label: '待办生成时间'
     }

   ]

  // 获取新线维护列表

  // 获取冗余线路列表
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 15px;
  background: #fff;

}
</style>
