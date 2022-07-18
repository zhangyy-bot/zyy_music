// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api_music'

Page({
  data: {
    type: "",
    rankingInfo: {},
    menuInfo:{}
  },

  onLoad: function (options) {
    const type = options.type
    this.setData({ type: type })
    if(type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        console.log(res.playlist);
        this.setData({ menuInfo: res.playlist })
      })
    } else if(type === "rank") {
      const ranking = options.ranking
      // 1.获取数据
      rankingStore.onState(ranking, this.getRankingDataHandler)
    }
  },

  handleSongItemClick: function(event) {
    let index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.rankingInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  onUnload: function () {

  },

  getRankingDataHandler: function(res) {
    this.setData({ rankingInfo: res })
  }

})