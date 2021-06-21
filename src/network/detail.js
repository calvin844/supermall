import {
  localRequest
} from "./request"

export function getDetail(iid) {
  return localRequest({
    url: "/testdata/" + iid + ".json"
  })
}

export class Goods {
  constructor(itemInfo, priceBanner, promotion, itemServices) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = priceBanner.nowPrice
    this.oldPrice = priceBanner.oldPrice
    this.discount = promotion.calculateDiscount.discountDesc
    this.columns = itemServices.columns
    this.columns[1].desc = "收藏" + itemInfo.cFav
    this.services = itemServices.services
    this.realPrice = itemInfo.lowNowPrice
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo
    this.name = shopInfo.name
    this.fans = shopInfo.cFans
    this.sells = shopInfo.cSells
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

export class GoodsParam {
  constructor(info,rule) {
		this.image = info.images?info.images[0]:''
		this.infos = info.set
		this.sizes = rule.tables?rule.tables:'';
  }
}

 