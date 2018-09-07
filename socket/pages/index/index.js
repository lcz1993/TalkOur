//index.js
//获取应用实例
const app = getApp()
/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    radioer: {
      "id": "1",
      "rad_name": "940不夜天",
      "start_time": "00：00",
      "end_time": "06：00",
      "play_name": "姜飞",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/db51e16ed283507a796376b5ba3bd4b4.png",
      "status": "2",
      "relay": "0",
      "saygood": "0"
    },
    radioList: [{
      "id": "1",
      "rad_name": "940不夜天",
      "start_time": "00：00",
      "end_time": "06：00",
      "play_name": "姜飞",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/db51e16ed283507a796376b5ba3bd4b4.png",
      "status": "2",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "2",
      "rad_name": "音乐早上好",
      "start_time": "06：00",
      "end_time": "07：00",
      "play_name": "王潇",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/321a4ab703a48e28b4380d5b957e2fc0.png",
      "status": "1",
      "relay": "10",
      "saygood": "7"
    }, {
      "id": "3",
      "rad_name": "柠檬咖啡tea",
      "start_time": "07：00",
      "end_time": "09：00",
      "play_name": "亚东",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/cf6d99eb9da52c2f3f49a4482b7775bc.png",
      "status": "0",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "4",
      "rad_name": "音乐老友记",
      "start_time": "09：00",
      "end_time": "12：00",
      "play_name": "石坚",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/efe5c98e2c0d18f12f3e6d03ec5c0892.png",
      "status": "0",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "5",
      "rad_name": "只听好歌不听话",
      "start_time": "12：00",
      "end_time": "14：00",
      "play_name": "姜飞",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/4f34f919ff07d6e5297b096acd8e9701.png",
      "status": "0",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "6",
      "rad_name": "音乐红茶馆",
      "start_time": "14：00",
      "end_time": "17：00",
      "play_name": "小栩",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/16a4fd7cdc86556992636bea0625fd69.png",
      "status": "1",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "7",
      "rad_name": "只听好歌不听话",
      "start_time": "17：00",
      "end_time": "19：00",
      "play_name": "宏亮",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/7929fc2e82daa1c33e1e0199b91ca403.png",
      "status": "0",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "8",
      "rad_name": "爱上一座城",
      "start_time": "19：00",
      "end_time": "20：00",
      "play_name": "王潇",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/6f8ccf02ae0ca877acc311e9ad8cf444.png",
      "status": "1",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "9",
      "rad_name": "只爱老情歌",
      "start_time": "20：00",
      "end_time": "22：00",
      "play_name": "嘟嘟",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/760a1fce6dcb17d132ed19c08905ece0.png",
      "status": "1",
      "relay": "12",
      "saygood": "9"
    }, {
      "id": "10",
      "rad_name": "美文便当",
      "start_time": "22：00",
      "end_time": "23：00",
      "play_name": "940DJ",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/2e25e74811562d2408f0087d6e4d045a.png",
      "status": "0",
      "relay": "0",
      "saygood": "0"
    }, {
      "id": "11",
      "rad_name": "边走边听",
      "start_time": "23：00",
      "end_time": "24：00",
      "play_name": "王平",
      "avatarurl": "https://986074128.tssccm.xyz/uploads/11d2ccd146dd223b8e02b4e7352f30bc.png",
      "status": "1",
      "relay": "10",
      "saygood": "7"
    }],
  },
  radiofun: function (e) {
    wx.navigateTo({
      url: '../radio/radio?id=' + e.currentTarget.dataset.id
    })
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady() {

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow() {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          'userImage': res.userInfo.avatarUrl,
        })
      }
    })
  },

  onLoad: function () {
    var auth = new qcloud.authority();
  }

})
