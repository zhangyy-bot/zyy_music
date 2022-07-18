import { HYEventStore } from 'hy-event-store'
import { getSongDetail, geSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    playModeIndex: 0, // 0: 顺序播放， 1：单曲循环： 2：随机播放

    isPlaying: false,

    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, {id}) {
      if(ctx.id == id) {
        // 点进去是否要让它播放，不管之前是否暂停
        // this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      // 0.修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = 0
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌词数据
      geSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 3.播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      // audioContext.play() 
      audioContext.autoplay = true //歌曲从网络缓存下来后再回调一个函数
      audioContext.onCanplay(() => {
        audioContext.play() //直接播放 不能播的时候等一会 能播的时候再播
      })

      // 4.监听audioContext的一些事件 因为是同一个audioContext 所以没必要每次监听
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx) {
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      // 2.监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000

        // 2.根据当前时间修改currentTime
        ctx.currentTime = currentTime

        // 3.根据当前时间查找播放的歌词（因为要用到currentTime，所以把这部分逻辑写在这）
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            // 设置当前歌词的索引和内容
            const currentIndex = i - 1
            // lyricInfos里面的内容化有的为null 这是会重复打印 所以可以设置if判断 避免重复打印
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex]
              ctx.currentLyricIndex = currentIndex
              ctx.currentLyricText = currentLyricInfo.text
            }
            // 找到要找的歌词就跳出循环 只有下次currentTime更新时才会再进入循环 开始遍历查找
            break
          }
        }
      })

      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicNextAction")
      })

      // 4.监听音乐暂停、播放、停止
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying) {
        audioContext.play()
      } else {
        audioContext.pause()
      }
    },

    changeNewMusicNextAction(ctx) {
      // 1.获取当前索引
      let index = ctx.playListIndex
      // 2.根据不同的播放模式，获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = index + 1
          if(index == ctx.playListSongs.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
         index = Math.floor(Math.random(1) * ctx.playListSongs.length)
         break
      }
      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引
        ctx.playListIndex = index
      }
      // 4.播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {id: currentSong.id})
    },

    changeNewMusicPrevAction(ctx) {
      // 1.获取当前索引
      let index = ctx.playListIndex
      // 2.根据不同的播放模式，获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = index - 1
          if(index == -1) index = ctx.playListSongs.length - 1
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
         index = Math.floor(Math.random(1) * ctx.playListSongs.length)
         break
      }
      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引
        ctx.playListIndex = index
      }
      // 4.播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {id: currentSong.id})
    }
  }
})

export {
  audioContext,
  playerStore
}