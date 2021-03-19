<template>
  <div class="baseInfoForm">
    <h5>基本信息</h5>
    <SelfForm
      ref="baseInfoForm"
      :rules="rulesWT"
      :list-query="queryAndItem.query"
      :form-item="queryAndItem.formItem"
      size="small"
      :pc-col="6"
      @onPass="handlePassClick"
    >
      <div
        slot="hasCar"
        style="display:flex;width: 100%;"
      >
        <el-select
          v-model="WTQuery.hasCar"
          :class="WTQuery.hasCar !== false ? 'carBox' : ''"
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
          v-if="WTQuery.hasCar === true"
          v-model="WTQuery.carType"
          placeholder="请选择车型"
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
    <h5>其他信息</h5>
    <SelfForm
      :list-query="otherQuery"
      :form-item="columnsOther"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import {
  getClueWSXDetail,
  getClueLCXDetail,
  getClueLZXDetail,
  editClue
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
  @Prop({ default: '' }) private clueId!: string;

  private countryValue = ''; // 如果是多次打开弹框 会缓存区id，如果详情数据返回的区id有问题，默认选中该区
  private optionsHasCar:object[] =[
    { label: '是', value: true },
    { label: '否', value: false }
  ]

  private optionsCarType:object[] =[]
  private demandTypeOptions:object[] =[]
  private carOptions:object[] = [
    { label: '金杯', value: 1 },
    { label: '依维柯', value: 10 },
    { label: '4.2米厢货', value: 2 },
    { label: '面包', value: 48 },
    { label: '其他', value: 45 }
  ];

  get queryAndItem() {
    let item:IState = {}
    if (this.clueStatus < 2) {
      item.formItem = this.WTItem
      item.query = this.WTQuery
    } else if (this.clueStatus === 2) {
      item.formItem = this.BirdCarItem
      item.query = this.BirdCarQuery
    } else if (this.clueStatus === 3) {
      item.formItem = this.BirdItem
      item.query = this.BirdQuery
    } else {
      item.formItem = this.BirdItem
      item.query = this.BirdQuery
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

  get BirdItem() {
    if (this.clueStatus === 3) {
      let arr = JSON.parse(JSON.stringify(this.BirdCarItem))
      arr.splice(2, 3, ...this.BirdCItemSome)
      return arr
    } else {
      let arr = JSON.parse(JSON.stringify(this.BirdCarItem))
      arr.splice(2, 3, ...this.BirdBItemSome)
      return arr
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
        maxlength: '2'
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
        'node-key': 'intentWork',
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

  private BirdCarQuery:IState = {
    name: '',
    phone: '',
    demandType: '',
    carType: '',
    carCityName: '',
    statusName: '',
    clueId: '',
    clueTypeName: '',
    followerName: '',
    beforeFollowerName: '',
    clueAttributionName: '',
    sourceChannelName: '',
    remark: ''
  }
  private BirdCarItem:IState[] = [
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
      type: 2,
      key: 'demandType',
      label: '需求类型',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: this.demandTypeOptions
    },
    {
      type: 2,
      key: 'carType',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: this.optionsCarType
    },
    {
      type: 7,
      key: 'carCityName',
      label: '车辆所在城市'
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
      key: 'clueAttributionName',
      label: '线索归属'
    },
    {
      type: 7,
      key: 'sourceChannelName',
      label: '渠道'
    },
    {
      type: 1,
      key: 'remark',
      label: '备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ]

  private BirdCItemSome:IState[] = [
    {
      type: 2,
      key: 'intentModel',
      label: '意向车型',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: this.carOptions
    },
    {
      type: 2,
      key: 'fancyModel',
      label: '看中车型',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: this.carOptions
    },
    {
      key: 'cityName',
      label: '所在城市',
      type: 7
    }
  ]

  private BirdQuery:IState = {
    intentModel: '',
    fancyModel: '',
    cityName: ''
  }
  private BirdBItemSome:IState[] = [
    {
      type: 5,
      key: 'intentModel',
      label: '意向车型',
      options: this.carOptions
    },
    {
      type: 5,
      key: 'fancyModel',
      label: '看中车型',
      options: this.carOptions
    },
    {
      key: 'cityName',
      label: '所在城市',
      type: 7
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
  // async loadWorkCity(node: any, resolve: any) {
  //   let params: string[] = []
  //   console.log(node)
  //   if (node.level === 0) {
  //     let nodes = await this.getOpenCity()
  //     console.log('city:', nodes)
  //     resolve(nodes)
  //   } else if (node.level === 1) {
  //     params = ['100000']
  //     params.push(node.value.toString().slice(0, 2) + '0000')
  //     params.push(node.value)
  //     let nodes = await this.loadCityByCode(params)
  //     this.countryValue = nodes[1].value
  //     console.log('city1:', nodes)
  //     resolve(nodes)
  //   }
  // }
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

  // 获取车型
  async getOptions() {
    try {
      let params = ['Intentional_compartment', 'demand_type']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item: any) {
          return { label: item.dictLabel, value: +item.dictValue }
        })

        let demandTypeOptions = res.data.demand_type.map((item: any) => {
          return { label: item.dictLabel, value: +item.dictValue }
        })

        this.optionsCarType.push(...cars)
        this.demandTypeOptions.push(...demandTypeOptions)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  private setQuerys(value: IState) {
    if (this.clueStatus < 2) {
      this.WTQuery = { ...this.WTQuery, ...value }
      this.WTQuery.intentWork = [
        String(value.expectAddressCity),
        String(value.expectAddressCounty)
      ]
      debugger
      if (this.WTQuery.intentWork[1] === '0' && this.countryValue) {
        this.WTQuery.intentWork.pop()
        this.WTQuery.intentWork.push(this.countryValue)
      }
    } else if (this.clueStatus === 2) {
      this.BirdCarQuery = { ...this.BirdCarQuery, ...value }
    } else if (this.clueStatus === 3) {
      this.BirdQuery = { ...this.BirdQuery, ...value }
    } else {
      if (value.intentModel) {
        value.intentModel = (value.intentModel).split(',').map((ele:any) => {
          return +ele
        })
      } else {
        value.intentModel = []
      }
      if (value.fancyModel) {
        value.fancyModel = value.fancyModel.split(',').map((ele:any) => {
          return +ele
        })
      } else {
        value.fancyModel = []
      }
      this.BirdQuery = { ...this.BirdQuery, ...value }
    }
  }

  // 详情获取
  async getDetailApi() {
    try {
      if (Number(this.clueStatus) < 2) {
        let { data: res } = await getClueWSXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueWSXDetailBaseInfoVO,
            marketClueWSXDetailOtherInfoVO
          } = res.data
          this.setQuerys(marketClueWSXDetailBaseInfoVO)
          this.otherQuery = marketClueWSXDetailOtherInfoVO
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else if (Number(this.clueStatus) === 2) {
        let { data: res } = await getClueLCXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueLCXDetailBaseInfoVO,
            marketClueLCXDetailOtherInfoVO
          } = res.data
          this.setQuerys(marketClueLCXDetailBaseInfoVO)
          this.otherQuery = marketClueLCXDetailOtherInfoVO
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else {
        let { data: res } = await getClueLZXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueLZXDetailBaseInfoVO,
            marketClueLZXDetailOtherInfoVO
          } = res.data
          this.setQuerys(marketClueLZXDetailBaseInfoVO)
          this.otherQuery = marketClueLZXDetailOtherInfoVO
        } else {
          this.$message.warning(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 表单提交
  handlePassClick(val: boolean) {
    this.$emit('basePass', val)
  }

  // 接口发送
  async sendBase() {
    try {
      let val = this.queryAndItem.query
      if (this.clueStatus < 2) {
        val.expectAddressCity = val.intentWork[0]
        val.expectAddressCounty = val.intentWork[1]
      } else if (+this.clueStatus === 4) {
        val.intentModel = String(val.intentModel)
        val.fancyModel = String(val.fancyModel)
      }
      let { data: res } = await editClue(val)
      if (res.success) {
        this.$emit('success', true)
        return Promise.resolve(true)
      } else {
        console.log('fail', res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  submitsForm() {
    (this.$refs['baseInfoForm'] as any).submitForm()
  }

  mounted() {
    this.$nextTick(() => {
      this.$on('show', (val:boolean) => {
        if (val) {
          this.getOptions()
          this.getDetailApi()
        } else {
          (this.$refs['baseInfoForm'] as any).resetForm()
          setTimeout(() => {
            (this.$refs['baseInfoForm'] as any).clearValidate()
          }, 10)
          this.optionsCarType.splice(0, this.optionsCarType.length)
        }
      })
    })
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
.baseInfoForm ::v-deep .address{
  margin-bottom: 0;
}
.baseInfoForm{
  .carBox {
    padding-right: 10px;
    box-sizing: border-box;
    flex:.4;
  }
  h5{
    border-bottom: 1px solid lightgrey;
    margin: 0;
    line-height: 25px;
    padding-left: 10px;
    box-sizing: border-box;
  }
}

</style>
