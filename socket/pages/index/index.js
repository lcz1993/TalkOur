//index.js
//获取应用实例
const app = getApp()
/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../config');
// 显示繁忙提示
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

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  radiofun: function (e) {
    console.log(e.currentTarget.dataset.id);
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
          'user': res.userInfo.avatarUrl,
        })
      }
    })
    wx.request({
      url: `https://${config.service.host}/radio/req`,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/X-www-form-urlencoded;charset=utf-8'
      },
      success: (res) => {
        console.log(res.data.data);
        that.setData({
          'radio': res.data.data,
          'radioer': res.data.radioer[0]
        })
      }
    });
  },

  onLoad: function () {
    var auth = new qcloud.authority();

  }

})
