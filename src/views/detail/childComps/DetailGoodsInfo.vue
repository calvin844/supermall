<template>
  <div v-if="Object.keys(detailInfo).length!==0" class="goods-info">
    <div class="info-desc clear-fix">
      <div class="start"></div>
      <div class="desc">{{detailInfo.desc}}</div>
      <div class="end"></div>
    </div>
    <div class="info-key">{{detailInfo.detailImage[0].key}}</div>
    <div class="info-list">
      <img v-for="(item,index) in detailInfo.detailImage[0].list" :key="index" :src="item" @load="imgLoad" alt="" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailGoodsInfo',
    props: {
      detailInfo: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        counter: 0,
        imageLength: 0
      }
    },
    methods: {
      imgLoad() {
        if (++this.counter === this.imageLength) {
          this.$emit('imageLoad')
        }
      }
    },
    watch: {
      detailInfo() {
        // 获取图片的个数
        this.imageLength = this.detailInfo.detailImage[0].list.length
      }
    }
  }
</script>

<style scoped>
  .goods-info {
    padding: 10px;
  }
  .info-list img {
    width: 100%;
    margin: 0 0 5px 0;
  }
</style>
