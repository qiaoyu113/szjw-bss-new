<template>
  <div>
    <el-form
      label-width="80px"
      style="width:500px;margin-top:20px;"
    >
      <el-form-item label="手机号">
        <el-input
          ref="call"
          v-model="phone"
        />
      </el-form-item>
    </el-form>
    <makeCall :phone="phone" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MakeCall from '@/components/OutboundDialog/makeCall.vue'
@Component({
  name: 'PhoneDemo',
  components: {
    MakeCall
  }
})
export default class extends Vue {
  private phone:string = ''
}
</script>
<style lang="scss" scoped>

</style>
