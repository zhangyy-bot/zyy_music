import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music'

const rankingMap = { 0: 'newRanking', 1: 'hotRanking', 2: 'originRanking', 3: 'upRanking' }

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0:新歌榜
    hotRanking: {}, // 1:热歌榜
    originRanking: {}, // 2:原创榜
    upRanking: {}, // 3:飙升榜
  },
  actions: {
    getRankingDataAction(ctx) {
      // 0:新歌榜
      // 1:热歌榜
      // 2:原创榜
      // 3:飙升榜
      // getRankings(1).then(res =>{
      //   ctx.hotRanking = res.playlist
      // })
      for(let i = 0; i < 4; i++) {
        getRankings(i).then(res => {
          const rankingName = rankingMap[i]
          ctx[rankingName] = res.playlist
          // switch(i) {
          //   case 0:
          //     ctx.newRanking = res.playlist
          //   case 1:
          //     ctx.hotRanking = res.playlist
          //   case 2:
          //     ctx.originRanking = res.playlist
          //   case 3:
          //     ctx.upRanking = res.playlist
          // }
        })
      }
    }
  }
})

export {
  rankingMap,
  rankingStore
}