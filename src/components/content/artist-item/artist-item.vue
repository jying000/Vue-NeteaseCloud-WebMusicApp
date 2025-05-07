<template>
  <div
    :class="[`artist-item`, `artist-item-${getTheme}`]"
    @click="enterArtistDesc"
  >
    <div class="left">
      <img v-lazy="artist.picUrl" alt="" v-if="artist.picUrl" />
      <b-avatar size="calc(100vh /12)" shape="square" v-else />
    </div>
    <div class="right">
      <div class="right-name">{{ artist.name }}</div>
      <div class="right-item">
        专辑数：<span>{{ artist.albumSize }}</span>
      </div>
      <div class="right-item" v-if="artist.mvSize">
        MV数：<span>{{ artist.mvSize }}</span>
      </div>
      <div class="right-item" v-if="artist.songCount">
        歌曲数：<span>{{ artist.songCount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ArtistItem",
  computed: {
    getTheme() {
      return this.$store.getters.getTheme;
    },
  },
  props: {
    artist: {
      type: Object,
      default: {},
    },
  },
  methods: {
    enterArtistDesc() {
      this.$Toast.error("禁用歌手跳转，因为加载的信息太多了，内容无非包括专辑、MV、歌手资料，计划改为只折叠展示歌手信息。", 5000);
      // this.$router.push({
      //   path: "/artist-detail",
      //   query: {
      //     artist: this.artist,
      //   },
      // });
    },
  },
};
</script>
<style lang="less" scoped>
.artist-item {
  padding: 8px 0px;
  display: flex;
  cursor: pointer;
  &-light:hover,
  &-green :hover {
    background: var(--light-hover-bg-color);
  }
  &-dark:hover {
    background: var(--dark-hover-bg-color);
  }
  .left {
    width: calc(100vh / 12);
    height: calc(100vh / 12);
    img {
      width: 100%;
      border-radius: 4px;
    }
  }
  .right {
    height: calc(100vh / 12);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .right-item {
      font-size: 12px;
      span {
        color: var(--tag-color);
      }
    }
  }
}
</style>