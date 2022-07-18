// app.js
App({
  onLaunch: function() {
    // 下面这个方法可以获取到屏幕的宽高、导航栏的宽高等很多设备相关信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight= info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44
  }
})
