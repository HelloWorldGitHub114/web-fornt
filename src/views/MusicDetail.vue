<!-- finished -->
<template>
  <div class="musicdetail">
    <div class="musicright-wrap">
      <h2>预留歌词滚动区域</h2>

      <div class="comment-wrap">
        <h3 class="comment-title">评论({{ total }})</h3>
        <ul>
          <li class="item" v-for="(item, index) in Comments" :key="index">
            <img :src="item.user.avatarUrl" alt="" class="comment-avatar" />
            <div class="comment-info">
              <div class="comment">
                <span class="comment-user">{{ item.user.nickname }}:</span>
                <span class="comment-content">{{ item.content }}</span>
              </div>
              <div class="re-comment"  v-for="(reply, Rindex) in item.beReplied" :key="Rindex">
                <span class="comment-user">{{ reply.user.nickname }}:</span>
                <span class="comment-content">{{reply.content}}</span>
              </div>
              <div class="comment-bottom">
                <p class="comment-time">{{ item.time }}</p>
                <span class="comment-time iconfont icon-dianzan">{{item.likedCount}}</span>
              </div>
            </div>
          </li>
        </ul>
        <el-pagination
          class="page-list"
          @current-change="handleCurrentChange"
          :page-size="20"
          :current-page="page"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <div class="musicleft-wrap">
      <h2>音乐详情</h2>
      <div class="music-info">
        <div class="music-info-head">
          <img class="musicartimg" :src="musicinfos.cover" alt="" />
          <p class="music-nickname">{{ musicinfos.artistName }}</p>
        </div>
        <div class="music-name">{{ musicinfos.name }}</div>
        <div class="music-other">
          <div class="music-time">发布时间：{{ musicinfos.publishTime }}</div>
          <div class="music-playcount">播放：{{ musicinfos.playCount }}次</div>
        </div>
        <p class="music-desc">{{ musicinfos.desc }}</p>
      </div>
    </div>

  </div>

</template>

<script>
import axios from "axios";
export default {
  name: "MusicDetail",
  data() {
    return {
      total: 0,
      page: 1,
      musicinfos: {},
      Comments: [],
    };
  },
  created() {
    //music信息
    // axios({
    //   url: "/music/detail",
    //   method: "get",
    //   params: { id: this.$route.query.q },
    // }).then((res) => {
    //   this.musicinfos = res.data.data;
    //   if (this.musicinfos.playCount > 10000) {
    //     this.musicinfos.playCount = parseInt(this.musicinfos.playCount / 10000) + "w";
    //   }
    // });
    //获取评论
    this.topCommpent();
  },
  methods: {
    topCommpent() {
      //获取评论
      axios({
        url: "/comment/music",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 20,
          offset: (this.page - 1) * 20,
        },
      }).then((res) => {
        this.Comments = res.data.data.comments;
        this.total = res.data.data.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.topCommpent();
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
.musicdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.music-info {
  margin: 20px 0;
  align-items: center;
}
.music-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.music-info .music-info-head .musicartimg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.music-info .music-info-head .musictitle {
  font-size: 25px;
  font-weight: bold;
  margin-left: 20px;
}
.music-info .music-name {
  font-size: 30px;
  color: #000;
  font-weight: 700;
}
.music-info .music-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}
.music-info .music-time {
  margin-right: 20px;
}
.music-info .music-desc {
  font-size: 14px;
  margin-bottom: 20px;
}
.musicright-wrap {
  width: 800px;
  margin: 10px 30px;
  margin-bottom: 150px;
}
.musicplay-wrap {
  width: 100%;
  height: 390px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.musicplay-wrap video {
  width: 100%;
  height: 100%;
  outline: none;
  object-fit: fill;
}

.comment-title {
  margin: 30px 15px 20px;
}

.comment-wrap ul li {
  display: flex;
  margin: 10px 0 30px 0;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-info {
  flex: 1;
  font-size: 14px;
  margin-left: 10px;
}

.comment {
  margin-bottom: 5px;
}

.comment-user {
  color: palevioletred;
  margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
}

.comment-content {
  display: inline;
}

.comment-time {
  color: grey;
  margin-right: 20px;
  margin-top: 5px;
}

.comment-bottom {
  display: flex;
  align-items: center;
  font-size: 14px !important;
}
.re-comment {
  background-color: #f3f1f3;
  padding: 5px 10px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 5px;
}
.icon-dianzan::before {
  content: "";
  font-size: 10px;
}

.music-list li {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.music-list li:hover {
  background-image: linear-gradient(
    to right,
    rgba(255, 192, 203, 0.5),
    rgba(255, 192, 203, 0)
  );
  border-radius: 5px;
}
.music-list .icon-play::before {
  content: "\ea42";
  position: absolute;
  top: 50%;
  left: 45%;
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
.music-list li:hover p::before {
  opacity: 1;
}
.musicleft-wrap {
  width: 450px;
  margin-left: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
}
.musiclist-img {
  position: relative;
  cursor: pointer;
}
.musiclist-img img {
  width: 150px;
  height: 90px;
  margin-right: 20px;
}
.musiclist-info {
  overflow: hidden;
}
.musiclist-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}
.musiclist-singer {
  color: #a5a1a1;
  font-size: 12px;
}
.page-list {
  text-align: center;
}
</style>