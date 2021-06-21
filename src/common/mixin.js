import {
  debounce
} from 'common/util'
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMixin = {
  // 混入可以使用data,components,created等
  data() {
    return {
      mininValue: '混入变量',
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh)
  }
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
      this.isShowBackTop = false
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
