<template>
  <div class="bigBox">
    <!-- 上方导航栏 -->
    <nav>
      <van-button
        v-if="otherButton"
        id="leftButton"
        type="info"
        icon="wap-home"
        @click="back"
      ></van-button>

      <van-button
        v-if="otherButton"
        id="rightButton"
        type="info"
        icon="wap-nav"
        to="#"
        @click="moreFunction"
      ></van-button>
      <!-- 功能区 -->
      <div id="moreFunction" style="z-index: 3">
        <ul>
          <li>
            <van-uploader
              id="uesrphoto"
              :after-read="upPic"
              max-size="10 * 1024 * 1024"
              accept="image/*"
              capture="environment"
              style="display: none"
            />
            <van-button @click="takePhoto"
              ><van-icon name="photograph" />拍照翻译</van-button
            >
          </li>
          <li>
            <van-uploader
              :after-read="afterRead"
              id="takepicture"
              style="display: none"
            />
            <van-button @click="getPhoto"
              ><van-icon name="photo" />图片翻译</van-button
            >
          </li>
          <li>
            <van-button @click="torecord"
              ><van-icon name="underway" />历史记录</van-button
            >
          </li>
        </ul>
      </div>
      <!-- 搜索区域 -->
      <!-- 点击出现搜索框 -->
      <van-button
        icon="search"
        type="primary"
        round
        id="searchButton"
        @click="searchAppear"
        style="
          background: linear-gradient(180deg, #849c92 0%, #9292ad 100%);
          border: none;
        "
      />
      <van-form action="/" id="search" v-show="searchWord">
        <van-search
          v-model="searchValue"
          show-action
          placeholder="输入单词或句子进行查询"
          @search="onSearch"
          @cancel="onCancel"
        />
      </van-form>
    </nav>
    <!-- 下方主区域 -->
    <div class="mainInfamation">
      <div class="Conversation" id="chatContainer">
        <!-- 循环渲染后台反回的用户记录 -->
        <div
          :class="[item.status == ' 1  ' ? 'sayChinese' : 'sayEnglish']"
          v-for="item in list"
          :key="item.id"
        >
          <!-- 播放按钮 -->
          <audio
            id="aud"
            ref="audio"
            controls="controls"
            autoplay
            style="display: none"
          ></audio>
          <span @click="more(item.id)"
            ><van-button
              talkMore
              v-if="item.status == '0'"
              icon="volume"
              @click="speak(item.status == '1' ? item.target : item.source)"
            >
            </van-button
            ><span>{{ item.source }}</span
            ><van-button
              v-if="item.status == '1'"
              icon="volume"
              @click="speak(item.status == '1' ? item.target : item.source)"
            >
            </van-button
            ><br /><span>{{ item.target }}</span></span
          >
          <div :id="item.id" class="dd">
            <ul id="talkMore" :class="item.id">
              <li @click="delWord(item.id)">
                <van-icon name="delete" /><br />删除
              </li>
              <li
                class="tag-read"
                :data-clipboard-text="
                  item.status == '1' ? item.target : item.source
                "
                @click="copy"
              >
                <van-icon name="column" /><br />复制
              </li>
              <li :id="item.source" @click="collWord(item.target, item.source)">
                <van-icon name="star" /><br /><span>收藏</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 录音输入进行搜索 -->
      <div class="boxButton">
        <button
          class="saybutton"
          id="chButton"
          @touchstart="touchstart"
          @touchend="cntouchend"
          @touchmove="touchmove"
        >
          <van-icon style="transform: rotateY(180deg)" name="chat" />{{
            btRecoding ? "松开结束" : "长按识别中文"
          }}</button
        ><button
          class="saybutton"
          id="enButton"
          @touchstart="touchstart"
          @touchend="entouchend"
          @touchmove="touchmove"
        >
          {{ btRecoding ? "松开结束" : "长按识别英文" }}<van-icon name="chat" />
        </button>
        <div class="shade" v-if="btRecoding">
          <div class="blackBoxSpeak" v-if="blackBoxSpeak">
            <div>
              <img src="../assets/images/ic_record.gif" />
            </div>
            <div class="blackBoxSpeakConent">手指上划，取消录制</div>
          </div>
          <div class="blackBoxPause" v-else>
            <img src="../assets/images/ic_release_to_cancel.png" />
            <div
              class="blackBoxSpeakConent"
              style="
                background: linear-gradient(90deg, #849c92 0%, #9292ad 100%);
              "
            >
              松开手指，取消录制
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import Recorder from "js-audio-recorder";
var flag = true;
export default {
  name: "",
  data() {
    return {
      user_id: "", //用户登陆id
      searchValue: "", //搜索框内容
      status: "", //搜索框提交内容属性
      text: "", //图片文字搜索
      isLoading: false, //控制弹窗
      list: [], //查询记录列表
      collList: [], //收藏列表
      loop: "",
      btRecoding: false, //开始说话控制组件
      blackBoxSpeak: false, //结束说话控制组件
      startY: "", //手指按下时Y轴数据
      timeOutEvent: 0, //鼠标移出位置识别
      recorder: null, //录音功能实例
      searchWord: false, //搜索框控制
      otherButton: true, //其他按钮
    };
  },

  /* 生命周期事件 */
  created() {
    this.user_id = this.$route.params.user_id;
    //this.user_id = this.$route.query.user_id;
    this.text = this.$route.params.text;
    this.recorder = new Recorder();
    if (this.text != "") {
      this.onSearch();
    }
    this.getUserTalk(); //用户搜索记录获取
  },

  watch: {
    //监听数据(list)变量的变化，视图滚动
    list() {
      this.$nextTick(() => {
        var container = this.$el.querySelector("#chatContainer");
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  methods: {
    //获取用户聊天框内容
    async getUserTalk() {
      const { data: res } = await this.$http.post("/show_search", {
        user_id: this.user_id,
      });
      this.list = res.data;
      this.getUserColl(); //用户收藏记录获取
    },
    //点击出现搜索框
    searchAppear() {
      if (this.searchWord) {
        this.searchWord = false;
      } else {
        this.searchWord = true;
      }
      if (this.otherButton) {
        this.otherButton = false;
      } else {
        this.otherButton = true;
      }
    },
    //返回按钮
    back() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.back(-1);
      }
    },
    //跳转拍照记录页面
    torecord() {
      this.$router.push({
        path: "/Record",
        query: {
          user_id: this.user_id,
        },
      });
    },
    //获取相册图片
    getPhoto() {
      document.getElementById("moreFunction").style.display = "none"; //关闭更多功能界面
      document.getElementById("takepicture").click();
    },
    //提交图片获得图片单词
    afterRead(file) {
      var data = new FormData();
      data.append("file", file.file);
      data.append("user_id", this.user_id);
      let config = {
        headers: {
          //添加请求头
          "Content-Type": "multipart/form-data",
        },
      };
      this.$http
        .post("/upload_photo", data, config)
        .then((res) => {
          var url = res.data.data;
          this.$http
            .post("/extract_text", {
              pic_url: url,
            })
            .then((result) => {
              this.text = result.data.data;
              this.$router.push({
                name: "getWord",
                params: {
                  user_id: this.user_id,
                  text: this.text,
                  imgUrl: url,
                },
              });
            });
        })
        .catch((err) => {});
    },
    //拍照搜索
    takePhoto() {
      document.getElementById("moreFunction").style.display = "none"; //关闭更多功能界面
      document.getElementById("uesrphoto").click();
    },
    //唤醒相机图片获取并处理
    upPic(file) {
      this.afterRead(file);
    },
    //获取用户收藏信息
    async getUserColl() {
      const { data: result } = await this.$http.post("/words", {
        user_id: this.user_id,
      });
      this.collList = result.data;
      this.collword();
    },
    //比对单词，渲染搜藏图标
    collword() {
      this.list.forEach((item1) => {
        //获取收藏图标
        var coll = document.getElementById(item1.source);
        this.collList.forEach((item2) => {
          if (item1.source == item2.source) {
            //更改收藏图标文字的颜色
            coll.lastChild.innerText = "已收藏";
            coll.style.color = "red";
          }
        });
      });
    },
    // 更多功能点击
    moreFunction() {
      if (flag == true) {
        flag = false;
        var box = document.getElementById("moreFunction");
        box.style.display = "block";
      } else {
        flag = true;
        var box = document.getElementById("moreFunction");
        box.style.display = "none";
      }
    },
    //查询记录处理
    more(key) {
      //排他思想，关闭所有功能div
      this.list.forEach((item) => {
        document.getElementById(item.id).style.display = "none";
      });
      //控制选定div
      if (flag) {
        var dd = document.getElementById(key);
        dd.style.display = "block";
        flag = "";
      } else {
        var dd = document.getElementById(key);
        dd.style.display = "none";
        flag = true;
      }
    },
    //复制按钮
    copy() {
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
    /* 点击收藏或删除收藏信息 */
    async collWord(colTarget, colSource) {
      const { data: result } = await this.$http.post("/wjh_check", {
        user_id: this.user_id,
        source: colSource,
      });
      if (result.data) {
        this.$http.post("/del_word", {
          user_id: this.user_id,
          source: colSource,
        });
        // 获取收藏图标
        const coll = document.getElementById(colSource);
        //更改收藏图标文字
        coll.lastChild.innerText = "收藏";
        coll.style.color = "black";
      } else {
        this.$http.post("/collect", {
          user_id: this.user_id,
          source: colSource,
          target: colTarget,
        });
        // 获取收藏图标
        const coll = document.getElementById(colSource);
        //更改收藏图标文字
        coll.lastChild.innerText = "已收藏";
        coll.style.color = "red";
      }
    },
    /* 删除单词记录 */
    async delWord(id) {
      const { data: res } = await this.$http.post("/delete", {
        user_id: this.user_id,
        id: id,
      });
      if (res.code == "200") {
        setTimeout(() => {
          this.$toast("删除成功");
          this.isLoading = false;
          this.count++;
        }, 1000);
      } else {
        setTimeout(() => {
          this.$toast("删除失败");
          this.isLoading = false;
          this.count++;
        }, 1000);
      }
      this.getUserTalk();
    },
    /* 朗读文字 */
    speak(targetText) {
      this.$http({
        url: "/sound",
        method: "post",

        headers: {},
        data: {
          text: targetText, //接口参数
        },
        responseType: "blob", // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          /* 拿到audio组件 */
          let audfile = document.getElementById("aud");
          /* 指定blob文件格式 */
          var myblob = new Blob([res.data], { type: "wav/audio" });
          /* 通过这个API让语音数据转为成一个url地址 */
          let url = URL.createObjectURL(myblob);
          /* 设置audio */
          audfile.src = url;
          audio.load(); //音频文件重加载
          URL.revokeObjectURL(audfile.src); /* 释放url */
        })
        .catch((err) => {});
    },
    /* 搜索单词 */
    async onSearch() {
      if (this.text) {
        var val = this.text;
      } else {
        var val = this.searchValue;
      }
      //正则判断
      if (
        //仅能全为字母或者英文符号
        /^[A-Za-z\s\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]+$/.test(
          val
        )
      ) {
        this.searchStatus = "0";
        const { data: res } = await this.$http.post("/search_translate", {
          text: val,
          status: this.searchStatus,
          user_id: this.user_id,
        });
        if (res.code == "200") {
          this.getUserTalk();
          /* 清空数据 */
          this.searchValue = "";
          this.text = "";
        }
      } else if (
        //仅能全为中文或者中文符号
        /^[\u4e00-\u9fa5\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/.test(
          val
        )
      ) {
        this.searchStatus = "1";
        const { data: res } = await this.$http.post("/search_translate", {
          text: val,
          status: this.searchStatus,
          user_id: this.user_id,
        });
        if (res.code == "200") {
          this.getUserTalk();
          /* 清空数据 */
          this.searchValue = "";
          this.text = "";
        }
      } else {
        setTimeout(() => {
          this.$toast("仅能翻译全为中文或者英文");
        }, 1000);
        return (this.searchValue = "");
      }
    },
    /* 清除搜索框数据 */
    onCancel() {
      this.searchValue = "";
    },
    /* 语音识别开始 */
    // 手指开始触发
    touchstart(e) {
      this.blackBoxSpeak = true;
      this.startY = e.clientY;
      // 长按1000毫秒后执行
      this.timeOutEvent = setTimeout(() => {
        this.startRecord();
      }, 500);
      return false;
    },
    // 长按超过1000毫秒,进行录音
    startRecord() {
      this.btRecoding = true;
      this.recorder = new Recorder();
      Recorder.getPermission().then(
        () => {
          //点击录音按钮获取权限，也可在created里进入页面就获取录音权限
        },
        (error) => {
          console.log(`${error.name} : ${error.message}`);
        }
      );

      // 开始录音
      this.recorder.start().then(
        () => {},
        (error) => {
          // 出错了
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    // 短按
    startRecordClick() {
      this.blackBoxSpeak = true;
      this.$toast("说话时间太短了");
    },
    // 滑动触发
    touchmove(e) {
      const endY = e.clientY;
      if (this.startY < endY) {
        this.blackBoxSpeak = true;
      } else {
        this.blackBoxSpeak = false;
        this.recorder.stop();
        // // 关闭并销毁录音实例;
        this.recorder.destroy();
        this.timer = null;
      }
    },
    // 手指离开屏幕触发（中译英）
    cntouchend() {
      this.recorder.stop(); //停止录音
      this.status = "1";
      var _this = this;
      clearTimeout(this.loop);
      clearTimeout(this.timeOutEvent);
      if (_this.timeOutEvent == 0) {
        this.startRecordClick();
      } else {
        this.btRecoding = false;
        // 长按结束调用保存录音或者其实事件
        // 获取录音结果
        var wavBlob = this.recorder.getWAVBlob();
        // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
        const newbolb = new Blob([wavBlob], { type: "audio/x-wav" });
        //获取当时时间戳作为文件名
        const fileOfBlob = new File([newbolb], new Date().getTime() + ".wav");
        // 创建一个data对象
        var data = new FormData();
        data.append("file", fileOfBlob);
        data.append("user_id", this.user_id);
        data.append("status", this.status);
        let config = {
          headers: {
            //添加请求头
            "Content-Type": "multipart/form-data",
          },
        };
        this.$http.post("/speak", data, config).then(
          (res) => {
            if (res.data.code) {
              // 关闭并销毁录音实例
              this.recorder.destroy();
              this.timer = null;
              this.getUserTalk(); //用户搜索记录获取
            }
          },
          (err) => {
            this.$toast("识别失败，请重试");
          }
        );
      }
    },
    // 手指离开屏幕触发（英译中）
    entouchend() {
      this.recorder.stop(); //停止录音
      this.status = "0";
      var _this = this;
      clearTimeout(this.loop);
      clearTimeout(this.timeOutEvent);
      if (_this.timeOutEvent == 0) {
        this.startRecordClick();
      } else {
        this.btRecoding = false;
        // 长按结束调用保存录音或者其实事件
        // 获取录音结果
        var wavBlob = this.recorder.getWAVBlob();
        // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
        const newbolb = new Blob([wavBlob], { type: "audio/x-wav" });
        //获取当时时间戳作为文件名
        const fileOfBlob = new File([newbolb], new Date().getTime() + ".wav");
        // 创建一个data对象
        var data = new FormData();
        data.append("file", fileOfBlob);
        data.append("user_id", this.user_id);
        data.append("status", this.status);
        let config = {
          headers: {
            //添加请求头
            "Content-Type": "multipart/form-data",
          },
        };
        this.$http.post("/speak", data, config).then(
          (res) => {
            if (res.data.code) {
              // 关闭并销毁录音实例
              this.recorder.destroy();
              this.timer = null;
              this.getUserTalk(); //用户搜索记录获取
            }
          },
          (err) => {
            this.$toast("识别失败，请重试");
          }
        );
      }
    },
  },
};
</script>
<style lang="less" scoped>
.bigBox {
  width: 100%;
  height: 100%;
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

  #moreFunction {
    position: absolute;
    top: 60px;
    right: 12px;
    display: none;
    width: 161px;
    height: 180px;
    box-shadow: 0px 5px 20px -2px rgba(0, 0, 0, 0.16);
    z-index: 1;
    background: #fff;
    border-radius: 15px;
    .van-button {
      height: 58px;
      width: 100%;
      border-bottom: 1px solid rgb(235, 235, 235);
      text-align: center;
      line-height: 60px;
      color: rgb(78, 78, 78);
      font-size: 16pt;
      border: none;

      .van-icon {
        margin-right: 8px;
      }
    }
  }
}

.van-search--show-action {
  height: 36pt;
  margin: 10px 0px;
  .van-search__content {
    ::placeholder {
      font-size: 12px;
    }
  }
  .van-search__action {
    font-size: 14px;
  }
}
.Conversation {
  background: #fff;
  height: 450pt;
  overflow: auto;
  padding: 15px 25px;
  margin-bottom: 12px;
  > div {
    position: relative;
    > span {
      display: block;
      font-size: 14pt;
      line-height: 18pt;
      padding: 16pt 30pt;
      margin: 8px 0;
      background: #f7f8fa;
      box-shadow: 0px 5px 20px -2px #c6c5c5;
    }
  }

  .sayChinese {
    position: relative;
    margin: 10px;
    ul {
      position: absolute;
      left: 0px;
    }
    .van-button {
      border: none;
      background: transparent;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .sayChinese > span {
    position: relative;
    display: inline-block;
    border-radius: 5pt 5pt 5pt 0;
    background: linear-gradient(90deg, #849c92 0%, #cbd6cc 100%);
  }
  .sayEnglish {
    position: relative;
    margin: 10px;
    text-align: right;
    ul {
      position: absolute;
      right: 0px;
    }
    .van-button {
      border: none;
      background: transparent;
      transform: rotate(0.5turn);
      position: absolute;
      top: 5px;
      left: 0px;
    }
  }
  .sayEnglish > span {
    position: relative;
    display: inline-block;
    border-radius: 5pt 5pt 0 5pt;
    background: linear-gradient(90deg, #c5c7e2 0%, #9292ad 100%);
  }
  .dd {
    display: none;
    transition: all 0.8s;
    #talkMore {
      width: 174px;
      height: 54px;
      background: #f7f8fa;
      box-shadow: 0px 5px 20px -2px rgb(155, 155, 155);
      border-radius: 15px;
      text-align: center;
      z-index: 2;
      li {
        font-size: 15px;
        display: inline-block;
        margin: 5px 10px;
        text-align: center;
        transition: color 0.8s;
        .van-icon {
          font-size: 25px;
        }
      }
    }
  }
}
.boxButton {
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: center;
  border-top: 10px solid #e5e5e5;
  align-items: center;
  width: 100%;
  height: 10vh;
  background: #fff;
  //麦克风弹窗
  .shade {
    z-index: 3;
    position: absolute;
    top: -231px;
    width: 75%;
    img {
      width: 80px;
      height: 115px;
    }
    .blackBoxSpeak,
    .blackBoxPause {
      border-radius: 15px, 15px 0 0;
      background-color: rgba(201, 201, 201, 0.8);
      padding: 32px;
      border-radius: 50px 50px 0 0;
      position: relative;
      text-align: center;
    }
    .blackBoxSpeakConent {
      color: rgb(0, 0, 0);
      text-align: center;
      font-size: 18px;
      padding: 12px 0;
      width: 100%;
      margin: auto;
      border-radius: 16px;
    }
  }
  .saybutton {
    z-index: 10;
    width: 170px;
    height: 56px;
    border: none;
    font-size: 17px;
    font-weight: 600;
  }
  #chButton {
    border-radius: 30px 0px 0px 30px;
    text-align: right;
    border-right: 1px solid #ffffff;
    background: linear-gradient(90deg, #849c92 0%, #cbd6cc 100%);
  }
  #enButton {
    border-radius: 0px 30px 30px 0px;
    text-align: left;
    background: linear-gradient(90deg, #c5c7e2 0%, #9292ad 100%);
  }
  .van-icon {
    margin: 0 10px;
    font-size: 24px;
    vertical-align: bottom;
  }
}
</style>
