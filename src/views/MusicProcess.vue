<!-- finished -->
<template>
  <div class="musicprocess">
    <audio
      class="music"
      id="myAudio"
      :src="musicurl"
      ref="audio"
      controls
      autoplay
      @canplay="getDuration"
      @timeupdate="updateTime"
    ></audio>
    <div class="audio-left">
      <!-- 专辑封面 -->
      <div class="bar-albumImg">
        <img :src="musicimg" alt="" @click="musicDetail(musicinfo.id)" />
      </div>
      <!-- 模块：上一首，播放，暂停，下一首 -->
      <div class="audio-btns">
        <a href="#" class="iconfont" @click="previous()"> ⏮️ </a>
        <!-- 播放 -->
        <a
          href="#"
          class="iconfont"
          v-if="!isPaused"
          @click="changeStatus('playing')"
        >
          ▶️
        </a>
        <!-- 暂停 -->
        <a
          href="#"
          class="iconfont"
          v-if="isPaused"
          @click="changeStatus('pasuing')"
        >
          ⏸️
        </a>
        <!-- 下一首 -->
        <a href="#" class="iconfont" @click="next()"> ⏯️ </a>
      </div>
      <!-- 进度条 -->
      <div class="audio-progress">
        <span>{{ currentTime | timeFormat }}</span>
        <div class="block">
          <el-slider
            v-model="currentTime"
            :max="duration"
            @change="onSliderChange"
            :format-tooltip="formatTooltipProgress"
          ></el-slider>
        </div>
        <span>{{ duration | timeFormat }}</span>
      </div>
    </div>
    <div class="audio-right">
      <!-- 音量面板 -->
      <div class="mode-volume-list">
        <!-- 音量图标 -->
        <a herf="#" class="iconfont" v-if="voice" @click="voice = 0">🔊</a>
        <a
          href="#"
          class="iconfont"
          v-if="!voice"
          @click="voice = cacheVoice == 0 ? 0.7 : cacheVoice"
          >🔈</a
        >
        <!-- 音量控制面板 -->
        <div class="volume-panel">
          <el-slider
            v-model="voice"
            :max="1"
            :step="0.1"
            :show-tooltip="true"
            vertical
            height="80px"
            @input="changeVolume"
            @change="changeCacheVolume"
            :format-tooltip="formatTooltip"
          >
          </el-slider>
        </div>
      </div>
      <!-- 列表 -->
      <div class="mode-music-list">
        <a herf="#" class="iconfont">⏏️</a>
        <MusicQueue class="musicqueue"></MusicQueue>
      </div>
    </div>
  </div>
</template>
  <script>
import MusicQueue from "./MusicQueue.vue";
export default {
  name: "MusicProcess",
  components: { MusicQueue },
  props: ["musicurl", "musicinfo"],
  data() {
    return {
      // 总时长
      duration: 0,
      // 返回当前播放时长
      currentTime: 0,
      // 是否播放
      isPaused: false,
      // 音量
      voice: 0.7,
      // 缓存音量
      cacheVoice: 0.7,
      isSeeking: false, // 是否正在拖动滑块
      musicimg: require("../assets/imgs/defualt.png"),
    };
  },
  methods: {
    getDuration(event) {
      // 总时长
      this.duration = event.target.duration;
    },
    updateTime(event) {
      // 时间进度
      if (!this.isSeeking) {
        this.currentTime = event.target.currentTime;
      }
    },
    onSliderChange(value) {
      this.isSeeking = false;
      this.$refs.audio.currentTime = value;
    },
    // 是否播放
    changeStatus(option) {
      if (option == "playing") {
        if (this.musicurl) {
          this.isPaused = !this.isPaused;
          this.$refs.audio.play();
        } else {
          this.$message({
            type: "error",
            message: "没有音乐正在播放",
            showClose: true,
          });
        }
      } else {
        this.isPaused = !this.isPaused;
        this.$refs.audio.pause();
      }
    },
    // 音量控制
    changeVolume() {
      this.$refs.audio.volume = this.voice;
    },
    changeCacheVolume() {
      // 设置缓存音量,点击静音恢复至该音量，如缓存也为0，恢复默认0.7
      this.cacheVoice = this.voice;
    },
    formatTooltip(val) {
      return val * 100 + "%";
    },
    loop() {
      this.isPaused = false;
      const audio = this.$refs.audio;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setTimeout(() => {
        this.isPaused = !this.isPaused;
        this.$refs.audio.play();
      }, 100);
    },
    // 上一曲
    previous() {
      if (this.musicQueue.length == 0) {
        this.$message({
          type: "warning",
          message: "播放列表为空",
          showClose: true,
        });
      } else {
        if (this.musicQueue.length == 1) {
          this.loop();
        } else {
          let ids = [];
          for (const item of this.musicQueue) {
            ids.push(item.id);
          }
          let nowIndex = ids.indexOf(this.globalMusicInfo.id);
          let prevIndex =
            (nowIndex - 1) % this.musicQueue.length < 0
              ? ((nowIndex - 1) % this.musicQueue.length) +
                this.musicQueue.length
              : (nowIndex - 1) % this.musicQueue.length;
          this.$store.commit("changeNowIndex", prevIndex);
          console.log("播放列表Index变更:", prevIndex);
        }
      }
    },
    // 下一曲
    next() {
      if (this.musicQueue.length == 0) {
        this.$message({
          type: "warning",
          message: "播放列表为空",
          showClose: true,
        });
      } else {
        if (this.musicQueue.length == 1) {
          this.loop();
        } else {
          let ids = [];
          for (const item of this.musicQueue) {
            ids.push(item.id);
          }
          let nowIndex = ids.indexOf(this.globalMusicInfo.id);
          let nextindex = (nowIndex + 1) % this.musicQueue.length;
          this.$store.commit("changeNowIndex", nextindex);
          console.log("播放列表Index变更:", nextindex);
        }
      }
    },
    formatTooltipProgress(value) {
      return this.$options.filters.timeFormat(value);
    },
    musicDetail(id) {
      this.$router.push(`/musicdetail?q=${id}`);
    },
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
    nowIndex() {
      return this.$store.state.nowIndex;
    },
    globalMusicInfo() {
      return this.$store.state.globalMusicInfo;
    },
  },
  filters: {
    timeFormat(time) {
      let min = parseInt(time / 60)
        .toString()
        .padStart(2, "0");
      let second = parseInt(time - min * 60)
        .toString()
        .padStart(2, "0");
      return min + ":" + second;
    },
  },
  watch: {
    // 监听：当一首歌放完之后，循环播放列表
    currentTime() {
      if (this.currentTime >= this.duration) {
        if (this.musicQueue.length == 1) {
          this.loop();
        } else {
          let ids = [];
          for (const item of this.musicQueue) {
            ids.push(item.id);
          }
          let nowIndex = ids.indexOf(this.globalMusicInfo.id);
          let nextindex = (nowIndex + 1) % this.musicQueue.length;
          this.$store.commit("changeNowIndex", nextindex);
          console.log("播放列表Index变更:", nextindex);
        }
      }
    },
    voice() {
      if (!this.voice) {
        this.$refs.audio.muted = true;
      } else this.$refs.audio.muted = false;
    },
    musicurl() {
      if (this.musicurl) this.isPaused = true;
      else {
        this.isPaused = false;
        this.duration = 0;
        this.$refs.audio.currentTime = 0;
        this.currentTime = 0;
      }
    },
    musicinfo() {
      if (this.musicinfo.picUrl != undefined) {
        this.musicimg = this.musicinfo.picUrl;
      } else if (this.musicinfo.album != undefined) {
        if (this.musicinfo.album.picUrl != undefined) {
          this.musicimg = this.musicinfo.album.picUrl;
        } else {
          this.musicimg = this.musicinfo.album.artist.img1v1Url;
        }
      } else if (this.musicinfo.al != undefined) {
        this.musicimg = this.musicinfo.al.picUrl;
      }
    },
  },
};
</script>
  <style scoped>
@import "../assets/common/tab.css";
.musicprocess {
  position: relative;
  padding: 10px;
  min-width: 400px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
}
.musicprocess .music:not([controls]) {
  display: none !important;
}
.musicprocess .music {
  display: none;
  width: 300px;
  height: 54px;
}
.audio-left {
  flex: 1;
}
.bar-albumImg {
  position: absolute;
  width: 60px;
  height: 60px;
  left: 100px;
  bottom: 10px;
}
.bar-albumImg a {
  width: 60px;
  height: 60px;
}
.bar-albumImg img {
  width: 60px;
  height: 60px;
  background-color: #f199a4;
  border-radius: 50%;
}
.audio-btns {
  position: absolute;
  left: 180px;
  top: 26px;
}

.iconfont {
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 24px;
}

.iconfont:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.audio-progress {
  position: absolute;
  display: flex;
  align-items: center;
  width: 50%;
  margin-left: 350px;
  margin-top: -15px;
  width: 700px;
}

.audio-progress span {
  font-size: 12px;
  color: palevioletred;
}
.block {
  flex: 1;
  margin: 0 10px;
  width: 600px;
}
.audio-right {
  position: absolute;
  width: 150px;
  height: 40px;
  margin-left: 1120px;
}
.volume-panel {
  display: none;
  position: absolute;
  margin-top: -170px;
  width: 20px;
  height: 100px;
  background-color: rgba(255, 192, 203, 0.8);
  border-radius: 20px;
  box-shadow: 0px 0px 4px #b99ca6;
}
.mode-volume-list {
  width: 40px;
  height: 100px;
  margin: -15px auto;
  line-height: 80px;
  float: left;
}
.mode-volume-list:hover .volume-panel {
  display: block;
}
.mode-volume-list:hover path {
  fill: palevioletred;
}
.audio-btns a:hover path {
  fill: palevioletred;
}
.mode-music-list {
  width: 40px;
  height: 80px;
  margin: -40px auto;
  line-height: 130px;
  float: right;
}
.mode-music-list:hover path {
  fill: palevioletred;
}
.mode-music-list:hover .musicqueue {
  display: block;
}
</style>