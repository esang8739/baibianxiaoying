<template>
  <div
    id="bigbox"
    :style="{
      backgroundImage: 'url(' + [imgUrl ? imgUrl : ''] + ')',
      backgroundSize: '100%  ',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }"
  >
    <!-- 上方导航栏 -->
    <nav>
      <!-- <van-button
        id="leftButton"
        type="info"
        icon="arrow-left"
        to="{path:'/TranslaMain',query:{user_id:this.user_id}}"
        >返回</van-button
      > -->
      <van-button id="leftButton" type="info" icon="arrow-left" @click="back"
        >返回</van-button
      >
    </nav>
    <!-- 翻译文本 -->
    <van-field
      class="translatedText"
      v-model="text"
      rows="1"
      autosize
      type="textarea"
    />

    <!-- 功能按钮区 -->
    <div class="botBnt">
      <!-- 复制按钮 -->
      <van-button
        class="tag-read"
        @click="coyp"
        :data-clipboard-text="this.text"
        icon="description"
      ></van-button>
      <!-- 翻译按钮 -->
      <van-button @click="upWord" icon="font-o"></van-button>
    </div>
  </div>
</template>
<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
      user_id: this.$route.query.user_id,
      imgUrl: "", //背景图片
      text: "", //识别文本
    };
  },
  created() {
    this.text = this.$route.params.text;
    this.imgUrl = this.$route.params.imgUrl;
    if (this.imgUrl != "") {
      this.getimg();
    }
  },
  methods: {
    //获取图片信息
    getimg() {
      this.$http.post("/extract_text", { pic_url: this.imgUrl }).then((res) => {
        this.text = res.data.data;
      });
    },
    /* 复制文本 */
    coyp() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", (e) => {
        setTimeout(() => {
          this.$toast("复制成功");
          this.isLoading = false;
          this.count++;
        }, 1000);
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        setTimeout(() => {
          this.$toast("复制失败，浏览器不支持");
          this.isLoading = false;
          this.count++;
        }, 1000);
        // 释放内存
        clipboard.destroy();
      });
    },
    /* 翻译文本 */
    upWord() {
      this.$router.push({
        name: "TranslaMain",
        params: {
          text: this.text,
        },
      });
    },
    //返回界面
    back() {
      this.$router.back(-1);
    },
  },
};
</script>
<style lang="less" scoped>
#bigbox {
  height: 100vh;
}
nav {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 51pt;
  font-weight: 500;
  font-size: 20pt;
  #leftButton {
    position: absolute;
    left: 0px;
    width: 105pt;
    height: 51pt;
    background: none;
    border: none;
    color: #a1a1a1;
    font-weight: 700;
    font-size: 16pt;
    .van-icon {
      margin-right: 15px;
    }
  }
}
.translatedText {
  width: 75%;
  background: rgb(224, 224, 224);
  border-radius: 12px;
  margin: 65% auto;
  padding: 18px;

  .van-field__control {
    font-size: 20px;
    background-color: rgb(224, 224, 224);
  }
}
.botBnt {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 75px;

  .van-button {
    width: 50%;
    height: 100%;
    border: none;
    font-size: 35px;
    background: rgb(224, 224, 224);
  }
}
</style>
