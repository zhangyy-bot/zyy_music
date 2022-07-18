import zyyRequest from './index'

export function getBanners() {
  return zyyRequest.get("/banner", {
    type: 2
  })
}

export function getRankings(idx) {
  return zyyRequest.get('/top/list', {
    idx
  })
}

export function getSongMenu(cat="全部", limit=6, offset=0) {
  return zyyRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return zyyRequest.get('/playlist/detail/dynamic', {
    id
  })
}