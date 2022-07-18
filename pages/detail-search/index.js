// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: ""
  },
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  // 可能会进行多次网络请求，直接把所有请求写在一起
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },
  // 事件处理
  handleSearchChange: function(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if(!searchValue.length) {
      // 为什么要置空呢？其实就是将上一次请求的结果清空 不然搜索时的判断会出现问题
      this.setData({ suggestSongs: [] })
      this.setData({ resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 根据关键字进行搜索 
    // getSearchSuggest(searchValue).then(res => {
    //   this.setData({ suggestSongs: res.result.allMatch })
    // })
    debounceGetSearchSuggest(searchValue).then(res => {
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      // 2.转成nodes节点
      if(!suggestSongs) return
      const suggestKeyWords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(const keyword of suggestKeyWords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchAction: function() {
    // 这里必须这样拿searchValue，这里可没有闭包
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleSuggestClick: function(event) {
    // 1.获取点击的关键字
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword
    // 2.将关键字设置到searchValue中
    this.setData({ searchValue: keyword })
    // 3.发送网络请求
    getSearchResult(keyword).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleTagItemClick: function(event) {
        // 1.获取点击的关键字
        const keyword = event.currentTarget.dataset.item
        // 2.将关键字设置到searchValue中
        this.setData({ searchValue: keyword })
        // 3.发送网络请求
        getSearchResult(keyword).then(res => {
          this.setData({ resultSongs: res.result.songs })
        })
  }
})