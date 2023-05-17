<template>
  <div>
    <!-- 播放器 -->
    <div class="dance-music-mv-detail" v-if="detail != null">
      <div class="layout-left">
        <div class="title" v-if="detail != null">
          <b-tag plain color="var(--main-color)">MV</b-tag>
          <div class="name">{{ detail.name }}</div>
          <div class="artist">{{ detail.artistName }}</div>
        </div>
        <div class="video" v-if="url != null">
          <video
            :src="url"
            controls
            autoplay
            width="100%"
            class="video-play"
          ></video>
        </div>
      </div>
      <div class="right">
        <div class="desc" v-if="detail.desc">
          <p class="p">MV介绍</p>
          <div class="base">
            <div class="date">发布时间：{{ detail.publishTime }}</div>
            <div class="playCount">播放次数：{{ detail.playCount }}次</div>
            <div class="clear"></div>
          </div>
          <div
            class="mv-desc"
            ref="mvDesc"
            v-if="detail.desc != null"
            @mouseenter="enter"
          >
            <scroll :disable-wheel="true" class="desc-scroll" ref="descScroll">
              <span>简介：</span>
              {{ detail.desc }}
            </scroll>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>

    <!-- mv列表 -->
    <div class="dance-music-mvs">
      <div
        class="dance-music-mvs-item"
        :style="itemStyle"
        v-for="(item, index) in mvList"
        :key="index"
        @mouseenter="handleEnter(index)"
        @mouseleave="handleLeave"
        @click="enterMvDetail(item)"
      >
        <div class="dance-music-mvs-item-container">
          <div class="dance-music-mvs-item-top">
            <i class="iconfont icon-shipin"></i>
            <span v-if="item.count || item.playCount">{{
              (item.count || item.playCount).toString().slice(0, 2) + "万"
            }}</span>
          </div>
          <img v-lazy="item.cover" alt="" @load="handleLoad" />
          <transition name="playlist-opacity">
            <div
              class="dance-music-mvs-item-play"
              v-show="currentIndex == index"
            >
              <i class="iconfont icon-icon_play"></i>
            </div>
          </transition>
        </div>
        <div class="dance-music-mvs-item-desc">
          <p>{{ item.name }}</p>
          <span v-if="showArtist">{{ item.artist }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { imgLoadMixin } from "mixin/global/imgLoad";
import {
  _getMvDetail,
  _getMVUrl,
} from "network/mv";
export default {
  name: "MvList",
  mixins: [imgLoadMixin],
  props: {
    mvList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    lineNum: {
      type: Number,
      default: 4,
    },
    showArtist: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    itemStyle() {
      return {
        width: `calc(100% / ${this.lineNum})`,
      };
    },
  },
  data() {
    return {
      detail: null,
      url: null,
      currentIndex: null, //控制描述信息、播放次数显示隐藏
    };
  },
  methods: {
    handleEnter(index) {
      // if (this.emptyDesc) return;
      this.currentIndex = index;
    },
    handleLeave(index) {
      // if (this.emptyDesc) return;
      this.currentIndex = null;
    },
    handleLoad() {
      if (this.imgCount == this.mvList.length) this.$emit("refresh");
      this.imgCount++;
    },
    /**跳转到mv播放页面 */
    enterMvDetail(item) {
      // this.$router.push("/mv-detail/" + item.id);
      
      _getMvDetail(item.id).then((res) => {
        this.detail = res.data.data;
        console.log(item.id, this.detail);
      });

      _getMVUrl(item.id).then((res) => {
        this.url = res.data.data.url;
        console.log(item.id, this.url);
      });

    },
  },
  watch: {
    mvList() {
      this.imgCount = 1;
    },
  },
};
</script>
<style lang="less" scoped>
.dance-music-mvs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  &-item {
    width: calc(100% / 4);
    padding: 5px 20px;
    cursor: pointer;
    &-container {
      position: relative;
    }
    &-top {
      position: absolute;
      // top: 0px;
      // left: 0px;
      right: 0px;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.3)
      );
      display: flex;
      padding: 3px;
      justify-content: flex-end;
      align-items: center;
      color: #fff;
      .iconfont {
        margin-right: 5px;
      }
    }
    &-desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      span {
        font-size: 12px;
        opacity: 0.6;
      }
    }
    &-duration {
      // background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
      color: #fff;
      padding: 5px;
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }
    img {
      width: 100%;
      border-radius: 4px;
    }
  }
}
.dance-music-mvs-item-play {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .icon-icon_play {
    font-size: 24px;
    color: var(--main-color);
  }
}
.playlist-opacity-enter-active {
  animation: fadeOut var(--animation-base-time) reverse;
}
.playlist-opacity-enter-leave {
  animation: fadeOut var(--animation-base-time);
}
</style>


<style scoped>
.dance-music-mv-detail {
  width: 100%;
  /* height: 100%; */
  /* padding: 10px 10% 0px 10%; */
  padding: 10px 10% 30px 0;
  /* overflow: hidden; */
}
/* .scroll {
  height: calc(100vh - 58px - 60px);
} */
.layout-left {
  display: inline-block;
  width: 70%;
}
.video-play {
  outline-style: none;
}
.right {
  padding-left: 20px;
  width: 30%;
  float: right;
}
.clear {
  clear: both;
}
.layout-left .title {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}
.title .left-mv {
  padding: 5px;
  display: inline-block;
  border: 1px solid red;
  color: red;
}
.title .name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 18px;
  margin-left: 5px;
}
.title .artist {
  color: var(--color-text-an);
  margin-left: 5px;
}
.p {
  font-size: 18px;
  color: var(--color-text-tint);
  margin-bottom: 10px;
}
.base {
  font-size: 12px;
  color: var(--color-text-an);
  margin-bottom: 10px;
}
.base .date {
  float: left;
}
.base .playCount {
  float: right;
}
.mv-desc {
  max-height: 288px;
  width: 100%;
  overflow: hidden;
  line-height: 1.2em;
  font-size: 13px;
  margin-bottom: 15px;
  text-overflow: ellipsis;
}
.desc-scroll {
  max-height: 288px;
}
.mv-desc span {
  color: var(--color-text-blue);
  font-size: 14px;
}
.recommend {
  margin-top: 10px;
}
.rec {
  margin-top: 5px;
  padding: 5px 0px 10px 0px;
}
.hidden {
  height: 290px;
}
.mv-detail-bottom {
  text-align: right;
}
</style>