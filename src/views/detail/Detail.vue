<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="navbar" />
    <scroll class="content" ref="scroll" :probe-type="2" @scroll="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <detail-recommends :recommends="recommends" @imageLoad="imageLoad" ref="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native='backClick' v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  // import Toast from 'components/common/toast/Toast'

  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailRecommends from './childComps/DetailRecommends'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import {
    mapActions
  } from 'vuex'
  import {
    itemListenerMixin,
    backTopMixin
  } from "common/mixin"
  import {
    getDetail,
    Goods,
    Shop,
    GoodsParam
  } from 'network/detail'
  import {
    debounce
  } from 'common/util'
  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: "",
        // show: false
      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    components: {
      Scroll,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailRecommends,
      DetailBottomBar
      // Toast
    },
    created() {
      // 1. 保存传入的iid
      this.iid = this.$route.params.iid

      // 2. 根据iid请求数据
      getDetail(this.iid).then(res => {
        const data = res.data.result
        // 1. 获取顶部轮播图
        this.topImages = data.topImages
        // 2. 获取商品信息
        this.goods = new Goods(data.itemInfo, data.normalPrice, data.promotionV2, data.itemServices)
        // 3. 获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 4. 获取商品详情
        this.detailInfo = data.detailInfo
        // 5. 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, "")
        // 6. 获取评论信息
        if (data.rateInfoV2.cRate !== 0) {
          this.commentInfo = data.rateInfoV2.list[1]
        }
        this.recommends = data.shopRecommend !== undefined ? data.shopRecommend.realTimeRecommendItemList : [],
          // 1. 第一次获取，值不对，原因：this.$refs.params.$el还没有渲染
          // this.themeTopYs = []
          // this.themeTopYs.push(0);
          // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
          // console.log(this.themeTopYs)
          // 完成前一步后使用$nextTick可以在前一步完全结束后，$nextTick中的函数
          this.$nextTick(() => {
            // 根据最新的数据，对应的DOM是已经被渲染出来
            // 2. 第二次获取，值不对：图片还没加载完成，所以获取到的offsetTop是错误的
            // this.themeTopYs = []
            // this.themeTopYs.push(0);
            // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
            // console.log(this.themeTopYs)
          })
      })
      // 给getThemeTopY的赋值进行防抖
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      }, 100)
    },
    methods: {
      // 把vuex中的Actions方法映射到methods里面
      ...mapActions(['addCart']),
      imageLoad() {
        this.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 300)
      },
      scroll(position) {
        const positionY = -position.y
        this.listenShowBackTop(position)
        // 自制
        // for (let t in this.themeTopYs) {
        //   if (positionY > this.themeTopYs[t]-50) {
        //     this.$refs.navbar.currentIndex = t
        //   }
        // }

        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          //判断条件过于复杂
          // if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this
          //     .themeTopYs[i + 1]) || (i ===
          //     length - 1 && positionY >= this.themeTopYs[i])) {
          //   this.currentIndex = i
          //   this.$refs.navbar.currentIndex = this.currentIndex
          // }
          // hack做法：数组最后添加最大值（Number.MAX_VALUE），简化判断条件
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i
            this.$refs.navbar.currentIndex = this.currentIndex
          }
        }
      },
      addToCart() {
        // 1. 获取购物车需要展示的商品信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.newPrice
        product.iid = this.iid

        // 2.将商品加入购物车
        // this.$store.commit('addCart',product)
        // 提交到actions中处理：this.$store.dispatch('addCart',product)
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ""
          // }, 1500)
          this.$toast.show(res)
        })

      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 95px);
  }

  .detail-nav-bar {
    position: relative;
    top: 0;
    z-index: 9;
    background-color: #fff;
  }
</style>
