export default function (selector) {
  return new Promise((resolve) =>{
    // 获取图片的高度（获取某一个组件（image组件）的高度）
   const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}