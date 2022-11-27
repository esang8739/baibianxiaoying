<template>
  <div class="mainbox">
    <van-nav-bar
      title="单词表"
      left-text="返回"
      right-text="删除"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="box">
      <div class="danci">
        <div>{{ lists[num].source }}</div>
        <span class="yp">
          <img
            src="../assets/imgs/喇叭.png"
            alt=""
            @click="bofang"
            class="bof" />
          <audio :src="auidosrc" id="yinping" autoplay="autoplay"></audio
        ></span>
      </div>
      <div class="yisi">{{ lists[num].target }}</div>
      <van-button class="next" @click="nextword">下一个</van-button>
    </div>
  </div>
</template>
<script>
import { getCode } from "../utils/dd";

export default {
  data() {
    return {
      source: null,
      num: 0,
      user_id: "",
      words_list: "",
      auidosrc: "",
      data: {
        mean: "1324",
      },
      lists: [{}],
    };
  },
  // created() {
  //   this.getwords();
  // },
  mounted() {
    var that = this;
    // this.postusercode();
    getCode(async (code) => {
      const { data: res } = await this.$http.post("/login", { code: code });
      that.user_id = res.data.result.userid;
      if (res.code !== 200) {
        return this.$Notify({
          type: "warning",
          message: "服务器繁忙,请稍后重试",
        });
      }
      //通过userid获取用户的信息
      const { data: res3 } = await this.$http.post("/words", {
        user_id: res.data.result.userid,
      });
      that.lists = res3.data;

      // const { data: res1 } = await this.$http.post('/get_user_detail', {
      //   user_id: res.data.result.userid
      // })
      //       this.user_id = res.data.
    });
  },

  methods: {
    //音频播放功能
    async bofang() {
      const thisWordId = this.lists[this.num].source;
      await this.$http({
        url: "/sound",
        method: "post",

        headers: {},
        data: {
          text: thisWordId, //接口参数
        },
        responseType: "blob", // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          // 拿到audio组件
          let audfile = document.getElementById("yinping");
          // 指定blob文件格式
          let myblob = new Blob([res.data], { type: "audio/wav" });

          // 通过这个API让语音数据转为成一个url地址
          this.auidosrc = URL.createObjectURL(myblob);
          // 设置audio
          // this.auidosrc = url

          // audfile.src = url;

          audio.load();
          URL.revokeObjectURL(audfile.src); // 释放url
        })
        .catch((err) => {});
    },

    //下一个单词
    nextword() {
      if (this.num < this.lists.length - 1) {
        ++this.num;
      } else if ((this.num = this.lists.length)) {
        this.num = 0;
      }
    },
    //返回到用户页面
    onClickLeft() {
      // this.$router.push("/HomePerson");
      this.$router.back(-1);
    },
    //删除当前单词
    async onClickRight() {
      const thisWordId = this.lists[this.num].source;
      const { data: res } = await this.$http.post("/del_word", {
        user_id: this.user_id,
        source: thisWordId,
      });

      this.$router.go(0);
      // this.getwords();
    },
  },
};
</script>
<style lang="less" scoped>
.mainbox {
  background-color: rgb(242, 242, 242);
  height: 100%;
}
.box {
  width: 287px;
  height: 424px;
  background-color: rgb(255, 255, 255);
  margin: 120px auto;
  text-align: center;
  .danci {
    // display: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    border-style: solid;
    border-color: rgb(51, 161, 248);
    background-color: rgb(51, 161, 248);
    box-shadow: 6px 8px 9px rgb(51, 161, 248);
  }
  .yisi {
    margin-top: 100px;
  }
  .bof {
    margin-top: 40px;
  }
  .next {
    width: 100%;
    margin-top: 200px;
  }
}
</style>
