<template>
  <div class="BasicsInfor">
    <el-row
      v-for="(item,index) in formItem"
      :key="index"
      :gutter="20"
    >
      <el-col
        v-for="title in lineInfor"
        :key="title.key"
        :span="6"
      >
        <span class="title">
          <span class="titleLabel"> {{ title.label }} :</span><span> {{ item[title.key] }}</span>

        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script lang = 'ts'>
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
@Component({
  name: 'BasicsInfor'
})
export default class extends Vue {
    @Prop({ default: () => [] }) formItem!:any[]
    @Prop({ default: () => [] }) lineInfor!:any[]
}
</script>

<style lang="scss">
  .BasicsInfor{
     .title {
    font-size: 14px!important;
    display: inline-block!important;
    border: none!important;
    padding: 0 5px!important;
     .titleLabel {
    color: #9e9e9e ;
    padding: 0 12px 0 0;
  }
  }

  }

</style>
