// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'
import { getBanners, getSongMenu, getHotSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import { throttle } from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    recommendSongs: [],
    // rankings: []
    // 数据请求下来的顺序可能会乱
    rankings: { 0: {}, 2: {}, 3: {}},
    currentSong: {},
    isPlaying: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发起网络请求
    this.getPageData()
    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")
    // 从store中获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6);
      this.setData({ recommendSongs })
    })
    // 从store中获取共享的巅峰榜的数据
    // rankingStore.onState("newRanking", this.getNewRankingHandler)
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    playerStore.onStates(["currentSong","isPlaying"], ({currentSong, isPlaying}) => {
      if(currentSong) this.setData({currentSong})
      if(isPlaying !== undefined) this.setData({isPlaying})
    })
  },

  // 网络请求
  getPageData: function() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenu('流行').then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  // 事件处理
  handleSearchClick: function() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded: function() {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      // setData在设置data数据上，是同步的
      // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
      this.setData({ swiperHeight: rect.height })
    })
  },
  hanldeMoreClick: function() {
    // wx.navigateTo({
    //   // 这里不能加js后缀
    //   url: '/pages/detail-songs/index',
    // })
    this.navigateToDetailSongsPage("hotRanking")
  },
  handleRankingItemClick: function(event) {
    const idx = event.currentTarget.dataset.idx
    // console.log(idx);//0,2,3
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  hanldeSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  handleBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePlayBarClick: function() {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  },

  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  // 在页面销毁的时候取消监听
  onunload: function() {
    // rankingStore.offState("newRanking", this.getNewRankingHandler)
  },

  // 编写回调函数
  // getNewRankingHandler: function(res) {
  //   if(Object.keys(res).length === 0) return
  //   const name = res.name
  //   const coverImage = res.coverImgUrl
  //   const songList = res.tracks.slice(0,3)
  //   const rankingObj = {name, coverImage, songList}
  //   // 下面这两行没看懂 好像懂了 这样可以做到响应式
  //   const originRankings = [...this.data.rankings]
  //   originRankings.push(rankingObj) 
  //   this.setData({rankings: originRankings})
  // },

  getRankingHandler: function(idx) {
    // 看清楚咯！这里直接返回一个函数 所以每次调用getRankingHandler就相当于调用返回的这个函数
    return (res) => {
    if(Object.keys(res).length === 0) return
    const name = res.name
    const coverImage = res.coverImgUrl
    const playCount = res.playCount
    const songList = res.tracks.slice(0,3)
    const rankingObj = {name, coverImage, songList, playCount}
    // 下面这行没看懂 好像懂了 这样可以做到响应式
    const newRankings = {...this.data.rankings, [idx]: rankingObj}
    this.setData({rankings: newRankings})
  }
  }

})