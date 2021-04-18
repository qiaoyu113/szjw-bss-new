<template>
  <div class="set-container">
    <!-- 提示tips -->
    <div class="tips">
      <p>
        打分攻略:
      </p>
      <p>
        1、每次“打分开始”后, 5分钟后参与打分的人可以提交, 再过25分钟后, 停止打分, 打分结束,共计30分钟.
      </p>
      <p>
        2、5-30分钟后,可以查看赋能打分监控,下次“开始打分”后,清空上一次的打分监控.
      </p>
      <p>
        3、打分结束后,可以查看打分的统计,下次“开始打分”后,清空上一次的打分统计
      </p>
      <p>
        4、抽取规则:系统根据选择的抽取比例,从已提交的打分的总人数中,抽取前xx%的人数(省略小数位,只取整数),作为有效的分数
      </p>
    </div>
    <!-- 角色权重配置 -->
    <section-container
      title="角色权重设置"
      :md="true"
    >
      <el-form
        ref="roleRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="城市负责人GMC："
              prop="cityGMC"
            >
              <el-input
                v-model.number="roleForm.cityGMC"
                v-only-number="{min: 1, max: 100, precision: 0}"
                style="width: 200px"
                placeholder="请输入(1-100)"
              >
                <template slot="append">
                  %
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="区域负责人GMR："
              prop="areaGMR"
            >
              <el-input
                v-model.number="roleForm.areaGMR"
                v-only-number="{min: 1, max: 100, precision: 0}"
                style="width: 200px"
                placeholder="请输入(1-100)"
              >
                <template slot="append">
                  %
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="cityPublic"
            >
              <template slot="label">
                城市公共
                <el-tooltip
                  content="城市公共:包含以下角色(平台运营专员、业务助理、异常处理专员、城市HRBP、大区财务BP)"
                  placement="top-start"
                >
                  <el-button
                    icon="el-icon-question"
                  />
                </el-tooltip>
                ：
              </template>
              <el-input
                v-model.number="roleForm.cityPublic"
                v-only-number="{min: 1, max: 100, precision: 0}"
                style="width: 200px"
                placeholder="请输入(1-100)"
              >
                <template slot="append">
                  %
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section-container>
    <!-- 城市公共角色抽取规则 -->
    <section-container
      title="城市公共角色抽取规则"
      :md="true"
    >
      <el-form
        ref="proportionRef"
        :model="proportionForm"
        :rules="proportionRules"
        label-width="140px"
      >
        <el-form-item
          prop="proportion"
        >
          <template slot="label">
            抽取比例
            <el-tooltip
              placement="top-start"
            >
              <div
                slot="content"
                style="text-align: center"
              >
                系统根据选择的抽取比例,从已提交的打分的总人数中,抽取前xx%的人数(省略小数位,只取整数),作为
                <br>
                有效的分数
              </div>
              <el-button
                icon="el-icon-question"
              />
            </el-tooltip>
            ：
          </template>
          <el-input
            v-model.number="proportionForm.proportion"
            v-only-number="{min: 1, max: 100, precision: 0}"
            style="width: 200px"
            placeholder="请输入(1-100)"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </section-container>
    <!-- 按钮 -->
    <el-row :gutter="10">
      <div class="btns">
        <el-button type="primary">
          重置
        </el-button>
        <el-button type="primary">
          保存
        </el-button>
        <el-button
          type="primary"
          @click="markVisible = true"
        >
          开始打分
        </el-button>
      </div>
    </el-row>
    <SelfDialog
      class="markDialog"
      :visible.sync="markVisible"
      title="确认"
      width="40%"
      :cancel-button-text="`取消打分`"
      :confirm-button-text="`确定打分`"
      :before-close="beforeClose"
      :confirm="handleConfirmClick"
      :sumbit-again="submitLoading"
      @cancel="beforeClose"
      @closed="handleClosed"
    >
      <template>
        开始按照以下规则，开始打分吗？
        <p>城市负责人GMC：{{ roleForm.cityGMC }}%</p>
        <p>区域负责人GMR：{{ roleForm.areaGMR }}%</p>
        <p>城市公共：{{ roleForm.cityPublic }}%</p>
        <p>城市公共抽取比例：{{ proportionForm.proportion }}%</p>
      </template>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
@Component({
  name: 'Set',
  components: {
    SectionContainer,
    SelfDialog
  }
})
export default class extends Vue {
  // 自定义校检规则
  private checkProportion = (rule: any, value: any, callback: Function) => {
    let errorText = '请输入1-100之间的整数'
    if (!value) {
      return callback(new Error(errorText))
    }
    if (!Number.isInteger(value)) {
      callback(new Error(errorText))
    } else {
      if (value < 1 || value > 100) {
        callback(new Error(errorText))
      } else {
        callback()
      }
    }
  }
  // 角色权重配置
  private roleForm: any = {
    cityGMC: '',
    areaGMR: '',
    cityPublic: ''
  }
  // 角色权重校检规则
  private roleRules: any = {
    cityGMC: [
      { required: true, message: '请输入1-100之间的整数', trigger: 'blur' }
      // { type: 'number', message: '请输入1-100之间的整数', trigger: 'blur' },
      // { validator: this.checkProportion, trigger: 'blur' }
    ],
    areaGMR: [
      { required: true, message: '请输入1-100之间的整数', trigger: 'blur' }
      // { type: 'number', message: '请输入1-100之间的整数', trigger: 'blur' },
      // { validator: this.checkProportion, trigger: 'blur' }
    ],
    cityPublic: [
      { required: true, message: '请输入1-100之间的整数', trigger: 'blur' }
      // { type: 'number', message: '请输入1-100之间的整数', trigger: 'blur' },
      // { validator: this.checkProportion, trigger: 'blur' }
    ]
  }

  // 城市公共角色抽取规则
  private proportionForm: any = {
    proportion: ''
  }
  // 城市公共角色校检规则
  private proportionRules: any = {
    proportion: [
      { required: true, message: '请输入1-100之间的整数', trigger: 'blur' }
      // { type: 'number', message: '请输入1-100之间的整数', trigger: 'blur' },
      // { validator: this.checkProportion, trigger: 'blur' }
    ]
  }
  // 开始打分弹窗是否可见
  private markVisible: boolean = false
  private markArr: any[] = [
    '城市负责人CMC：',
    '区域负责人GMR：',
    '城市公共：',
    '城市公共抽取比例：'
  ]
  private getMarkArr() {
    return [...this.roleForm, ...this.proportionForm]
  }
}
</script>

<style lang="scss" scoped>
.set-container {
  .tips {
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: 10px;
    p:nth-child(n+1) {
      margin: 0;
      padding: 0;
      line-height: 20px;
    }
  }
  .btns {
    float: right;
    margin: 20px 60px 20px 0;
    .el-button--primary {
      width: 100px;
    }
  }
  .markDialog {
    p {
      color: #e5a4aa;
    }
  }
}
</style>

<style scoped>
  .set-container .SectionContainer >>> .el-button--medium {
    padding: 10px 0;
  }
  .set-container .SectionContainer >>> .el-button {
    border: 0;
  }
  .set-container .SectionContainer >>> .el-button:hover {
    color: #1f2d3d;
    background-color: #FFFFFF;
  }
</style>
