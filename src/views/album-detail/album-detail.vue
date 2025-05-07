<template>
  <scroll class="scroll" ref="scroll">
    <div class="dance-music-album-detail">
      <base-info
        :base-info="album"
        :album-detail="albumDetail"
        :cover="getAlbumCover"
        @playMusic="playMusic"
      />
      <song-list
        :music-list="musicList"
        @refresh="handleRefresh"
        ref="songList"
      />
    </div>
  </scroll>
</template>
<script>
import { _getSongsDetail, songDetail, songInfo } from "network/detail";
import { _getAlbum } from "network/artist";
import { _getAlbumDetail } from "network/album";

import { playMusic } from "mixin/global/play-music";
import Scroll from "common/scroll/Scroll";
import BaseInfo from "./childsComps/baseInfo";
import SongList from "common/song-list/song-list";
export default {
  name: "AlbumDetail",
  mixins: [playMusic],
  components: { Scroll, BaseInfo, SongList },
  data() {
    return {
      album: {},
      albumId: 0,
      albumDetail: {},
      musicList: [],
    };
  },
  computed: {
    getAlbumCover() {
      if (this.musicList[0] && this.musicList[0].pic)
        return this.musicList[0].pic;
    },
  },
  // created() {
  //   console.log((new Date()).toLocaleString());
  //   this.album = this.$route.query.album;
  //   this.getAlbumDetail();
  //   this.getAlbumSongs();
  // },
  methods: {
    handleRefresh() {
      this.$refs.scroll.refresh();
    },
    // /**获取专辑信息：收藏数、分享数等 */
    // getAlbumDetail() {
    //   _getAlbumDetail(this.albumId).then((res) => {
    //     this.albumDetail = res.data;
    //   });
    // },
    /**获取专辑歌曲 */
    getAlbumSongs() {
      _getAlbum(this.albumId).then((res) => {
        let songs = res.data.songs;
        this.album = res.data.album;
        this.musicList = [];
        for (let i in songs) {
          if (res.data.resourceState == null) {
            // migu
            let song = new songInfo(songs[i]);
            this.musicList.push(song);
          } else {
            let song = new songDetail([songs[i]]);
            this.musicList.push(song);
          }

          if (i == songs.length - 1) {
            this.$nextTick(() => {
              this.handleRefresh();
            });
          }
        }

        // for (let i in songs) {
        //   _getSongsDetail(songs[i].id).then((res) => {
        //     let song = new songDetail(res.data.songs);
        //     this.musicList.push(song);
        //     if (i == songs.length - 1) {
        //       this.$nextTick(() => {
        //         this.handleRefresh();
        //       });
        //     }
        //   });
        // }
      });
    },
  },
  watch: {
    $route: {
      handler() {
        console.log("进入album-detail Handler");
        if (this.$route.path.indexOf("album-detail") > 0) {
          console.log("进入album-detail路由");
          this.albumId = this.$route.query.id;
          // this.getAlbumDetail();// 加载分享数量等，用处不大；
          this.getAlbumSongs();
          this.$nextTick(() => {
            this.$emit("refresh");
          });
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
.scroll {
  height: calc(100vh - 58px -60px);
}
.dance-music-album-detail {
  padding: 10px 30px 0px 30px;
}
</style>