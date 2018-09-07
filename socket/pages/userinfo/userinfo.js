// pages/userinfo/userinfo.js
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../config');
var uid = wx.getStorageSync('uid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eye: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  getUserInfoFun: function (e) {
    if (!uid){
      qcloud.request({
        url: `https://${config.service.host}/user`,
        login: true,
        success: (response) => {
          if (response.data.code == 0) {
            let uid = JSON.parse(response.data.id);
            wx.setStorageSync('uid', uid)
          }
        }
      })
    };
    wx.navigateBack({
      delta: 1
    })
      
  },
  showPrePage: function () {
    this.setData({
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

})