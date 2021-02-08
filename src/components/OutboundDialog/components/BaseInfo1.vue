<template>
  <!-- 司机云线索列表、司机梧桐账户 -->
  <div class="baseInfo1">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template v-slot:nowAddress="scope">
        <div class="wordWrap">
          {{ scope.row.nowAddress | DataIsNull }}
        </div>
      </template>
      <template v-slot:followPerson="scope">
        <template v-if="scope.row.followName || scope.row.followPhone">
          {{ scope.row.followName }} {{ scope.row.followPhone }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
      <template v-slot:prevFollowPerson="scope">
        <template v-if="scope.row.beforeFollowerName || scope.row.beforeFollowerPhone">
          {{ scope.row.beforeFollowerName }} {{ scope.row.beforeFollowerPhone }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetCityByCode, GetDictionaryCity } from '@/api/common'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'BaseInfo1',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private countryValue = '' // 期望工作城市的code
  private listQuery:IState = {};
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '姓名',
      key: 'name'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择'

      },
      label: '是否有车',
      key: 'hasCar',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    },
    {
      type: 7,
      label: '手机号',
      key: 'phone'
    },
    {
      type: 7,
      label: '年龄',
      key: 'age'
    },
    {
      type: 'nowAddress',
      label: '现住址',
      key: 'nowAddress',
      slot: true
    },
    {
      type: 1,
      label: '当前职业',
      key: 'nowProfession'
    },
    {
      type: 8,
      key: 'city',
      label: '期望工作区域:',
      tagAttrs: {
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'householdProvince',
        placeholder: '期望工作区域',
        props: {
          lazy: true,
          lazyLoad: this.loadWorkCity
        }
      }
    },
    {
      type: 7,
      label: '状态',
      key: 'statusName'
    },
    {
      type: 'followPerson',
      label: '跟进人',
      key: 'followPerson',
      slot: true
    },
    {
      type: 7,
      label: '线索编号',
      key: 'marketClueId'
    },
    {
      type: 7,
      label: '渠道',
      key: 'sourceChannelName'
    },
    {
      type: 'prevFollowPerson',
      label: '前跟进人',
      key: 'prevFollowPerson',
      slot: true
    },
    {
      type: 7,
      label: '所属业务线',
      key: 'busiTypeName'
    },
    {
      type: 7,
      label: '所属城市',
      key: 'cityName'
    }
  ]

  // 期望工作区域
  async loadWorkCity(node:any, resolve:any) {
    let params:string[] = []
    if (node.level === 0) {
      let nodes = await this.getOpenCity()
      resolve(nodes)
    } else if (node.level === 1) {
      params = ['100000']
      params.push(node.value.toString().slice(0, 2) + '0000')
      params.push(node.value)
      let nodes = await this.loadCityByCode(params)
      this.countryValue = nodes[1].value
      resolve(nodes)
    }
  }
  // 获取开通城市
  async getOpenCity() {
    try {
      let { data: res } = await GetDictionaryCity()
      if (res.success) {
        let arr = res.data.map((item:any) => ({
          value: item.code,
          label: item.name
        }))
        return arr
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get open city list fail:${err}`)
    } finally {
      //
    }
  }
  // 加载城市
  async loadCityByCode(params:string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item:any) {
          return {
            value: item.code,
            label: item.name,
            leaf: params.length > 1
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
