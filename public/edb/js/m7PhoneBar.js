senvenProvide("moorCall.Phone"),sevenDeclare("moorCall.Phone",null,{m7MonitorServiceNum:[],m7MonitorQueues:[],m7AccountCall:null,m7MonitorPeers:[],m7NormalRinging:null,m7ConsultationRinging:null,m7ListenLink:null,m7PeerState:null,m7Invalid:null,m7Hold:null,m7Base:null,m7InnerRing:null,m7ConsultationLink:null,m7InnerLink:null,m7InnerRinging:null,m7DialoutLink:null,m7ThreeWayCallLink:null,m7NormalLink:null,m7Abate:null,m7ListenRing:null,m7NormalRing:null,callObject:{},m7IsWaitingEvent:!1,m7CurentChannel:null,m7Destroyed:!1,m7OtherChannel:null,m7IsSetbusy:!1,m7BusyType:"0",m7CallId:null,m7IsLooter:!1,m7IccCount:0,m7IsInvestigatting:!1,dialoutData:null,m7Handle:[],m7IsRing:!1,m7IsCallingOut:!1,constructor:function(o){var e=this.register("EvtAutoBusyTime",this,"m7AutoBusyTimeChanged");this.m7Handle.push(e),this.m7InitConfig(o),this._evtXhr=moor._xhrObj(),this.m7WaitEvent()},m7InitConfig:function(o){for(var e in o)this[e]=o[e]},m7stopEvent:function(){this._evtXhr&&(this._evtXhr.abort(),this._evtXhr=null)},destroy:function(o){if(!this.m7Destroyed){for(var e in this.m7Handle)this.m7Noregister(this.m7Handle[e]);this.m7stopEvent(),this.m7exit(this.loginName,o),this.m7Destroyed=!0}},m7RemoteRing:function(o,e){this._outboundId=o},register:function(o,e,n){return senvenMSubscribe(o,e,n)},m7Register:function(o){},m7exit:function(o,e){var n=this;o=o||n.loginName;var t="./login.html";null==e&&(e=!0);n={Command:"Action",Action:"Logoff",Account:n.accountId,SessionID:n.uniqueId,User:n.userId,PBX:n.pbx_in_ip,ActionID:"Logoff"+Math.random(),QueueRemove:e},e=this.proxy_url;m7$.ajax({url:e,data:{json:JSON.stringify(n)},jsonp:"callbackName",async:!0,dataType:"jsonp",timeout:15e3,success:function(o,e){window.userLogin=!1,window.webPhone&&window.webPhone.destroy(),window.location=t},error:function(o,e){window.location=t}})},m7pick:function(o){console.debug("签入座席"+o);var n=this,e=n.m7MonitorPeers[o];null!=e&&null!=e.localNo&&""!=e.localNo?this.m7SendAction("SignIn",{User:o},function(o,e){o.Succeed?moorCall.moortools.m7ShowSuccess("座席签入成功"):o.Expired&&n.m7Relogin()}):moorCall.moortools.error("不能对没有直线号码的座席做签入操作")},m7Noregister:function(o){sevenMUsubscribe(o)},m7eventHandler:function(o){var e,n="";try{var t=this;o.forEach(function(o){n=o,null==t.m7Base&&(t.m7Base=new moorCall.stateElement.base(t)),t.m7Base.m7ChooiceState(o)})}catch(o){o&&o.stack&&(e=moorCall.recordError.getCurrentTime(),e={error:o,errorTime:e,flag:"pageError",errorItem:n},moorCall.recordError.dataHandle(e)),console.dir(o)}},m7WaitEvent:function(){var r,o,e;this.m7IsWaitingEvent||this.uniqueId&&this.userId&&null!=this._evtXhr&&(this.m7IsWaitingEvent=!0,o=(r=this).proxy_url,e={Command:"Action",Action:"GetState",SessionID:this.uniqueId,ActionID:"GetState"+Math.random(),User:this.userId},m7$.ajax({url:o,data:{json:JSON.stringify(e)},jsonp:"callbackName",async:!0,dataType:"jsonp",timeout:15e3,success:function(o,e){if(moorCall.recordError.sendActionToPbx(),r.m7IccCount=0,r.display(""),o){var n=o,o=(o=n.Response)||n;if(!o.Succeed||o.HasEvent){if(!o.Succeed){if(o.Expired){var t=moorCall.recordError.getCurrentTime(),t={eventJson:"GetState",catchRecord:o.Message,errorTime:t};return moorCall.recordError.dataHandle(t),r.m7Relogin(),void(r.m7IsWaitingEvent=!1)}return void window.setTimeout(function(){r.m7IsWaitingEvent=!1,r.m7WaitEvent()},2e3)}if(o.Kick){t="";return"ukick"==(t=o.Comments?o.Comments:t)||"ekick"==t?moorCall.moortools.error("您当前的会话已经失效,导致该问题的原因是别的座席使用相同的帐号（或相同的分机）登录了"):moorCall.moortools.error("您当前的会话已经失效,导致该问题的原因可能是被管理员强制签出"),window.userLogin=!1,window.webPhone&&window.webPhone.destroy(),r.destroy(),void(window.location="./notify.html")}n=n.Event;null!=n&&r.m7eventHandler(n)}r.m7IsWaitingEvent=!1,r.m7WaitEvent()}},error:function(e,o){r.m7IsWaitingEvent=!1,window.setTimeout(function(){var o;r.m7IccCount++,3<r.m7IccCount&&(r.display("连接服务器超时，可能是您的网络问题，正在尝试重新连接..."),o=moorCall.recordError.getCurrentTime(),o={eventJson:"GetState",catchRecord:e,errorTime:o},moorCall.recordError.dataHandle(o)),r.m7WaitEvent()},1e3)}}))},m7hangupChann:function(o){var n=this;console.debug("强拆"+o);var e,t={Channel:o},r=function(o,e){o.Succeed||o.Expired&&n.m7Relogin()};this.m7Destroyed||(e={},o=this.proxy_url,m7$.extend(e,{Command:"Action",Action:"Hangup",Account:this.accountId,ActionID:"ForceHangup"+Math.random(),PBX:this.pbx_in_ip,SessionID:this.uniqueId}),m7$.extend(e,t),null==r&&(r=function(o,e){}),m7$.ajax({url:o,data:{json:JSON.stringify(e)},jsonp:"callbackName",async:!0,dataType:"jsonp",timeout:15e3,success:r,error:function(o,e){console.dir(o)}}))},display:function(o){var e=m7$("#netMessage");e&&e.html(o)},m7Relogin:function(){var t,o,e;this._isRelogin||((t=this)._isRelogin=!0,o=this.proxy_url,e={Command:"Action",Action:"Login",User:t.loginName,Password:t.password,ActionID:"Login"+Math.random(),ExtenType:t.extenType,AutoBusy:!1,BusyType:prePhonebarStatus.toString(),Monitor:t.Monitor},m7$.ajax({url:o,data:{json:JSON.stringify(e)},jsonp:"callbackName",async:!0,dataType:"jsonp",timeout:15e3,success:function(o,e){var n=o;n.SessionID?(isCtiRelogin=!0,t.uniqueId=n.SessionID,o=(new Date).valueOf(),t.currentServerTime=o-1e3*n.Timestamp,1==_cti_peerstate&&("0"==t.m7PeerState.m7CurPeerStateKey?t.m7SetBusy(!1,t.m7PeerState.m7CurPeerStateKey):"99"!=t.m7PeerState.m7CurPeerStateKey&&t.m7SetBusy(!0,t.m7PeerState.m7CurPeerStateKey)),t.m7WaitEvent()):n.Succeed||((n=n.Result)?400==n?moorCall.moortools.error("没有对应接听设备"+n):404==n?moorCall.moortools.error("密码，账号，或者proxy_url不正确"+n):406==n?moorCall.moortools.error("坐席license版本问题，您登陆坐席的版本不支持使用软电话条"+n):601==n?moorCall.moortools.error("您的账户通话座席登录数已达最大或者已经到期"+n):602==n?moorCall.moortools.error("您的账户无通话座席登录数已达最大或者已经到期"+n):603==n&&moorCall.moortools.error("账户license到期，请联系管理员"+n):moorCall.moortools.error("您当前的会话已经失效,导致该问题的原因可能是被管理员强制签出"),window.userLogin=!1,window.webPhone&&window.webPhone.destroy(),window.location="./notify.html",t.destroy()),t._isRelogin=!1},error:function(o,e){console.debug("ACTION返回错误[%s]",o)}}))},m7Ring:function(o,e){this.oldInboundId=this._inboundId,console.debug("控件onRing返回[callId:%s,remoteId:%s]",o,e),this._inboundId=o},m7AutoBusyTimeChanged:function(o){this.autoBusyTime=o},consult:function(o,e){var n,t=this;"9"!=o.substr(0,1)||"external"!=e||((n=o?o.slice(1,2):"")&&"1"!==n&&"0"!==n&&"9"!==n&&6===o.length||o.length<=5)&&(o=o.substr(1)),4<o.length&&"skillgroup"!=e?(moorCall.moortools.m7ShowLoading(o,{num:o,type:"consult"}),fromCid=this.sipNo+"@"+this.didNum):o.length<=4&&"skillgroup"!=e?"9"!=o.substr(0,1)?moorCall.moortools.m7ShowLoading("工号  "+o+" ",{num:o,type:"consult"}):moorCall.moortools.m7ShowLoading(o,{num:o,type:"consult"}):"skillgroup"==e&&moorCall.moortools.m7ShowLoading(o,{num:o,type:"consult"}),this.m7SendAction("Consult",{FromExten:t.sipNo,Exten:o,UserID:t.userId,Version:"New",Timeout:6e4},function(o,e){o.Succeed?o.Version&&"New"===o.Version?o.IsSupportCancel&&"True"===o.IsSupportCancel?m7$("#cancelConsult").show().css({display:"block"}):m7$("#cancelConsult").hide():(moorCall.moortools.close(),m7$("#cancelConsult").hide(),moorCall.moortools.m7ShowSuccess("咨询成功"),t.m7changeState("stConcultTalking")):(moorCall.moortools.close(),moorCall.moortools.error("咨询失败"),o.Expired&&t.m7Relogin())},function(o,e){moorCall.moortools.close(),moorCall.moortools.error("咨询失败")})},cancelConsult:function(o){var n=this,e=this.User?this.User.substring(0,this.User.indexOf("@")):"";n.m7OtherChannel&&this.m7SendAction("CancelConsult",{Channel:n.m7OtherChannel,ConsultExten:o+"",FromExten:e,UserID:n.userId,Version:"New",Timeout:6e4},function(o,e){o.Succeed?(moorCall.moortools.close(),moorCall.moortools.m7ShowSuccess("取消咨询成功")):(alert("取消咨询失败!"),o.Expired&&n.m7Relogin())},function(o,e){alert("取消咨询失败!")})},batchDialout:function(n,o){var e,t,r,i,s;n&&o&&(e=o.context,t=o.type,r=o.callbackSuccFun,i=o.callbackFailFun,s=o.callbackObj,this.m7SendAction("BatchDialout",{BatchDialoutType:t,Context:e,CallNumber:n,Timeout:12e4,Async:"true"},function(o,e){o.Succeed?(console.debug("批量外呼[%s]成功",n),r.call(s,o.Message)):i.call(s,0)},function(o,e){i.call(s,0)}))},playDtmf:function(o){sipPhone.playDtmf(o)},m7StopSound:function(){try{document.soundPlayer&&document.soundPlayer.stop()}catch(o){console.debug(o)}},answer:function(){},dialout:function(e,o){var n,t,r,i,s,l,a;"smallPhone"==o?(console.debug("呼叫："+e),(t=this).User&&-1!=t.User.indexOf("@")&&(n=t.User.split("@")[0]),s=(r=(i=localStorage.getItem("szjw_params"))?JSON.parse(i):{}).userId,l=r.date,a=r.callId,o=r.appId,i=r.secret,r={FromExten:n,Exten:e,DialoutStrVar:`userId:${s},callId:${a},date:${l}`},n=o,o=i,i=(new Date).Format("yyyyMMddhhmmss"),o=md5(n+o+i).toUpperCase(),i=Base64.encode(n+":"+i),m7$.ajax({url:"https://apis.7moor.com/v20180426/call/dialout/"+n+"?sig="+o,type:"post",data:JSON.stringify(r),dataType:"json",contentType:"application/json;charset=utf-8",headers:{Authorization:i},jsonp:"callback",Async:"true",success:function(o){1==o.Succeed?console.debug("外呼[%s]成功",e):(console.debug("外呼失败"),moorCall.moortools.error(o.message))},error:function(o){alert("外呼失败")}})):(t=this,r="",i=e.slice(0,1),e.length<5?this.m7Base.m7getPhoneUserViaExten(e)?r="inner":(e="9"+e,r="dialout",t.callObject.originCallNo=t.didNum,t.callObject.originCalledNo=e):5===e.length&&"1"!==i&&"0"!==i&&"9"!==i?r="inner":(e="9"+e,r="dialout",t.callObject.originCallNo=t.didNum,t.callObject.originCalledNo=e),s=localStorage.getItem("userId"),l=Date.now()+Math.random(16).toString().slice(2,10),a=localStorage.getItem("callId"),this.m7SendAction("Originate",{Channel:"SIP/"+t.sipNo,Context:t.accountId,Exten:e,Priority:"1",UserID:t.userId,Timeout:6e4,Async:"true",CallType:r,HasCdrVar:!0,ActionID:`userId:${s}:${a}:${l}`},function(o,e){o.Succeed||o.Expired&&t.m7Relogin()}))},m7SendAction:function(o,e,n,t){var r,i;this.m7Destroyed||(r={},i=this.proxy_url,m7$.extend(r,{Command:"Action",Action:o,Account:this.accountId,ActionID:o+Math.random(),PBX:this.pbx_in_ip,SessionID:this.uniqueId}),m7$.extend(r,e),e=e.Timeout||6e4,null==n&&(n=function(o,e){}),null==t&&(t=function(o,e){}),m7$.ajax({url:i,data:{json:JSON.stringify(r)},jsonp:"callbackName",async:!0,dataType:"jsonp",timeout:e,success:n,error:t}))},stopConsult:function(){var n=this;this.m7SendAction("StopConsult",{FromExten:n.sipNo,UserID:n.userId,Timeout:6e4},function(o,e){o.Succeed?null!=o.Message&&"Idle"==o.Message?n.m7changeState("stInvalid"):n.m7changeState("stTalking"):(o.Expired&&n.m7Relogin(),moorCall.moortools.error("结束咨询通话失败"))})},hangup:function(){var n=this;this.m7SendAction("Hangup",{Channel:n.m7CurentChannel},function(o,e){o.Succeed||(n.callObject={},o.Expired&&n.m7Relogin())})},hold:function(){var n=this;this.m7SendAction("Hold",{UserID:n.userId,Channel:n.m7OtherChannel,Async:"true"},function(o,e){o.Succeed?(n._stateBeforeHold=n.m7Base.m7CurrentCallState.m7CallState,n.m7changeState("stHold")):o.Expired&&n.m7Relogin()})},unhold:function(){var n=this;this.m7SendAction("Unhold",{UserID:n.userId,Channel:n.m7OtherChannel,Async:"true"},function(o,e){o.Succeed?n.m7changeState("stTalking"):o.Expired&&n.m7Relogin()})},investigate:function(){var n,o,e;this.m7IsInvestigatting||(this.m7IsInvestigatting=!0,o=(n=this).userId,e=n.accountId+"-investigate",n.m7SendAction("Transfer",{Exten:"s",Channel:n.m7OtherChannel,CallType:"investigate",UserID:o,Context:e},function(o,e){o.Succeed||(n.m7IsInvestigatting=!1,o.Expired&&n.m7Relogin())}),this.m7IsInvestigatting=!1)},transfer:function(o,e,n){var t,r=this;r.callObject.originCallNo;"9"!=o.substr(0,1)||"external"!=e||((t=o?o.slice(1,2):"")&&"1"!==t&&"0"!==t&&"9"!==t&&6===o.length||o.length<=5)&&(o=o.substr(1)),4<o.length&&"skillgroup"!=e?(moorCall.moortools.m7ShowLoading(o),this.sipNo,this.didNum):o.length<=4&&"skillgroup"!=e?"9"!=o.substr(0,1)?moorCall.moortools.m7ShowLoading("工号  "+o+" "):moorCall.moortools.m7ShowLoading(o):"skillgroup"==e&&moorCall.moortools.m7ShowLoading(o);moor.objectToQuery(n);var i,s,n="",n=this.accountId;r.callObject&&r.callObject.data&&(i=r.callObject.data.workSheetId,s=r.callObject.data.customerId),r.m7SendAction("Transfer",{WorkSheetID:i||"",CustomerID:s||"",Exten:o,Channel:r.m7OtherChannel,ExtraChannel:r.m7CurentChannel,UserID:r.userId,Context:n},function(o,e){var n;moorCall.moortools.close(),o.Succeed?moorCall.moortools.m7ShowSuccess("转接成功"):((n="")==(n="310"==o.Message?"未配置外呼线路":"311"==o.Message?"转接的用户忙":"312"==o.Message?"转接的用户未签入":"313"==o.Message?"转接的用户正在通话":"314"==o.Message?"转接的用户没有以通话方式登录":"315"==o.Message?"无法呼通转接的用户":"316"==o.Message?"转接用户不存在":"")?moorCall.moortools.error("转接失败"):moorCall.moortools.error("转接失败："+n),o.Expired&&r.m7Relogin())},function(o,e){moorCall.moortools.close()})},m7CalloutFail:function(o,e){"stConsulting"==this.state&&this._inboundId&&(sipPhone.ChangeCurrentCall(this._inboundId),this.m7changeState("stTalking"))},listen:function(n){var t=this;"0"!=this.m7PeerState.m7CurPeerStateKey?this.m7SendAction("Originate",{Channel:"SIP/"+t.sipNo,Application:"ChanSpy",Data:n+"|bq",UserID:t.userId,Callerid:t.sipNo,Async:"true"},function(o,e){o.Succeed?(console.debug("监听[%s]成功",n),t.m7OtherChannel=n):(console.debug("监听[%s]失败"+o.Message,n),o.Expired&&t.m7Relogin())}):moorCall.moortools.error("请先将电话置为忙碌")},kick:function(r){var i=this;this.m7SendAction("Kick",{Exten:r},function(o,e){var n,t;o.Succeed?(n=i.m7MonitorPeers[r])&&(n.C5Status="",n.callNo="",n.callStatus="Idle",t=(new Date).valueOf(),n.timestamp=t/1e3,linked=!1,n.channel="",n.linkedChannel="",console.debug("kickoff"),senvenMPublish("EvtMonitorPeer",[n]),i.m7Base.m7UpdQueueInfo()):o.Expired&&i.m7Relogin()})},m7PlaySound:function(){try{document.soundPlayer&&document.soundPlayer.play()}catch(o){console.debug(o)}},threeWayCall:function(o){var n=this;this.m7SendAction("ThreeWayCall",{FromExten:n.sipNo,UserID:n.userId,Exten:o,Timeout:6e4},function(o,e){o.Succeed?n.m7changeState("stThreeWayTalking"):(o.Expired&&n.m7Relogin(),moorCall.moortools.error("三方通话失败"))})},m7SetBusy:function(o,n,e){var t;1<=m7$(".dialoutCenterBox").length||("inline-block"!=m7$(".HangupEnable").css("display")?this.m7IsSetbusy||(this.m7IsSetbusy=!0,null!=n&&"undefined"!=n?(o={Exten:(t=this).userId,Busy:o,BusyType:""+n},t.m7SendAction("Busy",o,function(o,e){o.Succeed?o.Succeed&&(prePhonebarStatus=n,changePhoneBarStatus(n)):(moorCall.moortools.error("切换状态失败！"),o.Expired&&t.m7Relogin())}),this.m7IsSetbusy=!1,this.m7BusyType=n):moorCall.moortools.error("状态有误，请重新登录")):moorCall.moortools.error("该状态下不能切换状态!"))},m7ToIVR:function(){var n=this,o=userInfo.accountId+"-validate",e="Validate";return"Q000000003893"!=userInfo.accountId&&"B000000006069"!=userInfo.accountId||(e="Check"),n.m7SendAction(e,{Exten:"s",Channel:n.m7OtherChannel,Context:o},function(o,e){if(!o.Succeed)return o.Expired&&n.m7Relogin(),ERR_NO_SUCH_CHANNEL}),this.m7IsInvestigatting=!1,SUCCESS},m7Phone_toMenu:function(o){var e=this,o={Channel:this.m7OtherChannel,Context:o};this.m7SendAction("IvrMenu",o,function(o){o.Succeed?moorCall.moortools.m7ShowSuccess("来电正在转验证，请稍后"):(o.Expired&&e.m7Relogin(),moorCall.moortools.m7ShowSuccess("转IVR菜单失败"))},function(){moorCall.moortools.m7ShowSuccess("转IVR菜单失败")})},m7changeState:function(o){senvenMPublish("EvtBarChange",[this.extenType+"_"+o])},m7ChangePhone:function(o,e){var n=this;"Local"!=o&&"gateway"!=o||("sip"==n.extenType&&sipPhone.UnInitNoFire(),n.sipNo=e,n.extenType=o,n.m7SendAction("SetExtenType",{User:n.userId,LoginExten:e,ExtenType:o},function(o,e){o.Succeed||o.Expired&&n.m7Relogin()}))},m7LootCall:function(o){var e,n=this;"0"!=this.m7PeerState.m7CurPeerStateKey?(e=this.accountId,n.m7SendAction("Transfer",{Channel:o,CallType:"Loot",Exten:n.sipNo,UserID:n.userId,Context:e},function(o,e){o.Succeed?n.m7IsLooter=!0:o.Expired&&n.m7Relogin()})):moorCall.moortools.error("请先将电话置为忙碌")}}),Date.prototype.Format=function(o){var e,n={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(e in/(y+)/.test(o)&&(o=o.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),n)new RegExp("("+e+")").test(o)&&(o=o.replace(RegExp.$1,1==RegExp.$1.length?n[e]:("00"+n[e]).substr((""+n[e]).length)));return o},moorCall.Phone.registerEvent=function(r){var i=null,s=this,o=r.proxy_url,l={Command:"Action",Password:r.password,ActionID:"Login"+Math.random(),BusyType:r.busyType,User:r.User,ExtenType:r.extenType,Action:"Login",Monitor:r.Monitor};isSuperAdmin&&(l={Command:"Action",Action:"Login",ActionID:"Login"+Math.random(),Password:"7pu3refwds98172e",UserID:"2387rufhinjvcx73rfws",PBX:"pbx.tx.test02.0",Account:"N00000002407",MonitorUser:!0}),isSuperAdmin?(m7$("#moorCall_minitor").show(),m7$("#softphonebar").hide()):(r.Monitor?m7$("#moorCall_minitor").show():m7$("#moorCall_minitor").hide(),m7$("#softphonebar").show()),m7$.ajax({url:o,data:{json:JSON.stringify(l)},jsonp:"callbackName",async:!0,timeout:15e3,dataType:"jsonp",success:function(o,e){var n,t=o;return t.SessionID?(r.uniqueId=t.SessionID,n=(new Date).valueOf(),r.loginName=r.User,r.currentServerTime=n-1e3*t.Timestamp,r.AutoBusyTime=t.AutoBusyTime,r.accountId=t.Account,r.userId=t.UserID||l.UserID,r.PhonebarConfig=t.PhonebarConfig,r.pbx_in_ip=t.PBX,r.sipNo=t.SipNum,account.sessionId=t.SessionID,account.accountId=t.Account,account.PBX=t.PBX,account.url=r.proxy_url,prePhonebarStatus=r.busyType,i=new moorCall.Phone(r),phone=i,moorCall.moortools.m7afterPhone(phone),moorCall.moortools.initPhoneAgentStatus(t.PhonebarConfig),s.logonStatus="logonSuccess"):t.Succeed?(s.logonStatus="logonFail",i=!1):(i=!1,(t=t.Result)&&(400==t?moorCall.moortools.error("没有对应接听设备"+t):404==t?moorCall.moortools.error("密码，账号，或者proxy_url不正确"+t):406==t?moorCall.moortools.error("坐席license版本问题，您登陆坐席的版本不支持使用软电话条"+t):601==t?moorCall.moortools.error("您的账户通话座席登录数已达最大或者已经到期"+t):602==t?moorCall.moortools.error("您的账户无通话座席登录数已达最大或者已经到期"+t):603==t&&moorCall.moortools.error("账户license到期，请联系管理员"+t)),s.logonStatus="logonFail"),senvenMPublish("EvtLogon",[s.logonStatus]),o},error:function(o,e){return moorCall.moortools.error("请求超时，请检查本地网络"),console.debug("注册ass失败"),console.dir(o),s.logonStatus="logonFail",senvenMPublish("EvtLogon",[s.logonStatus]),window.userLogin=!1,window.webPhone&&window.webPhone.destroy(),window.location="./notify.html",alert("login failed!"),o}})};