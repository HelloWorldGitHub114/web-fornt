<!-- 当前后端的UserDetail使用id查询的 -->
<!-- Todo：接口修改 -->
<template>
  <div class="userdetail">
    <div class="user-wrap">
      <h2>用户详情</h2>
      <div class="user-info">
        <div class="user-info-head">
          <img class="userpicture" :src="user.avatar" alt="" />
          <div class="user-name">{{ user.nickname }}</div>
        </div>
        <div class="user-other">
          <div class="user-location">地 区：{{ user.location }}</div>
        </div>
        <p class="user-desc">个性签名：{{ user.introduction }}</p>
      </div>

      <h2>TA创建的歌单</h2>
      <div class="list-content">
        <div class="songs-wrap">
          <div class="list">
            <ul>
              <li
                class="iconfont icon-play"
                v-for="(item, index) in list"
                :key="index"
                @click="playListDetail(item.id)"
              >
                <p class="first-p">播放量：{{ item.playCount }}</p>
                <img :src="item.coverImgUrl" alt="" />
                <p class="last-p">{{ item.name }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="page-list">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          :current-page="page"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>

      <h2>TA收藏的歌单</h2>
      <div class="list-content">
        <div class="songs-wrap">
          <div class="list">
            <ul>
              <li
                class="iconfont icon-play"
                v-for="(item, index) in listlike"
                :key="index"
                @click="playListDetail(item.id)"
              >
                <p class="first-p">播放量：{{ item.playCount }}</p>
                <img :src="item.coverImgUrl" alt="" />
                <p class="last-p">{{ item.name }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="page-list">
        <el-pagination
          @current-change="handleCurrentChangeLike"
          :page-size="10"
          :current-page="pagelike"
          layout="prev, pager, next"
          :total="totallike"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
export default {
  name: "UserDetail",
  data() {
    return {
      // 创建歌单总条数
      total: 0,
      // 创建页码
      page: 1,
      // 创建歌单列表
      list: [],
      totallike: 0,
      pagelike: 1,
      listlike: [],
      user: {
        avatar: "",
        username: "",
        nickname: "",
        location: "",
        introduction: "",
      },
    };
  },
  created() {
    this.listData();
  },
  methods: {
    listData() {
      //获取用户对象
      axios({
        url: `/user/detail/${this.$route.query.q}`,
        method: "get",
      }).then((res) => {
        this.user = res.data.data;
      });
      //获取用户创建的歌单
      axios({
        url: "/top/playlist",
        // url: `/songList/detail-userId/${this.$route.query.q}`
        method: "get",
        params: {
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
      //获取用户收藏的歌单
      axios({
        url: "/top/playlist",
        // url: `/songList/detail-userId/${this.$route.query.q}`
        method: "get",
        params: {
          limit: 10,
          offset: (this.pagelike - 1) * 10,
        },
      }).then((res) => {
        this.listlike = res.data.playlists;
        this.totallike = res.data.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.listData();
    },
    handleCurrentChangeLike(val) {
      this.pagelike = val;
      this.listData();
    },
    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },
  },
};
</script>
  
<style scoped>
ul {
  list-style: none;
}
.userdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.user-info {
  margin: 20px 0;
  align-items: center;
}
.user-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.user-info .user-info-head .userpicture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-info .user-name {
  font-size: 20px;
  color: #000;
  font-weight: 700;
}
.user-info .user-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}
.user-info .user-location {
  margin-right: 20px;
}
.user-info .user-desc {
  font-size: 14px;
  margin-bottom: 20px;
}
.user-wrap {
  width: 800px;
  margin: 10px 30px;
  margin-bottom: 150px;
}
.list-content {
  margin-top: 20px;
}

.songs-wrap .list ul {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.songs-wrap .list li {
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
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  padding: 5px;
  box-sizing: border-box;
  transform: translateY(-100%);
  transition: 0.5s;
}

.list li::before {
  content: "\ea42";
  position: absolute;
  bottom: 25px;
  right: 5px;
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

.list li:hover .first-p {
  transform: translateY(0);
}

.list li:hover::before {
  opacity: 1;
}

.songs-wrap ul img {
  width: 100%;
  border-radius: 5px;
}

.songs-wrap ul .last-p {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0;
}
.page-list {
  margin: 10px;
  margin-bottom: 100px;
  text-align: center;
}
</style>