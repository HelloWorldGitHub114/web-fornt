<template>
  <div class="searchresult">
    <div class="result-top-info">
      <h2>{{ reqmusic }}</h2>
      <span>共找到{{ total }}个结果</span>
    </div>
    <!-- tab切换 -->
    <div class="tab-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane label="歌曲" name="first">
          <div class="songs-table">
            歌曲搜索结果
          </div>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="second">
          <div class="songs-wrap">
            歌单搜索结果
          </div>
        </el-tab-pane>
        <el-tab-pane label="MV" name="third">
          MV搜索结果
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        class="page-list"
        @current-change="handleCurrentChange"
        :current-page="page"
        layout="prev, pager, next"
        :total="total"
        :page-size="20"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SearchResult",
  data() {
    return {
      activeName: "first",
      page: 1,
      // 歌曲列表
      songList: [],
      // 歌单列表
      playList: [],
      // MV列表
      mvList: [],
      total: 0,
      tag: 1,
      reqmusic: "",
    };
  },
  methods: {
    handleClick(name) {
      if (name == "first") {
        this.tag = 1;
      } else if (name == "second") {
        this.tag = 1000;
      } else if (name == "third") {
        this.tag = 1004;
      }
    },
    playMusic(row) {
      let id = row.id;
      axios({
        url: "#",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        console.log(row);
        this.$parent.$data.musicinfo = row;
        this.$parent.$data.musicurl = res.data.data[0].url;
      });
    },
    musicLists() {
      // 搜索接口
    },

    // 页码发生了改变
    handleCurrentChange(val) {
      this.page = val;
      this.musicLists();
    },

    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },

    toMvdetail(id) {
      this.$router.push(`/mvdetail?q=${id}`);
    },
  },
  created() {
    this.reqmusic = this.$route.query.q;
    this.musicLists();
  },
  watch: {
    tag() {
      this.musicLists();
    },
    $route(newVal) {
      this.reqmusic = newVal.query.q;
      this.total = 0;
      this.page = 1;
      this.musicLists();
    },
  },
};
</script>

<style scoped>

</style>