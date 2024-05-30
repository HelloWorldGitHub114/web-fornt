<!-- finished -->
<template>
  <div class="mvdetail">
    <div class="mvright-wrap">
      <h2>MV详情</h2>
      <div class="mvplay-wrap">
        <video :src="mvUrl" controls autoplay></video>
      </div>
      <div class="mv-info">
        <div class="mv-info-head">
          <img class="mvartimg" :src="mvinfos.cover" alt="" />
          <p class="mv-nickname">{{ mvinfos.artistName }}</p>
        </div>
        <div class="mv-name">{{ mvinfos.name }}</div>
        <div class="mv-other">
          <div class="mv-time">发布时间：{{ mvinfos.publishTime }}</div>
          <div class="mv-playcount">播放：{{ mvinfos.playCount }}次</div>
        </div>
        <p class="mv-desc">{{ mvinfos.desc }}</p>
      </div>

      <div class="comment-wrap">
        <div class="comment-container">
          <h2>评论</h2>
          <textarea
            name="comment"
            id="comment"
            cols="200"
            rows="1"
            placeholder="写下你的评论"
          ></textarea>
          <button class="submit-text">发送</button>
        </div>

        <h3 class="comment-title">评论({{ total }})</h3>
        <ul>
          <li class="item" v-for="(item, index) in Comments" :key="index">
            <img :src="item.user.avatarUrl" alt="" class="comment-avatar" />
            <div class="comment-info">
              <div class="comment">
                <span
                  class="comment-user"
                  @click="userDetail(item.user.nickname)"
                  >{{ item.user.nickname }}:</span
                >
                <span class="comment-content">{{ item.content }}</span>
              </div>
              <div
                class="re-comment"
                v-for="(reply, Rindex) in item.beReplied"
                :key="Rindex"
              >
                <span
                  class="comment-user"
                  @click="userDetail(reply.user.nickname)"
                  >{{ reply.user.nickname }}:</span
                >
                <span class="comment-content">{{ reply.content }}</span>
              </div>
              <div class="comment-bottom">
                <p class="comment-time">{{ item.time }}</p>
                <span class="comment-time iconfont icon-dianzan">{{
                  item.likedCount
                }}</span>
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
    <div class="mvleft-wrap">
      <h2>相关推荐</h2>
      <ul class="mv-list">
        <li
          v-for="(item, index) in simiMvs"
          :key="index"
          @click="toMvdetail(item.id)"
        >
          <div class="mvlist-img">
            <img :src="item.cover" alt="" />
            <p class="iconfont icon-play"></p>
          </div>
          <div class="mvlist-info">
            <p class="mvlist-name">{{ item.name }}</p>
            <p class="mvlist-singer">{{ item.artistName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MvDetail",
  data() {
    return {
      total: 0,
      page: 1,
      mvUrl: "",
      simiMvs: [],
      mvinfos: {},
      Comments: [],
    };
  },
  created() {
    //MV播放地址
    axios({
      url: "/mv/url",
      method: "get",
      params: { id: this.$route.query.q },
    }).then((res) => {
      this.mvUrl = res.data.data.url;
    });
    //MV相关推荐
    axios({
      url: "/simi/mv",
      method: "get",
      params: { mvid: this.$route.query.q },
    }).then((res) => {
      this.simiMvs = res.data.data.mvs;
    });
    //MV信息
    axios({
      url: "/mv/detail",
      method: "get",
      params: { mvid: this.$route.query.q },
    }).then((res) => {
      this.mvinfos = res.data.data;
      if (this.mvinfos.playCount > 10000) {
        this.mvinfos.playCount = parseInt(this.mvinfos.playCount / 10000) + "w";
      }
    });
    //获取评论
    this.topCommpent();
  },
  methods: {
    toMvdetail(id) {
      this.$router.push(`/mvdetail?q=${id}`);
      this.$router.go(0);
    },
    topCommpent() {
      //获取评论
      axios({
        url: "/comment/mv",
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
    userDetail(username) {
      this.$router.push(`/userdetail?q=${username}`);
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
.mvdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.mv-info {
  margin: 20px 0;
  align-items: center;
}
.mv-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.mv-info .mv-info-head .mvartimg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.mv-info .mv-info-head .mvtitle {
  font-size: 25px;
  font-weight: bold;
  margin-left: 20px;
}
.mv-info .mv-name {
  font-size: 30px;
  color: #000;
  font-weight: 700;
}
.mv-info .mv-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}
.mv-info .mv-time {
  margin-right: 20px;
}
.mv-info .mv-desc {
  font-size: 14px;
  margin-bottom: 20px;
}
.mvright-wrap {
  width: 800px;
  margin: 10px 30px;
  margin-bottom: 150px;
}
.mvplay-wrap {
  width: 100%;
  height: 390px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.mvplay-wrap video {
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

.comment-container {
  margin-top: 10px;
  width: 80%;
}
.comment-container h2 {
  margin-left: 15px;
}
.comment-container #comment {
  margin-top: 20px;
  font-size: 18px;
  padding: 10px;
  border: 1px solid grey;
  width: 900px;
  /* height: 50px; */
  overflow: hidden;
  resize: none;
}
.comment-container #comment::-webkit-input-placeholder {
  font-size: 14px;
  color: grey;
  font-family: sans-serif;
}
.submit-text {
  width: 100px;
  height: 35px;
  background-color: palevioletred;
  border: 1px solid palevioletred;
  font-size: 18px;
  color: #fff;
  border-radius: 10px;
  margin-top: 10px;
}
.submit-text:hover {
  background-color: pink;
  border: 1px solid pink;
}

.mv-list li {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.mv-list li:hover {
  background-image: linear-gradient(
    to right,
    rgba(255, 192, 203, 0.5),
    rgba(255, 192, 203, 0)
  );
  border-radius: 5px;
}
.mv-list .icon-play::before {
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
.mv-list li:hover p::before {
  opacity: 1;
}
.mvleft-wrap {
  width: 450px;
  margin-left: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
}
.mvlist-img {
  position: relative;
  cursor: pointer;
}
.mvlist-img img {
  width: 150px;
  height: 90px;
  margin-right: 20px;
}
.mvlist-info {
  overflow: hidden;
}
.mvlist-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}
.mvlist-singer {
  color: #a5a1a1;
  font-size: 12px;
}
.page-list {
  text-align: center;
}
</style>