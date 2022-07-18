// pages/music-player/index.js
// import { getSongDetail, geSongLyric } from '../../service/api_player'
// import { parseLyric } from '../../utils/parse-lyric'
import { audioContext, playerStore } from '../../store/index'

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    id: 0,
    currentSong: {},
    // 用于歌词歌曲的切换记录
    currentPage: 0,
    contentHeight: 0,
    // 一首歌的总时长
    durationTime: 0,
    currentTime: 0,
    // 滑块的进度值0-100
    sliderValue: 0,
    // 是否在来回滑动
    isSliderChanging: false,
    // 歌词
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "", 
    lyricScrollTop: 0,

    playModeIndex: 0,
    playModeName: "order",

    isPlaying: false,
    playingName: 'pause'
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })
    // 2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    // 3.动态计算内容高度
    const screenHeight = getApp().globalData.screenHeight
    const statusBarHeight = getApp().globalData.statusBarHeight
    const navBarHeight = getApp().globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })

    // 4.使用audioContext播放歌曲
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // // audioContext.play() 
    // // audioContext.autoplay = true //歌曲从网络缓存下来后再回调一个函数
    // audioContext.onCanplay(() => {
    //   audioContext.play() //直接播放 不能播的时候等一会 能播的时候再播
    // })

    // 5.audioContext的时间监听器
    // this.setupAudioContextListener()
  },
  // =======================   网络请求相关代码   =======================   
  // getPageData: function(id) {
  //   getSongDetail(id).then(res => {
  //     this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
  //   })
  //   geSongLyric(id).then(res => {
  //     const lyricString = res.lrc.lyric
  //     const lyrics = parseLyric(lyricString)
  //     this.setData({ lyricInfos: lyrics })
  //   })
  // },


  // =======================  事件处理   =======================
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChange: function(event) {
    // 1.获取slider变化的值
    const value = event.detail.value
    // 2.需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    // 3.设置context播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000) // 这里需要传入s 传入ms值太大 会播放不了
    // 4.记录最新的sliderValue
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

  handleBackBtnClick: function() {
    wx.navigateBack()
  },

  handleSliderChanging: function(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  handleModeBtnClick: function() {
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3) playModeIndex = 0
    playerStore.setState("playModeIndex", playModeIndex)
  },
  handlePlayBtnClick: function() {
    // playerStore.setState("isPlaying", !this.data.isPlaying)
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick: function() {
    playerStore.dispatch("changeNewMusicPrevAction")
  },
  handleNextBtnClick: function() {
    playerStore.dispatch("changeNewMusicNextAction")
  },

  setupPlayerStoreListener: function() {
    // 1.监听currentSong，durationTime， lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({currentSong, durationTime, lyricInfos}) => {
      if(currentSong) this.setData({currentSong})
      if(durationTime) this.setData({durationTime})
      if(lyricInfos) this.setData({lyricInfos})
    })

    // 2.监听currentTime, currentLyricIndex, currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex","currentLyricText"], ({currentTime, currentLyricIndex, currentLyricText}) => {
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime, sliderValue})
      }
      if(currentLyricIndex) {
        this.setData({currentLyricIndex, lyricScrollTop: currentLyricIndex * 35})
      }
      if(currentLyricText) {
        this.setData({currentLyricText})
      }
    })

    // 3.监听播放模式相关的数据 注意onState 和onStates
    playerStore.onState("playModeIndex",(playModeIndex) => {
      this.setData({playModeIndex, playModeName: playModeNames[playModeIndex]})
    })
    playerStore.onState("isPlaying",(isPlaying) => {
      this.setData({isPlaying, playingName: isPlaying ? "pause" : "resume"})
    })
  },

  onUnload: function () {

  },
})