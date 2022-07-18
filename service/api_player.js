import zyyRequest from './index'

export function getSongDetail(ids) {
  return zyyRequest.get("/song/detail", {
    ids
  })
}

export function geSongLyric(id) {
  return zyyRequest.get("/lyric", {
    id
  })
}