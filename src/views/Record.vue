<template>
  <div class="bigbox">
    <!-- 上方导航栏 -->
    <nav>
      <van-button
        id="leftButton"
        type="info"
        icon="arrow-left"
        @click="backindex"
        >返回</van-button
      >
      <span>历史记录</span>
      <van-button
        id="rightButton"
        type="info"
        icon="delete-o"
        @click="delImg"
      ></van-button>
    </nav>
    <!-- 历史记录页面 -->
    <div class="record">
      <div
        class="recordImg"
        v-for="item in imglist"
        :key="item.id"
        @click="searchImg(item.pic_url)"
      >
        <!-- 图片懒加载，避免图片过多造成卡顿 -->
        <img :src="item.pic_url" alt="" v-lazy="item.pic_url" />
        <span style="font-size: 16px; color: #909399">点击查看结果</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user_id: "", //用户登陆id
      imglist: [], //历史记录图片列表
    };
  },
  created() {
    // this.user_id = this.$route.query.user_id;

    this.getRecord();
  },
  methods: {
    backindex() {
      this.$router.back(-1);
    },
    //获取历史图片记录
    async getRecord() {
      this.user_id = this.$route.query.user_id;
      const { data: res } = await this.$http.post("/get_pics", {
        user_id: this.user_id,
      });
      this.imglist = res.data;
    },
    //再次搜索图片
    searchImg(imgUrl) {
      this.$router.push({
        name: "getWord",
        params: {
          imgUrl: imgUrl,
        },
      });
    },
    //删除记录
    delImg() {
      this.user_id = this.$route.query.user_id;
      this.$http
        .post("/del_pics", { user_id: this.user_id })
        .then((res) => {
          if ((res.data.code = 200)) {
            this.$toast("删除搜索记录成功！");
            this.getRecord();
          } else {
            this.$toast("删除记录失败");
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="less" scoped>
.bigBox {
  width: 100%;
  background: #e5e5e5;
}
nav {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 51pt;
  background: #fff;
  color: #2c2c2c;
  font-weight: 500;
  font-size: 20pt;
  #leftButton {
    position: absolute;
    left: 0px;
    width: 105pt;
    height: 51pt;
    background: none;
    border: none;
    color: #2c2c2c;
    font-weight: 700;
    font-size: 16pt;
    .van-icon {
      margin-right: 15px;
    }
  }
  #rightButton {
    position: absolute;
    right: 0px;
    width: 63pt;
    height: 51pt;
    background: none;
    border: none;
    color: #2c2c2c;
    font-weight: 700;
    font-size: 20pt;
  }
}
.record {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.recordImg {
  width: 85%;
  height: 215px;
  margin-top: 12px;
  padding: 15px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    margin-bottom: 6px;
  }
}
</style>
