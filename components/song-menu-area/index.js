// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songMenu: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuItemClick: function(event) {
      // 从组件上传过来的
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        // 利用id这个参数就能实现区分点击的不同小组件啦！值得学习！
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
      })
    }
  }
})
