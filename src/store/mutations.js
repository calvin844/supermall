import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types"
export default {
  // mutations唯一目的就是修改state中状态
  // mutations中的每个方法尽可能完成的事件比较单一，应该先通过actions把数据处理，mutations仅做单一修改state
  [ADD_COUNTER](state, payload) {
    payload.counter++
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}
