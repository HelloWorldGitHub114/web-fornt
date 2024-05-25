<!-- finished -->
<template>
    <div class="discover">
      <!-- 轮播图 -->
      <div class="Carousel">
        <el-carousel :interval="4000" type="card" height="250px">
          <el-carousel-item v-for="(item, index) in banners" :key="index">
            <img
              :src="item.imageUrl"
              alt="banner"
              width="100%"
              height="100%"
              class="item-img"
            />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 推荐歌单 -->
      <div class="songs-warp">
        <h3>推荐歌单</h3>
        <div class="list">
          <ul>
            <li
              class="iconfont icon-play"
              v-for="(item, index) in musiclists"
              :key="index"
              @click="playListDetail(item.id)"
            >
              <p class="first-p">{{ item.copywriter }}</p>
              <img :src="item.picUrl" alt="recommd" />
              <p class="last-p" :title="item.name">{{ item.name }}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 最新音乐 -->
      <div class="songs-warp">
        <h3>最新音乐</h3>
        <ul class="new-songs">
          <li
            v-for="(item, index) in newsmusic"
            :key="index"
            @click="playMusic(item)"
          >
            <div class="music-img-warp">
              <img :src="item.picUrl" alt="newSongs" />
              <p class="iconfont icon-play"></p>
            </div>
            <div class="music-info">
              <p class="music-name">{{ item.name }}</p>
              <p class="music-singer">{{ item.song.artists[0].name }}</p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 最新M V -->
      <div class="songs-warp mv-warp">
        <h3>推荐MV</h3>
        <ul class="mv-list">
          <li
            v-for="(item, index) in newsmv"
            :key="index"
            @click="toMvdetail(item.id)"
          >
            <div class="mv-img-warp">
              <img alt="newMvs" :src="item.picUrl" />
              <p class="iconfont icon-play play"></p>
              <p class="play-count iconfont icon-play">{{ item.playCount }}</p>
            </div>
            <div class="mv-info">
              <p class="title">{{ item.name }}</p>
              <p class="author">{{ item.artists[0].name }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';
  export default {
    name: "FindMusic",
    data() {
      return {
        // 轮播图
        banners: [],
        // 推荐歌单
        musiclists: [],
        // 最新音乐
        newsmusic: [],
        // 最新mv
        newsmv: [],
      };
    },
    computed: {
      musicQueue() {
        return this.$store.state.musicQueue;
      },
    },
    created() {
      // 轮播图
      axios({
        url: "/banner",
        method: "get",
        params: {},
      }).then((res) => {
        this.banners = res.data.data.banners;
      });
      // 推荐歌单
      axios({
        url: "/personalized",
        method: "get",
        params: {
          limit: 10,
        },
      }).then((res) => {
        this.musiclists = res.data.data.results;
      });
      // 最新音乐
      axios({
        url: "/personalized/newsong",
        method: "get",
        params: {
          limit: 10,
        },
      }).then((res) => {
        this.newsmusic = res.data.data.result;
      });
      // 最新MV
      axios({
        url: "/personalized/mv",
        method: "get",
        params: {
          limit: 8,
        },
      }).then((res) => {
        this.newsmv = res.data.data.result;
      });
    },
    methods: {
      // 播放音乐
      playMusic(item) {
        axios({
          url: "/song/url",
          method: "get",
          params: {
            id: item.id,
          },
        }).then((res) => {
          this.$parent.$data.musicinfo = item;
          this.$parent.$data.musicurl = res.data.data[0].url;
        });
        let time = item.song.duration;
        let min = parseInt(time / 60000)
          .toString()
          .padStart(2, "0");
        let second = parseInt((time - min * 60000) / 1000)
          .toString()
          .padStart(2, "0");
        time = min + ":" + second;
        let musicitem = {
          id: item.id,
          name: item.name,
          musicArtist: item.song.artists[0].name,
          duration: time,
          picUrl: item.picUrl,
        };
        this.$store.commit("changeMusicInfo", musicitem);
        this.$store.commit("changeMusicQueue", musicitem);
        let ids = [];
        for (const row of this.musicQueue) {
          ids.push(row.id);
        }
        this.$store.commit("changeNowIndex", ids.indexOf(item.id));
      },
      playListDetail(id) {
        this.$router.push(`/playlistdetail?q=${id}`);
      },
      toMvdetail(id) {
        this.$router.push(`/mvdetail?q=${id}`);
      },
    },
  };
  </script>
  <style scoped>
  @import "../assets/icomoon/style.css";
  .discover {
    z-index: 12;
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
  }
  .el-carousel--horizontal {
    overflow-x: hidden;
  }
  .el-carousel {
    position: relative;
  }
  .el-carousel__item--card {
    border-radius: 20px;
  }
  
  .Carousel{
    width: 600px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .songs-warp {
    margin-bottom: 20px;
  }
  .songs-warp h3 {
    color: rgb(145, 137, 139);
    margin-bottom: 20px;
  }
  /* 推荐歌单 */
  .songs-warp .list ul {
    list-style: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .list ul li {
    width: 18%;
    margin: 10px 0;
    position: relative;
    overflow-y: hidden;
  }
  
  .list li .first-p {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background-image: linear-gradient(
      rgba(255, 192, 203, 0.5),
      rgba(255, 192, 203, 0)
    );
    color: #fff;
    font-size: 12px;
    padding: 5px;
    box-sizing: border-box;
    transform: translateY(-100%);
    transition: 0.5s;
  }
  
  .list li::before {
    content: "";
    position: absolute;
    bottom: 25px;
    right: 5px;
    width: 35px;
    height: 35px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    color: #d87093;
    opacity: 0;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .list li:hover .first-p {
    transform: translateY(0);
  }
  .list li:hover .last-p {
    color: palevioletred;
  }
  .list li:hover::before {
    opacity: 1;
  }
  
  ul img {
    width: 100%;
    border-radius: 5px;
    /* opacity: 1; */
  }
  
  ul .last-p {
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;
  }
  ul .last-p:hover {
    color: palevioletred;
  }
  /* 最新音乐  */
  .new-songs {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .new-songs li {
    width: 50%;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
  }
  
  .new-songs li:hover {
    background-image: linear-gradient(
      to right,
      rgba(255, 192, 203, 0.5),
      rgba(255, 192, 203, 0)
    );
    border-radius: 5px;
  }
  
  .new-songs li:hover::before {
    opacity: 1;
  }
  
  .new-songs .music-img-warp {
    position: relative;
    width: 100px;
    cursor: pointer;
  }
  
  .new-songs .music-img-warp:hover p::before {
    opacity: 1;
  }
  
  .new-songs .music-img-warp p::before {
    content: "\ea42";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    height: 35px;
    font-size: 35px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: palevioletred;
    opacity: 0;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .music-info {
    flex: 1;
    padding: 0 10px;
  }
  
  .new-songs li p:first-child {
    margin-bottom: 20px;
  }
  
  .music-singer {
    color: rgb(145, 137, 139);
    font-size: 12px;
  }
  /* 最新MV */
  .mv-list {
    display: flex;
    justify-content: flex-start;
    list-style: none;
    flex-wrap: wrap;
  }
  
  .mv-list li {
    width: 23%;
    padding: 0 10px;
  }
  
  .mv-img-warp {
    position: relative;
    cursor: pointer;
  }
  
  .mv-img-warp:hover .play::before {
    opacity: 1;
  }
  
  .mv-img-warp .play::before {
    content: "\ea42";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    height: 35px;
    font-size: 35px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: palevioletred;
    opacity: 0;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .play-count {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #fff;
    text-shadow: 0 0 2px rgb(255, 192, 203);
  }
  
  .play-count::before {
    margin-right: 5px;
  }
  
  .mv-info p {
    margin: 5px 0;
  }
  
  .mv-info .author {
    color: #a5a1a1;
    font-size: 12px;
  }
  .mv-warp {
    margin-bottom: 200px;
  }
  </style>