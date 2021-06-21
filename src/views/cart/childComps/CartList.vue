<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in cartList" :product="item" :key="index" />
    </scroll>
  </div>
</template>

<script>
  import CartListItem from './CartListItem'
  import Scroll from 'components/common/scroll/Scroll'

  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'CartList',
    components: {
      CartListItem,
      Scroll
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    activated() {
      // 添加新数据后需要刷新scroll的高度
      console.log(this.cartList)
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 135px);
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
