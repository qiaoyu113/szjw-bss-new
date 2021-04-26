import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface PhoneState {
  appId:string;
  secret:string;
  status:number;
  originCallNo:string; // 呼入被叫的手机号
  callerProvince:string;
  callerCity:string;
  url:string;
  proxyUrl:string;
  qhbUrl:string;
}

interface IState {
  [key: string]: any;
}

@Module({ dynamic: true, store, name: 'phone' })
class Phone extends VuexModule implements PhoneState {
  public appId = ''
  public secret = ''
  public status = 1
  public originCallNo = ''
  public callerProvince = ''
  public callerCity = ''
  public url = ''
  public proxyUrl = ''
  public qhbUrl = ''

  @Mutation
  private CHANGE_PHONE(payload: IState) {
    for (let key in payload) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        (this as any)[key] = payload[key]
      }
    }
  }

  @Action
  public ChangePhone(payload: IState) {
    this.CHANGE_PHONE(payload)
  }
}

export const PhoneModule = getModule(Phone)
