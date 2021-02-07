<template>
  <div
    class="PublicClue"
    :class="{
      p15: isPC
    }"
  >
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive>
        <component
          :is="typeObj[clueType]"
          :shortcuts="shortcuts"
        >
          <template v-slot:header>
            <el-radio-group
              v-model="clueType"
              style="margin-bottom: 30px;"
            >
              <el-radio-button
                v-for="item in clueArr"
                :key="item.code"
                :label="item.code"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </template>
        </component>
      </keep-alive>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { PublicCar, PublicShared } from './components/index'
import { SettingsModule } from '@/store/modules/settings'
import {
  today,
  yesterday,
  sevenday,
  thirtyday
} from '@/views/driver-freight/components/date'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'PublicClue'
})
export default class extends Vue {
  private typeObj = {
    '0': PublicCar,
    '1': PublicShared
  };
  private clueType:string| number = 0;
  private clueArr:IState[] = [
    { name: '梧桐专车', code: 0 },
    { name: '梧桐共享', code: 1 },
    { name: '雷鸟供给C', code: 2 },
    { name: '雷鸟租赁C', code: 3 },
    { name: '雷鸟租赁B', code: 4 }
  ]
  private shortcuts = [
    today,
    yesterday,
    sevenday,
    thirtyday
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>
