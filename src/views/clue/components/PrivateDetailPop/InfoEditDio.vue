<template>
  <div class="InfoEditDio">
    <SelfDialog
      :visible.sync="show"
      title="编辑"
      :confirm="confirm"
      width="600px"
      :sumbit-again="submitLoading"
      @closed="handleDialogClosed"
    >
      <!-- // 梧桐 -->
      <SelfForm
        v-if="Number(clueStatus) < 2"
        ref="editFormWt"
        key="editFormWt"
        :rules="rulesWT"
        :list-query="WTQuery"
        :form-item="WTItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
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
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟车池 -->
      <SelfForm
        v-if="Number(clueStatus) === 2"
        ref="editFormBirdCar"
        key="editFormBirdCar"
        :rules="rulesBirdCar"
        :list-query="BirdCarQuery"
        :form-item="BirdCarItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
            <el-select
              v-model="BirdCarQuery.carType"
              placeholder="请选择车型"
              :disabled="!BirdCarQuery.hasCar"
            >
              <el-option
                v-for="item in optionsCarType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟租赁C -->
      <SelfForm
        v-if="Number(clueStatus) === 3"
        ref="editFormBirdC"
        key="editFormBirdC"
        :rules="rulesBirdCar"
        :list-query="BirdCQuery"
        :form-item="BirdCItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
            <el-select
              v-model="BirdCQuery.carType"
              placeholder="请选择车型"
              :disabled="!BirdCQuery.hasCar"
            >
              <el-option
                v-for="item in optionsCarType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟租赁B -->
      <SelfForm
        v-if="Number(clueStatus) === 4"
        ref="editFormBirdB"
        key="editFormBirdB"
        :rules="rulesBirdCar"
        :list-query="BirdBQuery"
        :form-item="BirdBItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      />
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { lock } from '@/utils/index'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetCityByCode, GetDictionaryList, GetDictionaryCity } from '@/api/common'
import { editClue } from '@/api/clue'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'InfoEditDio',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog!: boolean;
  @Prop({ default: '0' }) private clueStatus!: string;
  @Prop({ default: {} }) private baseInfo!: object;
  private demandTypeOptions:object[] = []
  private carOptions:object[] = [
    { label: '金杯', value: 1 },
    { label: '依维柯', value: 10 },
    { label: '4.2米厢货', value: 2 },
    { label: '面包', value: 35 },
    { label: '其他', value: 45 }
  ]
  private submitLoading: boolean = false;
  // 梧桐
  private optionsCarType: object[] = [];

  private WTQuery: IState = {
    name: '',
    phone: '',
    hasCar: true,
    carType: '',
    experience: '',
    age: '',
    nowProfession: '',
    address: '',
    intentWork: []
  };
  private WTItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'hasCar',
      label: '是否有车',
      col: 10,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    {
      slot: true,
      type: 'carType',
      key: 'carType',
      col: 14,
      w: '0',
      class: 'carTypeItem'
    },
    {
      type: 1,
      key: 'experience',
      label: '货运经验',
      col: 24,
      tag: { name: '月', type: 'append' },
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '3'
      },
      listeners: {
        'input': this.handleValidateExperience
      }
    },
    {
      type: 1,
      key: 'age',
      label: '年龄',
      col: 24,
      tag: { name: '岁', type: 'append' },
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '2'
      },
      listeners: {
        'input': this.handleValidateAge
      }
    },
    {
      type: 2,
      key: 'nowProfession',
      label: '当前职业',
      col: 24,
      tagAttrs: {
        placeholder: '请填写'
      },
      option: []
    },
    {
      type: 1,
      key: 'address',
      label: '现住址',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '请输入',
        maxlength: '50',
        showWordLimit: true
      }
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
    }
  ];

  // 雷鸟车池
  private rulesBirdCar: IState = {
    name: [{ required: true, message: '请填写姓名' }]
  };
  private BirdCarQuery: IState = {
    name: '',
    phone: '',
    carType: '',
    demandType: '',
    remark: ''
  };
  private BirdCarItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'demandType',
      label: '需求类型',
      col: 10,
      options: this.demandTypeOptions
    },
    {
      slot: true,
      type: 'carType',
      key: 'carType',
      col: 14,
      w: '0',
      class: 'carTypeItem'
    },
    {
      type: 1,
      key: 'remark',
      label: '备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '50',
        showWordLimit: true
      }
    }
  ];

  // 雷鸟租赁C
  private BirdCQuery: IState = {
    name: '',
    phone: '',
    intentModel: '',
    fancyModel: '',
    remark: ''
  };
  private BirdCItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'intentModel',
      label: '意向车型',
      col: 24,
      options: this.carOptions
    },
    {
      type: 2,
      key: 'fancyModel',
      label: '看中车型',
      col: 24,
      options: this.carOptions
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
  ];

  // 雷鸟租赁B
  private BirdBQuery: IState = {
    name: '',
    phone: '',
    intentModel: [],
    fancyModel: [],
    remark: ''
  };
  private BirdBItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 5,
      key: 'intentModel',
      label: '意向车型',
      col: 24,
      options: this.carOptions
    },
    {
      type: 5,
      key: 'fancyModel',
      label: '看中车型',
      col: 24,
      options: this.carOptions
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
  ];

  get show() {
    return this.showDialog
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  get formStatus() {
    let ref:IState = {}
    switch (Number(this.clueStatus)) {
      case 0:
        ref.form = 'editFormWt'
        ref.query = 'WTQuery'
        break
      case 1:
        ref.form = 'editFormWt'
        ref.query = 'WTQuery'
        break
      case 2:
        ref.form = 'editFormBirdCar'
        ref.query = 'BirdCarQuery'
        break
      case 3:
        ref.form = 'editFormBirdC'
        ref.query = 'BirdCQuery'
        break
      case 4:
        ref.form = 'editFormBirdB'
        ref.query = 'BirdBQuery'
        break
    }
    return ref
  }

  @Watch('showDialog')
  onShowDialog(val:boolean) {
    if (val) {
      if (this.showDialog) { this.setQuerys(this.baseInfo) }
      this.getOptions()
    }
  }

  private setQuerys(value:IState) {
    if (Number(this.clueStatus) < 2) {
      this.WTQuery = { ...this.WTQuery, ...value }
      this.WTQuery.intentWork = [value.expectAddressCity, value.expectAddressCounty]
      if (this.WTQuery.intentWork[1] === '0' && this.countryValue) {
        this.WTQuery.intentWork.pop()
        this.WTQuery.intentWork.push(this.countryValue)
      }
    } else if (Number(this.clueStatus) === 2) {
      this.BirdCarQuery = { ...this.BirdCarQuery, ...value }
    } else if (Number(this.clueStatus) === 3) {
      this.BirdCQuery = { ...this.BirdCQuery, ...value }
    } else {
      this.BirdBQuery = { ...this.BirdBQuery, ...value }
    }
  }

  private countryValue = '' // 如果是多次打开弹框 会缓存区id，如果详情数据返回的区id有问题，默认选中该区

  validateCity = (rule:any, value:any, callback:any) => {
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

   /**
     * 期望工作区域
     */
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

   /**
     * 加载城市
     */
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

   // 获取车型
   async getOptions() {
     try {
       let params = ['Intentional_compartment', 'demand_type']
       let { data: res } = await GetDictionaryList(params)
       if (res.success) {
         let cars = res.data.Intentional_compartment.map(function(item:any) {
           return { label: item.dictLabel, value: +item.dictValue }
         })

         let demandTypeOptions = res.data.demand_type.map((item:any) => {
           return { label: item.dictLabel, value: +item.dictValue }
         })

         this.demandTypeOptions.push(...demandTypeOptions)
         this.optionsCarType.push(...cars)
       } else {
         this.$message.error(res.errorMsg)
       }
     } catch (err) {
       console.log(`get base info fail:${err}`)
     }
   }

   // 校验数字-工作经验
   handleValidateExperience(value:string) {
     if (value) {
       let experience:number = Number(value.replace(/[^\d]/g, ''))
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
   handleValidateAge(value:string) {
     if (value) {
       let age:number = Number(value.replace(/[^\d]/g, ''))
       if (age || age === 0) {
         this.WTQuery.age = age
       } else {
         this.WTQuery.age = ''
       }
     } else {
       return false
     }
   }

   // 弹框确认
   private confirm() {
     (this.$refs[this.formStatus.form] as any).submitForm()
   }

   // 弹窗关闭
   private handleDialogClosed() {
     setTimeout(() => {
       (this.$refs[this.formStatus.form] as any).resetForm();
       (this.$refs[this.formStatus.form] as any).clearValidate()
       this.demandTypeOptions.splice(0, this.demandTypeOptions.length)
       this.optionsCarType.splice(0, this.optionsCarType.length)
     }, 100)
   }
  // 验证通过
  @lock
   private async handlePassClick(this:any, val: boolean) {
     this.editDio(this[(this.formStatus.query)])
   }

  async editDio(val:IState) {
    try {
      if (+this.clueStatus < 2) {
        val.expectAddressCity = val.intentWork[0]
        val.expectAddressCounty = val.intentWork[1]
      } else if (+this.clueStatus === 4) {
        val.intentModel = String(val.intentModel)
        val.fancyModel = String(val.fancyModel)
      }
      let { data: res } = await editClue(val)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '基本信息编辑成功!'
        })
        this.show = false;
        (this.$parent as any).getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="scss" scoped>
.InfoEditDio ::v-deep .carTypeItem .el-form-item__content {
  margin-left: 0 !important;
}
.InfoEditDio ::v-deep .el-input {
  display: table;
}
</style>
