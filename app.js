//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
      },
  globalData: {
    appid:'wx23c16d47d11f09be',      
    secret:'23c250f0caf92da5483b61a581f8662f',
    userInfo:null
  }
})