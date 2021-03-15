<template>
  <div
    v-loading="listLoading"
    class="createCar"
    :class="{
      p15: isPC
    }"
  >
    <!-- 基础信息 -->
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <self-form
        :list-query="queryInfo.baseInfo"
        :form-item="queryItem.baseItem"
        :rules="rule.baseRule"
        size="small"
        label-width="100px"
        :pc-col="8"
      />
    </SectionContainer>
    <!-- 车主信息 -->
    <SectionContainer
      title="车主信息"
      :md="true"
    >
      <self-form
        :list-query="queryInfo.ownerInfo"
        :form-item="queryItem.ownerItem"
        :rules="rule.ownerRule"
        size="small"
        label-width="100px"
        :pc-col="8"
      />
    </SectionContainer>
    <!-- 销售信息 -->
    <SectionContainer
      v-if="queryInfo.baseInfo.leaseType !== ''"
      title="销售信息"
      :md="true"
    >
      <template>
        <el-form
          ref="sellData"
          class="tableBox"
          :model="queryInfo.salesInfo"
          :rules="queryInfo.salesInfo.rules"
        >
          <div>
            <el-table
              :data="queryInfo.salesInfo.sellData"
              class="tableStyle"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                prop="leaseType"
                width="180"
                label="租售类型"
              />
              <el-table-column
                width="200"
                label="车主意向售价"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sellData.'+scope.$index+'.money'"
                    :rules="queryInfo.salesInfo.rules.money"
                  >
                    <el-input
                      v-model.trim="scope.row.money"
                      v-only-number="{min: 0, max: 999999.99, precision: 2}"
                      type="number"
                      placeholder="请输入意向售价"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div>
            <el-table
              :data="queryInfo.salesInfo.leaseData"
              class="tableStyle"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '5px 0'}"
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                prop="leaseType"
                width="180"
                label="租售类型"
              />
              <el-table-column
                width="200"
                label="车主意向租金(元/月)"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sellData.'+scope.$index+'.leasemoney'"
                    :rules="queryInfo.salesInfo.rules.leasemoney"
                  >
                    <el-input
                      v-model.trim="scope.row.leasemoney"
                      v-only-number="{min: 0, max: 999999.99, precision: 2}"
                      type="number"
                      placeholder="请输入意向售价"
                    />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column
                width="200"
                label="季租租金(元/月)"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sellData.'+scope.$index+'.quartermoney'"
                    :rules="queryInfo.salesInfo.rules.quartermoney"
                  >
                    <el-input
                      v-model.trim="scope.row.quartermoney"
                      v-only-number="{min: 0, max: 999999.99, precision: 2}"
                      type="number"
                      placeholder="请输入意向售价"
                    />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column
                width="200"
                label="半年租租金(元/月)"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sellData.'+scope.$index+'.helfyearmoney'"
                    :rules="queryInfo.salesInfo.rules.helfyearmoney"
                  >
                    <el-input
                      v-model.trim="scope.row.helfyearmoney"
                      v-only-number="{min: 0, max: 999999.99, precision: 2}"
                      type="number"
                      placeholder="请输入意向售价"
                    />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column
                width="200"
                label="年租租金(元/月)"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'sellData.'+scope.$index+'.yearmoney'"
                    :rules="queryInfo.salesInfo.rules.yearmoney"
                  >
                    <el-input
                      v-model.trim="scope.row.yearmoney"
                      v-only-number="{min: 0, max: 999999.99, precision: 2}"
                      type="number"
                      placeholder="请输入意向售价"
                    />
                  </el-form-item>

                  <el-table-column
                    width="200"
                    label="可接受最短租期(月)"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'sellData.'+scope.$index+'.littermoney'"
                        :rules="queryInfo.salesInfo.rules.littermoney"
                      >
                        <el-input
                          v-model.trim="scope.row.littermoney"
                          v-only-number="{min: 0, max: 999999.99, precision: 2}"
                          type="number"
                          placeholder="请输入意向售价"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </template>
    </SectionContainer>
    <!-- 图文描述 -->
    <SectionContainer
      title="图文描述"
      :md="true"
    >
      <self-form
        :list-query="queryInfo.picInfo"
        :form-item="queryItem.picItem"
        :rules="rule.picRule"
        size="small"
        label-width="100px"
        :pc-col="24"
        class="picForm"
      >
        <template slot="carPic">
          <div
            v-for="index in 3"
            :key="index"
          >
            <el-upload
              :class="'avatar-uploader'+[index - 1]"
              class="avatar-uploader"
              :headers="myHeaders"
              action="/api/core/v1/upload/uploadOSS/img/true/-1"
              :show-file-list="false"
              :on-success="handleAvatarSuccess(index - 1)"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="queryInfo.picInfo.carPic[index - 1]"
                :src="queryInfo.picInfo.carPic[index - 1]"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </div>
          <div>
            <el-upload
              ref="otherUp"
              class="avatar-uploader"
              :headers="myHeaders"
              action="/api/core/v1/upload/uploadOSS/img/true/-1"
              :on-success="handleAvatarSuccess(3)"
              :before-upload="beforeAvatarUpload"
              :file-list="picList"
              list-type="picture-card"
              :limit="6"
            >
              <i
                slot="default"
                class="el-icon-plus avatar-uploader-icon"
              />
              <div
                slot="file"
                slot-scope="{file}"
              >
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handleAvatarSuccess(3)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
        </template>
        <template slot="carText">
          <p class="picText">
            车辆图片，必填，支持JPG、JPEG、PNG格式，最少传3张，最多可传9张。标准：右前45度、右后45度带车牌、驾驶室车辆。照片大小不能超过5MB，建议图片尺寸比例1:1。
          </p>
        </template>
        <template slot="videoText">
          <p class="picText">
            选填，一个20s以内，大小不超过20M
          </p>
        </template>
        <template slot="drivingLicense">
          <el-upload
            v-for="index in 2"
            :key="index"
            class="avatar-uploader"
            :class="'drivingLicenseUploader'+[index - 1] "
            :headers="myHeaders"
            action="/api/core/v1/upload/uploadOSS/img/true/-1"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess(index - 1,'drivingLicense')"
          >
            <img
              v-if="queryInfo.picInfo.drivingLicense[index - 1]"
              :src="queryInfo.picInfo.drivingLicense[index - 1]"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </template>
      </self-form>
    </SectionContainer>
    <!-- 拓展信息 -->
    <SectionContainer
      title="拓展信息"
      :md="true"
    >
      <self-form
        :list-query="queryInfo.expandInfo"
        :form-item="queryItem.expandItem"
        :rules="rule.expandRule"
        size="small"
        label-width="100px"
        :pc-col="6"
      >
        <template slot="giveMoney">
          <div>
            <el-checkbox v-model="queryInfo.expandInfo.canGive" />
            <el-input
              v-if="queryInfo.expandInfo.canGive"
              v-model="queryInfo.expandInfo.giveMoney"
              placeholder="请输入内容"
            />
          </div>
        </template>
      </self-form>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { UserModule } from '@/store/modules/user'
import { delayTime } from '@/settings'
import {
  HandlePages,
  lock,
  parseTime,
  showCityGroupPerson,
  showWork,
  DataIsNull
} from '@/utils/index'
import { exportFileTip } from '@/utils/exportTip'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'createCar',
  components: {
    SelfForm,
    SelfTable,
    SelfDialog,
    SectionContainer
  }
})
export default class extends Vue {
  private myHeaders: any = { Authorization: UserModule.token };
  private picList: object[] = [];
  clickUp() {
    console.log('up');
    (this.$refs.otherUp as any).submit()
  }
  handleAvatarSuccess(index: number, type ?:string) {
    let that = this
    return function(this: any, pres: any, file: any, fileList: any) {
      if (type) {
        that.$nextTick(() => {
          (that.queryInfo as any).picInfo.drivingLicense.splice(
            index,
            1,
            URL.createObjectURL(file.raw)
          )
        })
      } else {
        if (index < 3) {
          that.$nextTick(() => {
            (that.queryInfo as any).picInfo.carPic.splice(
              index,
              1,
              URL.createObjectURL(file.raw)
            )
          })
        } else {
          setTimeout(() => {
            that.picList = fileList
          }, 400)
        }
      }
    }
  }
  beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJPG) {
      this.$message.error('上传头像图片只能是 JPG 格式!')
    }
    if (!isLt5M) {
      this.$message.error('上传头像图片大小不能超过 5MB!')
    }
    return isJPG && isLt5M
  }

  handleRemove(file: any) {
    let id = file.uid
    let arr = this.picList.filter((ele: any) => {
      return id !== ele.uid
    })
    this.picList.splice(0, this.picList.length)
    this.picList.push(...arr)
  }

  private disabled: boolean = false;
  private leaseOptions: object[] = [
    { label: '出租', value: 0 },
    { label: '出售', value: 1 },
    { label: '出租出售', value: 2 }
  ];
  private carCityOptions: object[] = [];
  private brandOptions: object[] = [];
  private carTypeOptions: object[] = [];
  private carKindTypeOptions: object[] = [
    { label: '油车', value: 0 },
    { label: '电车', value: 1 }
  ];
  private carsTypeOptions: object[] = [
    { label: '个人', value: 0 },
    { label: '公司', value: 1 }
  ];
  private carNatureOptions: object[] = [
    { label: '运营', value: 0 },
    { label: '非运营', value: 1 }
  ];

  // 基本信息
  private queryInfo: object = {
    baseInfo: {
      leaseType: '', // 租赁类型
      carCity: '', // 车辆所在城市
      brand: '', // 品牌
      carType: '', // 车型
      carKindType: '', // 车辆类型
      widthCar: 0, // 箱体宽度
      horsepower: 0, // 马力
      engineModel: '', // 发动机型号
      plateNo: '', // 车牌号
      saveCity: '', // 注册城市  二级联动
      saveDate: '', // 首次登记日期
      mileage: '' // 里程（公里）
    },
    ownerInfo: {
      carsname: '',
      carsphone: '',
      carsType: 0
    },
    salesInfo: {
      rules: {
        money: [
          { required: true, message: '请输入交易流水号', trigger: 'blur' }
        ]
      },
      sellData: [
        {
          leaseType: 0,
          money: 0
        }
      ],
      leaseData: [
        {
          leaseType: 0,
          leasemoney: 0,
          quartermoney: 0,
          helfyearmoney: 0,
          yearmoney: 0,
          littermoney: 0
        }
      ]
    },
    picInfo: {
      carPic: ['', '', ''], // 车辆图片
      carVideo: '', // 车辆信息
      drivingLicense: ['', ''], // 行驶证照片
      carRemark: '' // 车况说明
    },
    expandInfo: {
      carNature: '', // 车辆性质
      productMoney: '', // 商业保险额
      loans: '', // 贷款
      subordinate: '', // 挂靠
      pass: '', // 通行证
      weiban: '', // 尾板
      jizu: '', // 急租
      jishou: '', // 急售
      canGive: '', // 缴纳意向金
      giveMoney: '' // 意向金额
    }
  };

  private queryItem: object = {
    baseItem: [
      {
        type: 2,
        listeners: {
          change: () => {}
        },
        options: this.leaseOptions,
        label: '租赁类型',
        key: 'leaseType'
      },
      {
        type: 2,
        options: this.carCityOptions,
        label: '车辆所在城市',
        key: 'carCity'
      },
      {
        type: 2,
        options: this.brandOptions,
        label: '品牌',
        key: 'brand'
      },
      {
        type: 2,
        options: this.carTypeOptions,
        label: '车型',
        key: 'carType'
      },
      {
        type: 4,
        options: this.carKindTypeOptions,
        label: '车辆类型',
        key: 'carKindType'
      },
      {
        type: 1,
        label: '箱体宽度',
        key: 'widthCar',
        fix: { type: 'append', value: '米' }
      },
      {
        type: 1,
        label: '马力',
        key: 'horsepower',
        fix: { type: 'append', value: '匹' }
      },
      {
        type: 1,
        label: '发动机型号',
        key: 'engineModel',
        tagAttrs: {
          placeholder: '请输入',
          clearable: true,
          maxlength: 20
        }
      },
      {
        type: 1,
        label: '车牌号',
        key: 'plateNo'
      },
      {
        type: 2,
        options: this.carTypeOptions,
        label: '注册城市',
        key: 'saveCity'
      },
      {
        type: 3,
        label: '首次登记日期',
        key: 'saveDate'
      },
      {
        type: 1,
        label: '里程',
        key: 'mileage',
        fix: { type: 'append', value: '公里' }
      }
    ],
    ownerItem: [
      {
        type: 1,
        label: '车主姓名',
        key: 'carname',
        tagAttrs: {
          clearable: true,
          maxlength: 10,
          placeholder: '请输入'
        }
      },
      {
        type: 1,
        label: '车主手机号',
        key: 'carphone',
        tagAttrs: {
          clearable: true,
          maxlength: 11,
          placeholder: '请输入'
        }
      },
      {
        type: 4,
        options: this.carsTypeOptions,
        label: '车主类型',
        key: 'carsType'
      }
    ],
    picItem: [
      {
        type: 'carPic',
        slot: true,
        label: '车辆图片'
      },
      {
        type: 'carText',
        slot: true
      },
      {
        type: 'carVideo',
        slot: true,
        label: '车辆信息'
      },
      {
        type: 'videoText',
        slot: true
      },
      {
        type: 'drivingLicense',
        slot: true,
        label: '行驶证照片'
      },
      {
        type: 1,
        label: '车况说明',
        key: 'carRemark',
        tagAttrs: {
          type: 'textarea',
          placeholder: '了解到更多的车况信息都可以记录在这里',
          maxlength: '150',
          'show-word-limit': true
        }
      }
    ],
    expandItem: [
      {
        type: 4,
        options: this.carNatureOptions,
        label: '车辆性质',
        key: 'carNature'
      },
      {
        type: 1,
        label: '商业保险额',
        key: 'productMoney',
        fix: { type: 'append', value: '万元' }
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '贷款',
        key: 'loans'
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '挂靠',
        key: 'subordinate'
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '通行证',
        key: 'pass'
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '尾板',
        key: 'weiban'
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '急租',
        key: 'jizu'
      },
      {
        type: 5,
        options: [{ label: '', value: 0 }],
        label: '急售',
        key: 'jishou'
      },
      {
        type: 'giveMoney',
        slot: true,
        label: '缴纳意向金'
      }
    ]
  };
  private rule: IState = {
    baseRule: {
      contactSituation: [
        { required: true, message: '请选择联系情况', trigger: 'change' }
      ]
    },
    ownerRule: {
      contactSituation: [
        { required: true, message: '请选择联系情况', trigger: 'change' }
      ]
    },
    picRule: {},
    expandRule: {}
  };

  private columns: object[] = [
    {
      key: 'leaseType',
      label: '租售类型',
      width: '150'
    },
    {
      key: 'money',
      label: '车主意向售价',
      width: '200'
    }
  ];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    let otherHeight = 400
    return (
      document.body.offsetHeight - otherHeight ||
      document.documentElement.offsetHeight - otherHeight
    )
  }
  times: number = 10;
  private listLoading: boolean = false;
  init() {}
  activated() {
    this.init()
  }
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.createCar {
  .tableBox {
    .picText{
      margin: 0;
      padding: 0;
    }
  }
}
</style>
<style scoped  lang="scss">
.createCar ::v-deep .el-input {
  display: table;
}
.createCar
  .tableBox
  ::v-deep
  .el-table__header-wrapper
  .has-gutter
  :not(:first-child)::before {
  content: "*";
  color: red;
  margin-right: 5px;
  position: absolute;
}
.createCar ::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.createCar ::v-deep .el-upload--picture-card {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 100px;
  text-align: center;
}
.createCar ::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
}
.createCar .picForm ::v-deep .el-form div:nth-child(-n+4) .el-form-item {
  margin-bottom: 0;
}
.createCar {
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 100px;
    text-align: center;
    background-color: #fbfdff;
  }
  .avatar-uploader-icon::after {
    content: "上传图片";
    display: inline-block;
    position: absolute;
    left: 32px;
    top: 30px;
    font-size: 14px;
  }
  .avatar,
  .el-upload--picture-card {
    width: 120px;
    height: 120px;
    display: block;
  }
  .avatar-uploader {
    position: relative;
    margin-right: 10px;
  }
  .avatar-uploader0::before {
    content: "* 右前45度";
    color: white;
    display: block;
    line-height: 20px;
    width: 100%;
    position: absolute;
    text-align: center;
    background-color: red;
    opacity: 0.8;
    z-index: 99;
  }
  .avatar-uploader1::before {
    content: "右后45度带车牌";
    color: white;
    display: block;
    line-height: 20px;
    width: 100%;
    position: absolute;
    text-align: center;
    background-color: lightgray;
    opacity: 0.8;
    z-index: 99;
  }
  .avatar-uploader2::before {
    content: "驾驶室";
    color: white;
    display: block;
    line-height: 20px;
    width: 100%;
    position: absolute;
    text-align: center;
    background-color: lightgray;
    opacity: 0.8;
    z-index: 99;
  }
  .drivingLicenseUploader0::before{
    content: "正面";
    color: white;
    display: block;
    line-height: 20px;
    width: 100%;
    position: absolute;
    text-align: center;
    background-color: lightgray;
    opacity: 0.8;
    z-index: 99;
  }
  .drivingLicenseUploader1::before{
    content: "背面";
    color: white;
    display: block;
    line-height: 20px;
    width: 100%;
    position: absolute;
    text-align: center;
    background-color: lightgray;
    opacity: 0.8;
    z-index: 99;
  }
}
</style>
