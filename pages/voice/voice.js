var app = getApp(),
recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:false,
    isDot: "block",
    isTouchStart: false,
    isTouchEnd: false,
    value: '100',
    touchStart:0,
    touchEnd:0,
    textOriginal:"请问需要分类的垃圾是？",
    textSucceedBaidu:'',
    textSucceedList:'',
    filePath:'',
    size:0,
    say:'',
    result:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.authorize({
      scope: "scope.record",
      success: function() {
        console.log("录音授权成功");
      },
      fail: function() {
        console.log("录音授权失败");
      }
    })
    // , that.onShow()

  },
  // 点击录音按钮
  onRecordClick: function () {
    wx.getSetting({
      success: function (t) {
        console.log(t.authSetting), t.authSetting["scope.record"] ? console.log("已授权录音") : (console.log("未授权录音"),
          wx.openSetting({
            success: function (res) {
              console.log(res.authSetting);
            }
          }));
      }
    });
  },
  /**
   * 开始录音
   */
  recordStart: function(e) {
    var that = this;
    const options = {
      duration: 60000,
        sampleRate: 8000,
        numberOfChannels: 1,
        encodeBitRate: 24000,
        format: 'mp3'
        // frameSize: 50 
       }
    recorderManager.start(options),
     that.setData({
      touchStart: e.timeStamp,
      isTouchStart: true,
      isTouchEnd: false,
      showPg: true,
    })
    var a = 15, o = 10;
    this.timer = setInterval(function () {
      that.setData({
        value: that.data.value - 100 / 1500
      }), 
      (o += 10) >= 1e3 && o % 1e3 == 0 && (a-- , console.log(a), a <= 0 && (recorderManager.stop(),
        clearInterval(that.timer),
         that.animation2.scale(1, 1).step(),
          that.setData({
          animationData: that.animation2.export(),
        showPg: false,
        })));
    }, 10);
  },
  /**
   * 结束录音
   */
  recordStop: function(e) {
    recorderManager.stop(),
     this.setData({
      isTouchEnd: true,
      isTouchStart: false,
      touchEnd: e.timeStamp,
      showPg: false,
      value: 100
    }), 
    clearInterval(this.timer);
    this.stop()
  },
  /*
  *上传录音
  */
  stop:function(){ 
    var that = this
    recorderManager.onStop(function(res) {
      console.log(res);
      that.setData({
        filePath:res.tempFilePath,
      })

    wx.showLoading({
      title: "正在识别..."
    })
    
   //上传录音
   wx.uploadFile({
    url: "http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/weChat/mp3",
    // url:"http://localhost:8010/weChat/mp3",
    filePath: res.tempFilePath,
    name:"file",//后台要绑定的名称
    header: {
      "Content-Type": "multipart/form-data"
    },
    success:function(ress){
      console.log('上传成功')
      wx.hideLoading(),
      console.log(ress)
      //这里写返回调用接口的逻辑
      that.setData({
        isSuccess:true,
        // result:ress.data.data
      })
      let r=ress.data;
      console.log(r);
      // wx.navigateTo({
      //   url: '../word/word?data='+r,
      // })
      that.getResult(r);
      
    },
    fail: function(res){

      console.log(res);
      wx.hideLoading()
    }
  })
 
  })
},
  /*
  *调用垃圾分类接口
  */
  getResult:function(word){
    var that=this;
    console.log('我执行到这了')
    var that=this;
    that.setData({
      textSucceedBaidu:word
    })
    console.log(word);
    if(word == "无法识别")
    return
    console.log(that.isSuccess)

    wx.request({
      url: 'https://api.tianapi.com/txapi/lajifenlei/index?key=b5bdaa3c32ad0071d14a9129e7ff8f15&word='+word+'&num=1',
      success:function(res){
        if(res.data.code==250){
            that.setData({
             textSucceedList:"尚未无垃圾分类信息"
            })
        }
        else if(res.data.code==200){
          console.log(res);
        that.setData({
          textSucceedList:res.data.newslist[0].name
         })
        }
        else{
          that.setData({
            textSucceedBaidu:"网络开小差啦"
          })
        }
      }
    })
  }
})