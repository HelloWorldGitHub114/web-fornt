<template>
  <div class="playlists">
    <div class="top-card-wrap">
      <!-- 封面 -->
      <img :src="topList.coverImgUrl" alt="" class="bg-blur" />
      <div class="top-card">
        <div class="img-wrap">
          <img :src="topList.coverImgUrl" alt="" />
        </div>
        <div class="card-content">
          <div class="card-tag">精品歌单</div>
          <div class="card-title">{{ topList.name }}</div>
          <div class="card-info">{{ topList.description }}</div>
        </div>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-bar">
        <ul>
          <li
            :class="item == tabActive ? 'tab-item active' : 'tab-item'"
            v-for="(item, index) in tabItems"
            :key="index"
            @click="changeActive(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
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
import "../assets/common/tab.css";
export default {
  name: "PlayLists",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 顶部的推荐歌单
      topList: {},
      // 歌单列表
      list: [],
      tabActive: "全部",
      tabItems: [
        "全部",
        "欧美",
        "华语",
        "流行",
        "说唱",
        "摇滚",
        "民谣",
        "电子",
        "轻音乐",
        "影视原声",
        "ACG",
        "怀旧",
      ],
    };
  },
  created(){
    this.topData();
    this.listData();
  },
  methods:{
    topData() {
      axios({
        url: "https://mock.apifox.com/m1/4257489-3899055-default/top/playlist/highquality",
        method: "get",
        params: {
          limit: 1,
          // 分类数据
          cat: this.tabActive,
        },
      }).then((res) => {
        this.topList = res.data.playlists[0];
      });
    },
    listData() {
      axios({
        url: "https://mock.apifox.com/m1/4257489-3899055-default/top/playlist",
        method: "get",
        params: {
          limit: 10,
          // 起始的值：(页码-1)*每页多少条数据
          offset: (this.page - 1) * 10,
          // 分类数据
          cat: this.tabActive,
        },
      }).then((res) => {
        console.log(res.data.playlists);
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
    },
    changeActive(item) {
      this.tabActive = item;
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
      this.topData();
      this.listData();
      // 修改页码为1
      this.page = 1;
    },
  },

};
</script>

<style scoped>
@import "../assets/common/tab.css";
ul {
  list-style: none;
}
.playlists {
  z-index: 12;
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}
.top-card-wrap {
  height: 250px;
  padding: 20px;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.bg-blur {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(20px);
  z-index: 2;
}

.top-card {
  display: flex;
  position: absolute;
  z-index: 3;
}

.img-wrap {
  width: 200px;
  height: 200px;
}

.img-wrap img {
  width: 100%;
  height: 100%;
}

.card-content {
  flex: 1;
  padding: 0 20px;
}

.card-tag {
  padding: 5px;
  width: 100px;
  box-sizing: border-box;
  border: 1px solid #d87093;
  color: palevioletred;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}

.card-title {
  color: #fff;
  margin: 10px 0;
}

.card-info {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  /* color: #888482; */
  color: #e3e3e3;
}

/* tab导航 */
.tab-container {
  margin-top: 20px;
  margin-bottom: 200px;
}

.tab-bar ul {
  height: 25px;
  display: flex;
  justify-content: flex-end;
}

.tab-item {
  margin-left: 20px;
  cursor: pointer;
  font-size: 15px;
  color: grey;
}

.active {
  color: palevioletred;
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