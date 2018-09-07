//获取应用实例
const app = getApp()
/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../config');
const innerAudioContext = wx.createInnerAudioContext();
const backgroundAudioManager = wx.getBackgroundAudioManager()
const recorderManager = wx.getRecorderManager();
var uid = wx.getStorageSync('uid');
/**
 * 生成一条聊天室的消息的唯一 ID
 */
function msgUuid() {
  if (!msgUuid.next) {
    msgUuid.next = 0;
  }
  return 'msg-' + (++msgUuid.next);
}
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};
/**
 * 生成聊天室的系统消息
 */
function createSystemMessage(content) {
  return { id: msgUuid(), type: 'system', content };
}

/**
 * 生成聊天室的聊天消息
 */
function createUserMessage(content, user, isMe) {
  return { id: msgUuid(), type: 'speak', content, user, isMe };
}
function createUserAudio(content, user, isMe) {
  return { id: msgUuid(), type: 'audio', content, user, isMe };
}
function createUserImage(content, user, isMe) {
  return { id: msgUuid(), type: 'image', content, user, isMe };
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    'flag': true,
    'status':false,
    'status1':true,
    'status2': false,
    'border': '2px solid greenyellow',
    'color': 'greenyellow',
    messages: [],
    inputContent: '',
    lastMessageId: 'none', 
    music:'',
    aid:'s',
    audioimg: '../../image/sign.png',
    aimg: '../../image/sign1.gif',
    backgroundaudio:'http://lhttp.qingting.fm/live/4932/64k.mp3',
    audioimg:'../../image/sign.png',
    playBtn:'../../image/sou.png',
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://lhttp.qingting.fm/live/4932/64k.mp3',
    playstatus:1
  },
 
  show: function () {
    
    this.setData({flag:false});
    this.setData({ 'status': true })
  },
  //消失

  hide: function () {

    this.setData({ 'flag': true, 'status': false })

  },
  getimage(e){
    var that=this;
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths; 
                that.sendImage(tempFilePaths);              
              }
    })
 
  },
  recordshow: function () {
    this.setData({ 'status1': false,'status2':true})
  },
  stop:function(){
    this.setData({ 'status1': true, 'status2': false }) 
  },
  recorderS:function(){
    const op = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(op)
    recorderManager.onStart(() => {
      console.log('recorder start'),
      wx.showLoading({
        title: '录音中...',
      })
    })
    
   
  },
  recorderE: function () {
      recorderManager.stop();
      recorderManager.onStop((res) => { 
      const { tempFilePath } = res
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 1000,
      })
      this.sendRecorder(res);
      this.stop();
    })
  },
  playaudio(e){
    //backgroundAudioManager.pause()
    this.audioCtx.pause()
    console.log(e.currentTarget.dataset.src);
    var asd = e.currentTarget.id;
    this.setData({aid:asd}),
    setTimeout(() => { this.audioCtx.play() }, e.currentTarget.dataset.time * 1000),
    setTimeout(() =>{this.setData({aid:'n'})},e.currentTarget.dataset.time*1000),    
    innerAudioContext.autoplay = true;
    innerAudioContext.src = e.currentTarget.dataset.src;
  },
  /*doLogin: function () {
    showBusy('正在登录');
    var Lg = new qcloud.login();
    // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
    qcloud.login({
      success(result) {
        showSuccess('登录成功');
        this.me = result;
        this.setData({
          'uurl': result.data.userInfo.avatarUrl
        })
        console.log('登录成功', result);
      },

      fail(error) {
        showModel('登录失败', error);
        console.log('登录失败', error);
      }
    });
  },*/
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var res1 = wx.getSystemInfoSync()
    this.setData({
      clientHeight: res1.windowHeight * 0.74,
      centerHeight: res1.windowHeight * 0.26,
    });  
    if(!uid){
    wx.showModal({
      showCancel: false,
      title: '警告',
      content: '登陆聊天室',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../userinfo/userinfo',
          })
        }
      }
    })
    }else{
      this.enter(); 
      this.audioCtx = wx.createAudioContext('myAudio');
      this.audioCtx.play() 
    }    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {  
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this; 
    wx.request({
      url: `https://${config.service.host}/radio/reqnum`,
      data: {id:options.id},
      method: 'POST',
      header: {
        'content-type': 'application/X-www-form-urlencoded;charset=utf-8'
      },
      success: (res) => {
        console.log(res.data.data);
        that.setData({
          'saygood': res.data.data.saygood,
          'relay': res.data.data.relay,
          'rid': res.data.data.id,
          'uurl':res.data.data.avatarurl,
        })
      }
    });
  },
  onShareAppMessage: function (res) {
    var that =this;
    if (res.from === 'button') {
      
          let num = Number(that.data.relay) + 1;
          that.setData({ 'relay': num });
          wx.setStorageSync('relay', num)

    return {
      title: 'FM940',
      path: '/pages/radio/radio',
      imageUrl:'/image/Group15.png'
    }
  }
  },
  /*addrelay: function () {
    let num = Number(this.data.relay)+1;
    this.setData({ 'relay':num});
    wx.setStorageSync('relay', num)
  },*/
  addsaygood: function () {
    let old=wx.getStorageSync('saygood');
    let num = Number(this.data.saygood) + 1;
    if (old<3){
      this.setData({ 'saygood': num });
      wx.setStorageSync('saygood', num) 
    }else{
      this.amendMessage(createSystemMessage('一天最多点赞三次'));    
  }     
  },

  /**
 * 页面卸载时，退出聊天室
 */
  onUnload() {
    let relay=wx.getStorageSync('relay');
    let saygood = wx.getStorageSync('saygood');
    //let rid=
    wx.request({
      url: `https://${config.service.host}/radio/num`,
      data: { relay:relay,saygood:saygood,rid:this.data.rid},
      method: 'POST',
      header: {
        'content-type': 'application/X-www-form-urlencoded;charset=utf-8'
      }
    }); 
    this.quit();
  },
  /**
   * 页面切换到后台运行时，退出聊天室
   */
  onHide() {

  },
  /**
   * 启动聊天室
   */
  enter() {
    this.pushMessage(createSystemMessage('正在登录...'));
    if (!this.me) {
      login:true;
      qcloud.request({
        url: `https://${config.service.host}/user`,
        //login: true,
        success: (response) => {
          if (response.data.code==0){       
          this.me = JSON.parse(response.data.data);
            this.connect();
          }
        }
      });      
    }else{
      this.connect();  
    }
  },
  /**
  * 连接到聊天室信道服务
  */
  connect(person) {
    this.amendMessage(createSystemMessage('正在加入群聊...'));
    // 创建信道
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl);
    // 连接成功后，去掉「正在加入群聊」的系统提示
    tunnel.on('connect', () => this.popMessage());
    // 聊天室有人加入或退出，反馈到 UI 上
    tunnel.on('people', people => {
      const { total, enter, leave } = people;
      const penter = JSON.parse(enter);
      const pleave = JSON.parse(leave);
      if (enter) {
        this.pushMessage(createSystemMessage(`${penter.nickName}已加入群聊，当前共 ${total} 人`));
      } else {
        this.pushMessage(createSystemMessage(`${pleave.nickName}已退出群聊，当前共 ${total} 人`));
      }
    });
    // 有人说话，创建一条消息
    tunnel.on('speak', speak => {
      const { word, who } = speak;
      this.pushMessage(createUserMessage(word, who, true));
    });
    //语音信息
    tunnel.on('audio', audio => {
      const { word, who } = audio;
      word.duration = Math.round(word.duration / 1000);
      this.setData({ 'music': word.tempFilePath, 'num':word.duration});
      this.pushMessage(createUserAudio(word, who, true));
    });
    //图片信息
    tunnel.on('image', image => {
      const { word, who } = image;
      console.log(word);
      this.setData({ 'imagepath': word['0']});
      this.pushMessage(createUserImage(word, who, true));
    });
    // 信道关闭后，显示退出群聊
    tunnel.on('close', () => {
      this.pushMessage(createSystemMessage('您已退出群聊'));
    });
    // 重连提醒
    tunnel.on('reconnecting', () => {
      //this.pushMessage(createSystemMessage('已断线，正在重连...'));
    });
    tunnel.on('reconnect', () => {
      //this.amendMessage(createSystemMessage('重连成功'));
    });
    // 打开信道
    tunnel.open(person);
  },

  /**
   * 退出聊天室
   */
  quit() {
    if (this.tunnel) {
      this.tunnel.close();
    }
  },

  /**
   * 通用更新当前消息集合的方法
   */
  updateMessages(updater) {
    //console.log(updater);
    var messages = this.data.messages;
    updater(messages);
    this.setData({ messages });

    // 需要先更新 messagess 数据后再设置滚动位置，否则不能生效
    var lastMessageId = messages.length ? messages[messages.length - 1].id : 'none';
    this.setData({ lastMessageId });
  },

  /**
   * 追加一条消息
   */
  pushMessage(message) {
    //console.log(message);
    this.updateMessages(messages => messages.push(message));
  },

  /**
   * 替换上一条消息
   */
  amendMessage(message) {
    this.updateMessages(messages => messages.splice(-1, 1, message));
  },

  /**
   * 删除上一条消息
   */
  popMessage() {
    this.updateMessages(messages => messages.pop());
  },
  /* 用户输入的内容改变之后
     */
  changeInputContent(e) {
    this.setData({ inputContent: e.detail.value });
  },

  /**
   * 点击「发送」按钮，通过信道推送消息到服务器
   **/
  sendMessage(e) {
    // 信道当前不可用
    if(!this.tunnel || !this.tunnel.isActive()) {
  this.pushMessage(createSystemMessage('您还没有加入群聊，请稍后重试'));

  if (!this.me) {
    this.enter();
  }

  return;
}
setTimeout(() => {
  if (this.data.inputContent && this.tunnel) {
    this.tunnel.emit('speak', { word: this.data.inputContent, who: this.me});
    this.setData({ inputContent: '' });
  }
}, 100);
    },
  sendRecorder:function(e) {
    // 信道当前不可用
    if (!this.tunnel || !this.tunnel.isActive()) {
      this.pushMessage(createSystemMessage('您还没有加入群聊，请稍后重试'));
 
      if (!this.me) {
        this.enter();
      }
      return;
    }
    setTimeout(() => {
      if (e) {
        this.tunnel.emit('audio', { word: e, who: this.me});
      }
    }, 100);
  },
  sendImage: function (e) {
    // 信道当前不可用
    if (!this.tunnel || !this.tunnel.isActive()) {
      this.pushMessage(createSystemMessage('您还没有加入群聊，请稍后重试'));

      if (!this.me) {
        this.enter();
      }
      return;
    }
    setTimeout(() => {
      if (e) {
        this.tunnel.emit('image', { word: e, who: this.me });
      }
    }, 100);
  },
  audioPlay: function () {
    this.setData({
      playBtn: '../../image/sou.png',
      playstatus: 1
    }),
    this.audioCtx.play()   
  },
  audioPause: function () {
    this.setData({
      playBtn: '../../image/sou-l.png',
      playstatus: 0
    }),
    this.audioCtx.pause()   
  },

  /*play(e){
    let that = this;
    console.log(backgroundAudioManager);
    if(backgroundAudioManager.paused){
      console.log('if');
     
      backgroundAudioManager.play();    
    }else{     
      that.setData({
        playBtn: '../../image/sou-l.png'
      })
      backgroundAudioManager.pause();
      
    }
  }*/
})