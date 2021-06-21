<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot='center'>购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick='tabClick' ref="tabControl1" class="tab-control"
      v-show="isTabFixed" />
    <scroll class="scrollContent" ref='scroll' :probe-type="3" @scroll='contentScroll' :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" @tabClick='tabClick' ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 监听组件的原生事件必须给对应的事件加上.native才能进行监听 -->
    <back-top @click.native='backClick' v-show="isShowBackTop" />
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import Scroll from 'components/common/scroll/Scroll'
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import {
    itemListenerMixin,
    backTopMixin
  } from "common/mixin"
  import {
    getHomeMultidata,
    getHomeGoods
  } from 'network/home'
  import {
    debounce
  } from 'common/util'


  export default {
    name: 'Home',
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {
            page: 0,
            list: []
          },
          'new': {
            page: 0,
            list: []
          },
          'sell': {
            page: 0,
            list: []
          }
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll
    },
    created() {
      // 1. 请求多个数据
      this.getHomeMultidata()

      // 2. 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 1.监听item中图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },
    activated() {
      // 这里通过测试scrollTo的time参数如果设置为0的话会偶尔出现无法读取this.saveY现象，因此设置为1
      this.$refs.scroll.scrollTo(0, this.saveY, 1)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      console.log(this.saveY)
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /**
       * 事件监听的方法
       **/
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break
          case 1:
            this.currentType = 'new';
            break
          case 2:
            this.currentType = 'sell';
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position) {
        // 1. 判断BackTop是否显示
        this.listenShowBackTop(position)

        // 2. 决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关的方法
       **/
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // ...[数组]，数组的解析，逐个元素放入目标数组
          this.goods[type].list.push(...res.result.wall.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
          this.$refs.scroll.refresh()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /* padding: 44px 0 0px 0; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
  }

  .scrollContent {
    /* height: calc(100% - 49px); */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 2;
  }
</style>
