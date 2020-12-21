<template>
  <div
    v-loading="loading"
    class="addPay"
  >
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <template v-slot:rightBox>
        <el-button
          :size="isPC ? 'small' : 'mini'"
          @click="handleBackClick"
        >
          返回
        </el-button>
      </template>
      <self-form
        ref="SelfForm"
        class="baseInfo"
        :list-query="formData"
        :form-item="formItem"
        :rules="isEdit ? {} : addRules"
        label-width="200px"
        label-position="right"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <template
          slot="driverCode"
        >
          <div>
            <el-select
              v-model="formData.driverCode"
              v-loadmore="loadmore"
              filterable
              clearable
              remote
              :disabled="isEdit"
              reserve-keyword
              :default-first-option="true"
              :remote-method="remoteMethod"
              :loading="driverLoading"
              placeholder="请选择司机"
            >
              <el-option
                v-for="(item,index) in driverOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </template>
      </self-form>
    </SectionContainer>

    <SectionContainer
      v-if="formData.driverCode"
      title="账户信息"
      :md="true"
    >
      <self-form
        label-width="200px"
        :pc-col="24"
        :list-query="formData"
        :form-item="accountItem"
        label-position="right"
      />
    </SectionContainer>

    <SectionContainer
      v-if="canPay"
      title="缴费信息"
      :md="true"
      class="payInfo"
    >
      <template v-slot:rightBox>
        <el-button
          v-if="!isEdit"
          :size="isPC ? 'small' : 'mini'"
          @click="handleAddPay"
        >
          新增缴费
        </el-button>
      </template>
      <template>
        <el-form
          ref="payForm"
          :model="payForm"
          :rules="payForm.rules"
        >
          <el-table
            :data="payForm.tableData"
            class="tableStyle"
            :row-style="{height: '20px'}"
            :cell-style="{padding: '5px 0'}"
            style="width: 100%"
            size="mini"
          >
            <!--show-summary :summary-method="getSummaries" -->
            <el-table-column
              width="180"
              label="缴费金额（元）"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.payAmount'"
                  :rules="payForm.rules.payAmount"
                >
                  <el-input
                    v-model="scope.row.payAmount"
                    type="number"
                    placeholder="请输入缴费金额"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              width="180"
              label="支付方式"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.payModel'"
                  :rules="payForm.rules.payModel"
                >
                  <el-select
                    v-model="scope.row.payModel"
                    clearable
                    placeholder="请输入支付方式"
                  >
                    <el-option
                      v-for="item in payModelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="交易流水号"
              width="200px"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.sno'"
                  :rules="payForm.rules.sno"
                >
                  <el-input
                    v-model="scope.row.sno"
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入完整流水号"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              width="180"
              label="缴费类型"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.payType'"
                  :rules="payForm.rules.payType"
                >
                  <el-select
                    v-model="scope.row.payType"
                    clearable
                    placeholder="请选择缴费类型"
                  >
                    <el-option
                      v-for="item in billTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              width="180"
              label="订单编号"
            >
              <template slot-scope="scope">
                <el-form-item
                  v-if="scope.row.payType === 1 || scope.row.payType === ''"
                  :prop="'tableData.'+scope.$index+'.orderCode'"
                  :rules="payForm.rules.orderCode"
                >
                  <el-select
                    v-model="scope.row.orderCode"
                    clearable
                    placeholder="请选择订单编号"
                  >
                    <el-option
                      v-for="item in orderOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <div v-else-if="scope.row.payType === 0">
                  无
                </div>
              </template>
            </el-table-column>

            <el-table-column
              width="180"
              label="是否开收据"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.existReceipt'"
                  :rules="payForm.rules.existReceipt"
                >
                  <el-select
                    v-model="scope.row.existReceipt"
                    clearable
                    placeholder="请确认是否开收据"
                  >
                    <el-option
                      v-for="item in isReceiptOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="打款日期"
              width="250px"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.'+scope.$index+'.payDate'"
                  :rules="payForm.rules.payDate"
                >
                  <el-date-picker
                    v-model="scope.row.payDate"
                    type="datetime"
                    placeholder="请填写打款日期"
                    value-format="timestamp"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="上传交易凭证"
              width="200px"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-form-item
                  :ref="'uploadItem'+scope.$index"
                  class="uploadItem"
                  :prop="'tableData.'+scope.$index+'.payProof'"
                  :rules="payForm.rules.payProof"
                >
                  <el-upload
                    :ref="'upload'+scope.$index"
                    action="/api/core/v1/upload/uploadOSS/img/true/-1"
                    :headers="myHeaders"
                    class="upload-demo"
                    accept="image/png,image/jpg,image/jpeg"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    :on-change="onExceed"
                    @click.native="upload(scope,scope.$index)"
                  >
                    <el-button
                      size="small"
                    >
                      上传
                    </el-button>
                  </el-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isEdit"
              width="180"
              label="查看交易凭证"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="seePic(scope.row.payProof)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isEdit"
              width="180"
              label="操作"
              align="center"
              header-align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  icon="el-icon-plus"
                  @click="handleAdd(scope.$index, scope.row)"
                /> -->
                <div style="line-height:114px">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </SectionContainer>
    <div class="btnBox">
      <el-button @click="handleBackClick">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSaveClick"
      >
        提交
      </el-button>
    </div>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closePic"
      :url-list="[imageUrl]"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import { deleteUser } from '@/api/users'
import { getDriverNoAndNameList } from '@/api/driver'
import { payCostBillsCreate, payDetail, payCostBillsUpdate, detailByUserId } from '@/api/driver-account'
import { getDealOrdersByDriverIds } from '@/api/driver-cloud'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
import { delayTime } from '@/settings'
import { UserModule } from '@/store/modules/user'
import { GetDictionaryList } from '@/api/common'
 @Component({
   name: 'addPay',
   components: {
     SectionContainer,
     SelfForm,
     ElImageViewer
   }
 })
export default class extends Vue {
  private myHeaders: any = { Authorization: UserModule.token };
  private loading:Boolean = true
  private isEdit:Boolean = false
  private id:string = ''
  private driverLoading:Boolean = false
  private keyWord:String = ''
  private driverOver:Boolean = false
  private showViewer:boolean = false
  private imageUrl:string = ''
  private ReceiptOptions:any = []
  private orderOptions:any[] = []
  private driverOptions:any[] = []
  private driverInfo:any = ''
  private driverPage:any = {
    page: 1,
    limit: 20
  }
  private addRules:any = {
    driverCode: [
      { required: true, message: '请选择司机!', trigger: 'change' }
    ]
  }
  private formData:any = {
    driverCode: '',
    canExtract: '',
    balance: '',
    driverCity: '',
    gmName: '',
    busiType: '',
    busiTypeName: ''
  }
  private formItem: any[] = [
    {
      type: 'driverCode',
      label: '司机姓名(司机编号/手机号)',
      key: 'driverCode',
      slot: true,
      col: 10
    }
  ]
  private otherFormItem:any[] = [
    {
      type: 7,
      key: 'driverCity',
      label: '所在城市'
    },
    {
      type: 7,
      key: 'gmName',
      label: '所属加盟经理'
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线'
    }
  ]
  private accountItem:any[] = [
    {
      type: 7,
      key: 'balance',
      label: '账户总金额'
    },
    {
      type: 7,
      key: 'canExtract',
      label: '可提现金额'
    }
  ]
  private columnIndex:number = 0
  private payForm:any = {
    rules: {
      sno: [
        { required: true, message: '请输入交易流水号', trigger: 'blur' }
      ],
      payDate: [
        { required: true, message: '请填写打款日期', trigger: 'blur' }
      ],
      payAmount: [
        { required: true, message: '请输入缴费金额', trigger: 'blur' },
        { validator: this.validatepayAmount, trigger: 'blur' }
      ],
      payModel: [
        { required: true, message: '请输入支付方式', trigger: 'blur' }
      ],
      payType: [
        { required: true, message: '请输入缴费类型', trigger: 'blur' }
      ],
      payProof: [
        { required: true, message: '请上传交易凭证', trigger: 'change' }
      ],
      orderCode: [
        { required: true, message: '请选择订单编号', trigger: 'change' }
      ],
      existReceipt: [
        { required: true, message: '请确认是否开收据', trigger: 'change' }
      ]
    },
    tableData: [{
      sno: '',
      payAmount: '',
      payType: '',
      payDate: '',
      payModel: '',
      existReceipt: '',
      orderCode: '',
      payProof: ''
    }]
  }
  private isReceiptOptions:any[] = [
    { label: '否', value: 0 },
    { label: '是', value: 1 }
  ] // 请确认是否开收据数组
  private payModelOptions:any = [] // 支付数组
  private billTypeOptions:any = [
    { label: '订单续费', value: 1 }
  ] // 缴费数组
  private picShow:Boolean = false
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  get isWrite() {
    let formArray:any[] = []
    formArray = Object.entries(this.formData).filter((ele:any) => {
      return ele[1] !== ''
    })
    let tableArray:any[] = []
    this.payForm.tableData.map((item:any) => {
      let itemArray = Object.entries(item).filter((ele:any) => {
        return ele[1] !== ''
      })
      tableArray.push(...itemArray)
    })
    return formArray.concat(tableArray)
  }

  get canPay() {
    if (this.formData.driverCode) {
      if (!this.isEdit) {
        if (this.formData.busiType === 0 && this.formData.canExtract >= 0) {
          return false
        } else {
          return true
        }
      } else {
        if (this.formData.busiTypeValue === 0 && this.formData.canExtract >= 0) {
          return false
        } else {
          return true
        }
      }
    } else {
      return false
    }
  }

  @Watch('formData.driverCode')
  private handleDriverChange(val:any) {
    if (!this.isEdit) {
      this.formItem.splice(1, this.formItem.length - 1)
      this.billTypeOptions.splice(1, this.billTypeOptions.length - 1)
      if (val) {
        this.formItem.push(...this.otherFormItem)
        this.getCanExtractMoney(val)
        this.computedInfo(val)
        this.resetTableData()
        this.dealOrder()
      } else {
        this.remoteMethod('')
      }
      if (this.formData.busiType === 1) {
        const item = { label: '无订单充值', value: 0 }
        this.billTypeOptions.push(item)
      }
    } else {
      if (this.formData.busiTypeValue === 1) {
        const item = { label: '无订单充值', value: 0 }
        this.billTypeOptions.push(item)
      }
    }
  }

  async mounted() {
    this.getPayTypeOptions()
    if (this.$route.name === 'payEdit') {
      this.isEdit = true
      this.id = (this.$route.query.id) as string
      await this.getDetail(this.id)
    } else {
      this.getDriverInfoOptions()
    }
  }

  private validatepayAmount(rule:any, value:any, callback:any) {
    if (Number(value) <= 0) {
      callback(new Error('缴费金额必须大于0'))
    } else if (Number(value) > 99999.99) {
      callback(new Error('缴费金额必须小于六位数'))
    } else {
      callback()
    }
  }

  private async getDetail(id:string) {
    try {
      const { data: res } = await payDetail({ id: id })
      if (res.success) {
        this.loading = false
        this.formData = { ...res.data }
        this.formItem.push(...this.otherFormItem)
        this.formData.driverCode = res.data.driverName
        this.formData.busiTypeName = res.data.busiType
        const tableData = [{
          sno: res.data.sno,
          payAmount: res.data.payAmount,
          payType: res.data.payType,
          payDate: new Date(res.data.payDate),
          payModel: String(res.data.payModelValue),
          existReceipt: res.data.existReceipt ? 1 : 0,
          orderCode: res.data.orderCode,
          payProof: res.data.payImageUrl
        }]
        this.payForm.tableData = [...tableData]
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('err:', err)
    } finally {
      this.loading = false
    }
  }

  private async getPayTypeOptions() {
    try {
      const { data: res } = await GetDictionaryList(['pay_type'])
      if (res.success) {
        this.payModelOptions = res.data.pay_type.map((ele:any) => {
          return { label: ele.dictLabel, value: ele.dictValue }
        })
      } else {
        this.$message.warning(res.errMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
  private async dealOrder() {
    try {
      const { data: res } = await getDealOrdersByDriverIds([this.formData.driverCode])
      if (res.success) {
        this.orderOptions = res.data.map((ele:any) => {
          return { label: ele.orderId, value: ele.orderId }
        })
        this.setOrderId()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }

  private setOrderId() {
    if (this.orderOptions.length === 1) {
      this.payForm.tableData.forEach((ele:any) => {
        ele.orderCode = this.orderOptions[0].value
      })
    }
  }

  private resetTableData() {
    this.payForm = {
      ...this.payForm,
      ...{
        tableData: [{
          sno: '',
          payAmount: '',
          payType: '',
          payDate: '',
          payModel: '',
          existReceipt: '',
          orderCode: '',
          payProof: ''
        }]
      }
    }
  }

  private computedInfo(id:string) {
    this.driverOptions.forEach((ele:any) => {
      if (ele.value === id) {
        this.formData = { ...ele.data }
      }
    })
  }

  // 查询对应订单的可提现金额
  private async getCanExtractMoney(driverId:string) {
    try {
      let params = { driverId: driverId }
      let { data: res } = await detailByUserId(params)
      if (res.success) {
        const { balance, canExtract } = res.data
        this.formData = {
          ...this.formData,
          ...{
            balance: balance,
            canExtract: canExtract
          }
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fail:${err}`)
    }
  }

  private loadmore() {
    this.getDriverInfoOptions(this.keyWord)
  }

  private async getDriverInfoOptions(keyWord:any = '') {
    try {
      this.loading = false
      this.keyWord = keyWord
      let params = {
        key: '',
        status: 1
      }
      keyWord !== '' && (params.key = keyWord)
      params = { ...params, ...this.driverPage }
      if (this.driverOver) {
        return
      }
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/wt-driver-account/pay/create'
      })
      if (res.success) {
        if (res.data.length && res.data.length > 0 && res.data.length === this.driverPage.limit) {
          this.driverPage.page++
        } else {
          this.driverOver = true
        }
        let driverInfos = res.data.map(function(item: any) {
          let info = {
            driverCode: item.driverId,
            driverCity: item.workCityName,
            gmName: item.gmName,
            busiType: item.busiType,
            busiTypeName: item.busiTypeName
          }
          return {
            label: `${item.name}(${item.driverId})`,
            value: item.driverId,
            data: info
          }
        })
        this.driverOptions.push(...driverInfos)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false
    }
  }

  private async remoteMethod(query:any) {
    this.keyWord = query
    this.driverLoading = true
    this.driverPage.page = 1
    this.driverOver = false
    this.driverOptions.splice(0, this.driverOptions.length)
    await this.getDriverInfoOptions(this.keyWord)
    this.driverLoading = false
  }

  // private getSummaries(param:any) {
  //   const { columns, data } = param
  //   const sums:Array<string | number> = []
  //   columns.forEach((column:any, index:any) => {
  //     if (index === 0) {
  //       sums[index] = '总价'
  //     } else if (index === 3) {
  //       sums[index] = data.reduce((prev:any, curr:any) => {
  //         const value = Number(curr.payAmount)
  //         if (!isNaN(value)) {
  //           return Number(prev) + value
  //         } else {
  //           return prev
  //         }
  //       }, 0)
  //       if (sums[index] === 0) {
  //         sums[index] = ''
  //       } else {
  //         sums[index] += ' 元'
  //       }
  //     } else {
  //       sums[index] = ''
  //     }
  //   })

  //   return sums
  // }

  private handleAddPay() {
    if (this.payForm.tableData.length >= 10) {
      this.$message.warning('最多填写10条缴费数据')
      return
    }
    const column = {
      sno: '',
      payAmount: '',
      payType: '',
      payDate: '',
      payModel: '',
      existReceipt: '',
      orderCode: '',
      payProof: ''
    }
    this.payForm.tableData.push(column)
    this.setOrderId()
  }

  // private handleAdd(index:number, row:any) {
  //   const column = {
  //     sno: '',
  //     payAmount: '',
  //     payType: '',
  //     payProof: '',
  //     payDate: '',
  //   }
  //   this.payForm.tableData.splice(index + 1, 0, column)
  // }
  private async handleDelete(index:number, row:any) {
    if (this.payForm.tableData.length === 1) {
      this.$message({
        message: '不能再删了，这是最后一条了。',
        type: 'warning'
      })
      return
    }
    await ((this.$refs.payForm) as any).clearValidate()
    this.payForm.tableData.splice(index, 1)
  }
  private upload(value:any, num:number) {
    this.columnIndex = value.$index
  }
  private handleAvatarSuccess(res:any, file:any) {
    if (res.success) {
      this.payForm.tableData[this.columnIndex].payProof = res.data.url
    } else {
      this.$message.error('上传图片错误：' + res)
      this.payForm.tableData[this.columnIndex].payProof = ''
    }
    this.payForm.tableData[this.columnIndex].payProof = res.data.url
  }

  private beforeUpload(file:any) {
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isJPG) {
      this.$message.error('上传头像图片支持JPEG/PNG/JPG!')
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 4MB!')
    }
    return isJPG && isLt2M
  }
  private onExceed(file:any, fileList:any) {
    if (fileList.length > 1) {
      fileList.splice(0, 1)
    }
  }

  private seePic(url:string) {
    this.showViewer = true
    this.imageUrl = url
  }

  private closePic() {
    this.imageUrl = ''
    this.showViewer = false
  }

  private async handlePassClick(valid:boolean) {
    if (!this.canPay) {
      return this.$message.warning('不可以充值')
    }
    await this.handleValidateTableForm()
  }
  private async handleSaveClick() {
    await this.handleValidateForm()
  }

  private handleBackClick() {
    if (this.isWrite.length > 0) {
      this.$confirm('确定要放弃已填写的内容返回上一页吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/driveraccount/payFee'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    } else {
      this.$router.push({
        path: '/driveraccount/payFee'
      })
    }
  }

  /**
   * 提交表单
   */
  private saveData() {
    let params:any = {}
    let tableData = this.payForm.tableData
    tableData.map((ele:any) => {
      if (ele.payType === 0) {
        ele.orderCode = ''
      }
    })
    if (this.isEdit) {
      params = [...tableData][0]
      params.id = Number(this.id)
      params.payDate = new Date(params.payDate).getTime()
      let type = 'edit'
      this.sendData(params, type)
    } else {
      let type = 'create'
      params.payInfos = [...tableData]
      params.driverCode = this.formData.driverCode
      this.sendData(params, type)
    }
  }

  private async sendData(params:any, type:string) {
    try {
      if (type === 'create') {
        const { data: res } = await payCostBillsCreate(params)
        if (res.success) {
          this.$message.success('新建缴费成功')
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else {
        const { data: res } = await payCostBillsUpdate(params)
        if (res.success) {
          this.$message.success('编辑缴费成功')
        } else {
          this.$message.warning(res.errorMsg)
        }
      }
      setTimeout(() => {
        this.$router.push({
          path: '/driveraccount/payFee'
        })
      }, delayTime)
    } catch (err) {
      console.log('err:', err)
    }
  }

  /**
   *校验表单
   */
  private handleValidateForm() {
    ((this.$refs.SelfForm) as any).submitForm()
  }
  private handleValidateTableForm() {
    ((this.$refs['payForm']) as any).validate((valid:any) => {
      if (valid) {
        this.saveData()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.addPay {
  padding: 30px;
  box-sizing: border-box;
  .active {
    color: #649cee;
    cursor: pointer;
  }
  .tableStyle{
    .el-form-item{
      margin-top: 20px;
    }
    .el-form-item__content{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
<style scoped>
.addPay >>> .el-select,
.addPay >>> .el-textarea {
  /* width: 100%; */
  flex: none;
}
/* .addPay .payInfo >>> .el-input__inner {
  border: none;
} */
.addPay .btnBox{
  width: 100%;
 margin: 30px auto;
 text-align: right;
}
.hide >>> .el-upload--picture-card {
  display: none;
}
/* .uploadItem >>> .el-upload{
  display: block;
} */
.baseInfo >>> .el-form-item__content div{
  width: 100%;
}
</style>
