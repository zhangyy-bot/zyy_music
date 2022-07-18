import zyyRequest from './index'

export function getTopMV(offset, limit = 10) {
  return zyyRequest.get('/top/mv', {
    offset,
    limit
  })
}

/**
 * 请求MV的播放地址
 * @param {number} id 
 * @param {number} r 
 */
export function getMVURL(id, r = 1080) {
  return zyyRequest.get('/mv/url', {
    id,
    r
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
  return zyyRequest.get('/mv/detail', {
    mvid
  })
}

/**
 * 请求相关视频
 * @param {number} id 
 */
export function getRelatedVideo(id) {
  return zyyRequest.get('/related/allvideo', {
    id
  })
}