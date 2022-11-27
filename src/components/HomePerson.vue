<template>
  <div class="pwords">
    <van-nav-bar
      title=""
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class="nav"
    />

    <img :src="this.bgurl" class="imgs1" lazyComponent:true />

    <div class="pmask">
      <van-image round :src="peopleurl" class="phead_photo" />
      <span class="username">{{ username }}</span>
      <div class="English_words" @click="words_list">
        <div class="p1">{{ list.source }}</div>
        <div class="p2">{{ list.target }}</div>
      </div>
      <span class="buttom_sentents">{{ this.sentents }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bgurl: "",
      data: "",
      yonghuid: "",
      username: "",
      peopleurl: "",
      sentents: "",
      list: [{}],
    };
  },
  created() {
    this.bgurls(), this.userinfo(), this.pagesentents();
    this.firstwords();
  },

  methods: {
    //获取用户信息
    async userinfo() {
      // this.yonghuid = this.$router.query.id_user
      const userid = this.$route.query.id_user;
      const { data: res } = await this.$http.post("/get_user_detail", {
        user_id: userid,
      });
      this.username = res.data.name;
      this.peopleurl = res.data.avatar;
    },
    //渲染随机背景图
    async bgurls() {
      const { data: res } = await this.$http.get("/img");
      this.bgurl = res.data[0].pic_url;
    },
    //跳转到单词表
    words_list() {
      this.$router.push("/WordsList");
    },
    //返回到登录页
    onClickLeft() {
      this.$router.push("/login");
    },
    //渲染页面随机句子
    async pagesentents() {
      const { data: res } = await this.$http.get("/get_words");
      this.sentents = res.data[0].back_words;
    },
    //当调用单词本接口的时候先判断用户是否有收藏单词
    async firstwords() {
      const u = this.$route.query.id_user;
      const { data: res } = await this.$http.post("/words", { user_id: u });
      this.list = res.data[0];
    },
  },
};
</script>
<style lang="less" scoped>
.pwords {
  width: 100%;
  height: 100%;

  .imgs1 {
    height: 100%;
    width: 100%;
    position: relative;
    min-width: 280px;
    min-height: 400px;
  }
  .nav {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    // min-width:420px;
  }
  .buttom_sentents {
    color: white;
    font-size: 19px;
    // font-family:"Times New Roman";
    font-family: arial;
  }
  .pmask {
    position: absolute;
    min-width: 300px;
    min-height: 300px;
    top: 50%;
    left: 50%;
    margin-top: -22em;
    margin-left: -9em;
    .phead_photo {
      margin-top: 30%;
      margin-left: 17%;
      display: inline-block;
      width: 60px;
      height: 60px;
    }
    .username {
      color: antiquewhite;
      margin-left: 20px;
      margin-top: 30px;
    }
    .English_words {
      width: 248px;
      height: 258px;
      background-image: url("../assets/imgs/不同字段大小排版/图层\ 7.png");
      filter: opacity(60%);
      margin: 28px 10px;
      text-align: center;
      .p1 {
        display: inline-block;
        width: 120px;
        overflow: auto;
        margin: 50px 50px;
      }
    }
  }
}
</style>
