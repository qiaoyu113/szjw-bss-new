<template>
  <div class="configuration-container p15">
    <self-from
      class="configuration-self-form p15"
      :form-item="ruleFrom"
      :list-query="listQuery"
    >
      <template #lineType>
        <ul>
          <li
            v-for="item in lineType"
            :key="item.id"
            :class="{active: item.id === activeLineType}"
            @click="switchLineType(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </template>
      <template #btnc>
        <el-button type="primary">
          查询
        </el-button>
        <el-button>
          重置
        </el-button>
      </template>
    </self-from>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import SelfFrom from '@/components/Base/SelfForm.vue'
import { getOfficeByType, getOfficeByTypeAndOfficeId } from '@/api/common'

@Component({
  name: 'Configuration',
  components: {
    SelfFrom
  }
})
export default class extends Vue {
  listQuery: any = {}
  lineType: Array<any> = [
    {
      name: '梧桐专车',
      id: 1
    },
    {
      name: '梧桐共享',
      id: 2
    },
    {
      name: '雷鸟车池',
      id: 4
    },
    {
      name: '雷鸟租赁',
      id: 5
    }
  ]
  activeLineType:number = this.lineType[0].id
  private ruleFrom: Array<any> = [
    {
      type: 'lineType',
      slot: true,
      key: 'lineType',
      col: 24
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'driverCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      col: 8,
      label: '司机城市',
      key: 'driverCity'
    },
    {
      type: 'btnc',
      slot: true,
      key: 'btnc',
      col: 8,
      offset: 5
    }
  ]
  private async showWork(node: any, resolve: any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  switchLineType(val:number) {
    this.activeLineType = val
  }
}
</script>

<style lang="scss" scoped>
.configuration-container{
  ul {
    margin: 0;
      padding: 0;
    li{
      list-style: none;

      float: left;
      width: 120px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #eee;
      color: #333;
      user-select:none;
    }
    & li:nth-child(1){
      border-radius: 10px 0 0 10px;
    }
    & li:last-child {
      border-radius: 0 10px 10px 0;

    }
    .active{
      border-color: #1890ff;
      color: #1890ff;
    }
  }
  .configuration-self-form{
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
}
</style>
