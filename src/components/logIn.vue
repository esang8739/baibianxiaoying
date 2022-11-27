<template>
  <div
    class="words"
    :style="{
      backgroundImage: 'url(' + backgroundurl + ')',
      backgroundSize: '100% ',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }"
  >
    <div class="mask">
      <van-image
        round
        width="100"
        height="100"
        :src="headurl"
        class="head_photo"
        @click="toPersonal"
      />
      <div class="sentents">{{ pageword }}</div>
      <van-button type="primary" @click="index" class="path_to"
        >Enter</van-button
      >
    </div>
  </div>
</template>

<script>
// import * as dd from "dingtalk-jsapi";
import { getCode } from "../utils/dd";
export default {
  data() {
    return {
      code: "",
      user_id: "391604212425737034",
      pageword: "",
      headurl: "",
      backgroundurl: "",
    };
  },
  created() {
    this.pagewords(); //获取随机文字
    this.backgroundurls(); //背景图片
  },
  mounted() {
    // this.postusercode();
    getCode(async (code) => {
      const { data: res } = await this.$http.post("/login", { code: code });
      this.user_id = res.data.result.userid;
      if (res.code !== 200) {
        return this.$Notify({
          type: "warning",
          message: "服务器繁忙,请稍后重试",
        });
      }
      //通过userid获取用户的信息
      const { data: res1 } = await this.$http.post("/get_user_detail", {
        user_id: res.data.result.userid,
      });
      this.headurl = res1.data.avatar;
    });
  },
  methods: {
    //传递user_id
    index() {
      this.$router.push({ path: `/TranslaMain/${this.user_id}/` });
    },
    //通过随机文字
    async pagewords() {
      const { data: res } = await this.$http.get("/get_words");
      this.pageword = res.data[0].back_words;
      // console.log(res.data[0].back_words);
    },
    //随机获取背景图片
    async backgroundurls() {
      const { data: res } = await this.$http.get("/img");
      this.backgroundurl = res.data[0].pic_url;
    },
    //跳转到用户主页
    toPersonal() {
      this.$router.push({
        name: "HomePerson",
        query: {
          id_user: this.user_id,
        },
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.words {
  height: 100vh;

  img {
    height: 100%; //高度跟随父级改变
    width: 100%; //宽度跟随父级变化
    min-width: 340px;
    // min-height:443px;
    position: relative;
  }
  .mask {
    position: absolute;
    min-width: 300px;
    // min-height:400px;
    top: 50%;
    left: 50%;
    margin-top: -15em;
    margin-left: -9em;
    .head_photo {
      margin-top: 20%;
      margin-left: 32%;
    }
    .sentents {
      color: aliceblue;
      font-size: 19px;
      width: 241px;
      height: 51px;
      margin: 40px auto;
      font-family: "Times New Roman";
    }
    .path_to {
      font-family: "Times New Roman";
      font-size: 19px;
      width: 9rem;
      height: 2rem;
      background-color: rgba(0, 0, 0, 0.3);
      border: rgba(0, 0, 0, 0.2);
      margin-top: 30%;
      margin-left: 25%;
    }
  }
}
</style>
