<template>
  <div class="recommend">
    <div  class="recommend-item" v-for="item in recommends">
      <a :href="item.link">
        <img :src="item.image" />
        <p>{{item.title}}</p>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RecommendView',
    props: {
      recommends: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .recommend{
    display: flex;
    text-align: center;
    font-size: 12px;
    padding: 10px 0px  10px 0px;
    border-bottom: 8px solid #eee;
  }
  .recommend .recommend-item{
    flex: 1;
  }
  .recommend .recommend-item img{
    width: 70px;
    height: 70px;
    margin: 0 0 10px 0;
  }
</style>
