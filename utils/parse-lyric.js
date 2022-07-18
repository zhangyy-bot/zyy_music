// 利用正则表达式 有些特殊符号需要转义
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split('\n')
  const lyricInfos = []
  for(const lineString of lyricStrings) {
    let timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue
    // 获取时间 隐式转换 都转换为ms
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    const time = minute + second + millsecond
    // 获取歌词文本 replace()可以接收字符串 或者 正则表达式
    const text = lineString.replace(timeResult[0], "")
    lyricInfos.push({ time, text })
  }
  return lyricInfos
}