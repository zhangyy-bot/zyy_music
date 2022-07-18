// components/nav-bar/index.js
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight
  },
  methods: {
    handleLeftClick: function() {
      this.triggerEvent('click')
    }
  }
})
