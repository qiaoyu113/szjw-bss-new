<template>
  <div class="baseInfoForm">
    <span>基本信息</span>
    <SelfForm
      v-if="clueStatus < 2"
      :rules="rulesWT"
      :list-query="queryAndItem.query"
      :form-item="queryAndItem.formItem"
      size="small"
      :pc-col="6"
      @onPass="handlePassClick"
    >
      <div
        slot="hasCar"
        style="display:flex"
      >
        <el-select
          v-model="WTQuery.hasCar"
          class="carBox"
          placeholder="是否有车"
        >
          <el-option
            v-for="item in optionsHasCar"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="WTQuery.carType"
          placeholder="请选择车型"
          :disabled="!WTQuery.hasCar"
        >
          <el-option
            v-for="item in optionsCarType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </SelfForm>
    <span>其他信息</span>
    <SelfForm
      :list-query="otherQuery"
      :form-item="columnsOther"
    >
      123
    </SelfForm>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import {
  getClueWSXDetail,
  getClueLCXDetail,
  getClueLZXDetail
} from '@/api/clue'

import {
  GetCityByCode,
  GetDictionaryList,
  GetDictionaryCity
} from '@/api/common'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'baseInfoForm',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private clueStatus!: number;

  private countryValue = ''; // 如果是多次打开弹框 会缓存区id，如果详情数据返回的区id有问题，默认选中该区
  private optionsHasCar:object[] =[
    { label: '是', value: true },
    { label: '否', value: false }
  ]

  get queryAndItem() {
    let item:IState = {}
    if (this.clueStatus < 2) {
      item.formItem = this.WTItem
      item.query = this.WTQuery
    } else if (this.clueStatus === 3) {
      //
    }
    return item
  }

  get columnsOther() {
    if (this.clueStatus === 2) {
      let newArr = this.otherItem.slice(2)
      return newArr
    } else {
      return this.otherItem
    }
  }

  validateCity = (rule: any, value: any, callback: any) => {
    if (value && value.length === 2) {
      callback()
    } else {
      callback(new Error('请选择期望工作区域'))
    }
  };

  private rulesWT: IState = {
    intentWork: [
      { required: true, message: '请选择期望工作区域', trigger: 'blur' },
      { validator: this.validateCity, trigger: 'blur' }
    ]
  };

  private WTQuery:IState = {
    name: '',
    phone: '',
    hasCar: '',
    carType: '',
    experience: '',
    age: '',
    address: '',
    cityCode: [],
    nowProfession: '',
    statusName: '',
    clueId: '',
    clueTypeName: '',
    followerName: '',
    beforeFollowerName: '',
    cityName: '',
    clueAttributionName: '',
    sourceChannelName: ''
  }
  private WTItem:IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      tagAttrs: {
        placeholder: '请填写司机姓名，例司机姓名+“师傅”',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 7,
      key: 'phone',
      label: '手机号'
    },
    {
      slot: true,
      type: 'hasCar',
      key: 'hasCar',
      label: '是否有车'
    },
    {
      type: 1,
      key: 'experience',
      label: '货运经验',
      tag: { name: '月', type: 'append' },
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '3'
      },
      listeners: {
        input: this.handleValidateExperience
      }
    },
    {
      type: 7,
      key: 'age',
      label: '年龄'
    },
    {
      type: 1,
      key: 'address',
      label: '现住址',
      tagAttrs: {
        type: 'textarea',
        placeholder: '请输入',
        maxlength: '50',
        showWordLimit: true
      },
      class: 'address'
    },
    {
      type: 8,
      key: 'intentWork',
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
      type: 1,
      key: 'nowProfession',
      label: '当前职业',
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 7,
      key: 'statusName',
      label: '状态'
    },
    {
      type: 7,
      key: 'clueId',
      label: '线索ID'
    },
    {
      type: 7,
      key: 'clueTypeName',
      label: '线索类型'
    },
    {
      type: 7,
      key: 'followerName',
      label: '跟进人'
    },
    {
      type: 7,
      key: 'beforeFollowerName',
      label: '前跟进人'
    },
    {
      type: 7,
      key: 'cityName',
      label: '所属城市'
    },
    {
      type: 7,
      key: 'clueAttributionName',
      label: '线索归属'
    },
    {
      type: 7,
      key: 'sourceChannelName',
      label: '渠道'
    }
  ]
  private otherQuery:IState = {
    inviteWord: '',
    interviewWord: '',
    dropMaterials: '',
    landingPage: ''

  }
  private otherItem:IState[] = [
    {
      type: 7,
      key: 'inviteWord',
      label: '邀请语'
    },
    {
      type: 7,
      key: 'interviewWord',
      label: '面试语'
    },
    {
      type: 7,
      key: 'dropMaterials',
      label: '投发物料'
    },
    {
      type: 7,
      key: 'landingPage',
      label: '落地页'
    }
  ]

  // 校验数字-工作经验
  handleValidateExperience(value: string) {
    if (value) {
      let experience: number = Number(value.replace(/[^\d]/g, ''))
      if (experience || experience === 0) {
        this.WTQuery.experience = experience
      } else {
        this.WTQuery.experience = ''
      }
    } else {
      return false
    }
  }
  // 校验数字-年龄
  handleValidateAge(value: string) {
    if (value) {
      let age: number = Number(value.replace(/[^\d]/g, ''))
      if (age || age === 0) {
        this.WTQuery.age = age
      } else {
        this.WTQuery.age = ''
      }
    } else {
      return false
    }
  }

  /**
   * 期望工作区域
   */
  async loadWorkCity(node: any, resolve: any) {
    let params: string[] = []
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
        let arr = res.data.map((item: any) => ({
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

  /**
   * 加载城市
   */
  async loadCityByCode(params: string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
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

  async getDetailApi() {
    try {
      if (Number(this.clueStatus) < 2) {
        let { data: res } = await getClueWSXDetail({ clueId: 'this.clueId' })
        if (res.success) {
          let {
            marketClueWSXDetailBaseInfoVO,
            marketClueWSXDetailFollowInfoVOList,
            marketClueWSXDetailOtherInfoVO,
            marketClueWSXDetailRepeatedInfoVOList
          } = res.data
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else if (Number(this.clueStatus) === 2) {
        let { data: res } = await getClueLCXDetail({ clueId: 'this.clueId' })
        if (res.success) {
          let {
            marketClueLCXDetailBaseInfoVO,
            marketClueLCXDetailFollowInfoVOList,
            marketClueLCXDetailOtherInfoVO,
            marketClueLCXDetailRepeatedInfoVOList
          } = res.data
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else {
        let { data: res } = await getClueLZXDetail({ clueId: 'this.clueId ' })
        if (res.success) {
          let {
            marketClueLZXDetailBaseInfoVO,
            marketClueLZXDetailFollowInfoVOList,
            marketClueLZXDetailOtherInfoVO,
            marketClueLZXDetailRepeatedInfoVOList
          } = res.data
        } else {
          this.$message.warning(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="scss" scoped>

.baseInfoForm ::v-deep .el-form-item{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.baseInfoForm ::v-deep .el-form-item__label{
  text-align: left;
}
.baseInfoForm ::v-deep .el-input {
  display: table;
}

.baseInfoForm ::v-deep .el-col {
  min-height: 100px!important;
}
.baseInfoForm{
  .carBox {
    padding-right: 10px;
    box-sizing: border-box;
    flex:.4;
  }
}

</style>
