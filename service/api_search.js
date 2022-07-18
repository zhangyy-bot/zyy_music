import zyyRequest from "./index";

export function getSearchHot() {
  return zyyRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return zyyRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export function getSearchResult(keywords) {
  return zyyRequest.get("/search", {
    keywords
  })
}