import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types"
export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // payload新添加商品
      let oldProduct = null
      // 查找是否已有商品，for方法：
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item
      //   }
      // }
      // 查找是否已有商品，数组的finde方法：
      oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前的商品数量+1')
      } else {
        payload.counter = 1
        payload.checked = true
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加新的商品')
      }
    })
  }
}
