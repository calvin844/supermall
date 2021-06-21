<template>
  <div class="recommend-goods">
    <div class="goods-item" v-for="goodsItem in recommends" @click="itemClick(goodsItem.iid)">
      <img :src="goodsItem.img" @load="imageLoad" />
      <div class="goods-info">
        <p>{{goodsItem.title}}</p>
        <span class="price">{{goodsItem.price}}</span>
        <span class="collect">{{goodsItem.sale}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailRecommends",
    props: {
      recommends: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods:{
      imageLoad(){
        this.$emit('imageLoad')
      },
      itemClick(iid){
        this.$router.push('/detail/'+iid)
      }
    }
  }
</script>

<style scoped>
  .recommend-goods{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 10px 2px 10px 2px;
    
  }
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
    color: #999;
  }
</style>
