<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked='isSelectAll' class="check-button" @click.native="checkClick" />
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return "￥" + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.counter
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length == 0) return false
        // 1. filter函数需要遍历整个数组，效率较低
        // return !(this.cartList.filter(item => !item.checked).length)
        // 2. find函数当它找到一个符合条件的会马上终止遍历
        return !this.cartList.find(item => !item.checked)
        // 3. 普通遍历
        // for(let item of this.cartList){
        //   if(!item.checked){
        //     return false
        //   }
        // }
        // return true
      }
    },
    methods:{
      checkClick(){
        if(this.isSelectAll){
          this.cartList.forEach(item=>item.checked = false)
        }else{
          this.cartList.forEach(item=>item.checked = true)
        }
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show("请选择商品")
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    width: 70px;
  }

  .check-button {
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin: 0px 5px 0px 10px;
  }

  .price {
    margin: 0 0 0 10px;
    flex: 1
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
