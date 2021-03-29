<template>
  <div class="changeMessage">
    <SelfDialog
      :visible.sync="show"
      title="信息变更确认"
      :confirm="confirm"
      :sumbit-again="submitLoading"
      :destroy-on-close="true"
      confirm-button-text="确认变更"
      :cancel="cancel"
      @closed="handleClosed"
    >
      <div class="contentBox">
        <p style="fontWeight:bold">
          此手机号用户信息已存在，继续操作将变更信息。请确认是否继续，如需继续，请点击“确认变更”。
        </p>
        <div class="msgBox">
          <div class="oldMsg">
            <span>原信息:</span>
            <ul>
              <template v-for="(item,index) in changeData.oldData">
                <li :key="index">
                  <span>{{ item.name }}：</span>
                  <span>{{ item.value }}</span>
                </li>
              </template>
            </ul>
          </div>
          <i class="el-icon-d-arrow-right" />
          <div class="newMsg">
            <span>现信息:</span>
            <ul>
              <template v-for="(item,index) in changeData.newData">
                <li :key="index">
                  <span>{{ item.name }}：</span>
                  <span>{{ item.value }}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'changeMessage',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  @Prop({ required: true }) private showDialog!: boolean;
  @Prop({ default: () => {} }) private changeData!: object;
  private submitLoading: boolean = false;
  get show() {
    return this.showDialog
  }
  set show(val) {
    this.$emit('update:showDialog', val)
  }

  confirm() {
    this.show = false
    this.$emit('sureChange')
  }

  cancel() {
    this.show = false
  }

  handleClosed() {
  }
}
</script>
<style lang="scss">
.changeMessage {
  .msgBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 30px 50px;
    box-sizing: border-box;
    height: 160px;
    .newMsg,
    .oldMsg {
      position: relative;
      height: 100%;
      ul li {
        line-height: 25px;
      }
    }
    .newMsg > span,
    .oldMsg > span {
      display: block;
      margin-bottom: 10px;
      margin-left: -20px;
    }
  }
}
</style>
