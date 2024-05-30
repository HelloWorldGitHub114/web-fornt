<template>
  <div class="userdetail">
    <div class="user-wrap">
      <h2>用户详情</h2>
      <div class="user-info">
        <div class="user-info-head">
          <img class="userpicture" src="http://dummyimage.com/100x100" alt="" />
          <div class="user-name">name</div>
        </div>
        <div class="user-other">
          <div class="user-time">地 区：陕西省</div>
          <div class="user-playcount">听歌：count次</div>
        </div>
        <p class="user-desc">个人简介</p>
      </div>

      <h2>TA创建的歌单</h2>
      <div class="tab-content">
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
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
export default {
  name: "UserDetail",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单列表
      list: [],
    };
  },
  created() {
    this.listData();
  },
  methods: {
    listData() {
      axios({
        url: "/top/playlist",
        method: "get",
        params: {
          limit: 10,
          // 起始的值：(页码-1)*每页多少条数据
          offset: (this.page - 1) * 10,
          //   id:this.$route.query.q
        },
      }).then((res) => {
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      this.page = val;
      this.listData();
    },
    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },
  },
  watch: {
    tabActive() {
      this.listData();
      this.page = 1;
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
.user-info .user-time {
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
.tab-content {
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
  /* border-top-left-radius: 10px;
      border-top-right-radius: 10px; */
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
  /* opacity: 1; */
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