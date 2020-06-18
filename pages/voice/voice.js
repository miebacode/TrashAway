var app = getApp(),
recorderManager = wx.getRecorderManager();
//引入插件：微信同声传译

const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:false,
    isDot: "block",
    isTouchStart: false,
    isTouchEnd: false,
    isUploadSucceed:false,
    value: '100',
    textOriginal:"请问需要分类的垃圾是？",
    textSucceedBaidu:'',
    textSucceedList:'',
    src:'',
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
  onReady:function(){
     //创建内部 audio 上下文 InnerAudioContext 对象。 
     this.innerAudioContext = wx.createInnerAudioContext();    
     this.innerAudioContext.onError(function (res) {     
        console.log(res);      
        wx.showToast({        
          title: '语音播放失败',       
           icon: 'none',      
          })    
        }) 
        


  },
  // 文字转语音  
  wordYun:function (e) {    
    var that = this;    
    var content = this.data.textSucceedBaidu+this.data.textSucceedList;    
    plugin.textToSpeech({      
      lang: "zh_CN",      
      tts: true,      
      content: content,      
      success: function (res) {        
        console.log(res);        
        console.log("succ tts", res.filename);        
        that.setData({          
          src: res.filename        
        })        
        that.yuyinPlay();       
      },      
      fail: function (res) {        
        console.log("fail tts", res)      
      }    
    })  },   
     //播放语音 
      yuyinPlay: function (e) {    
        if (this.data.src == '') {      
          console.log(暂无语音);      
          return;    
        }    
        this.innerAudioContext.src = this.data.src 
        //设置音频地址    
        this.innerAudioContext.play(); 
        //播放音频  
      },  
       // 结束语音  
       end: function (e) {    
         this.innerAudioContext.pause();//暂停音频  
        },

  // 点击录音按钮
  onRecordClick: function () {
    let that = this
    that.setData({
      isUploadSucceed :false
    })
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
        sampleRate: 8000,
        numberOfChannels: 1,
        encodeBitRate: 24000,
        format: 'mp3'
       }
    recorderManager.start(options),
     that.setData({
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
         that.recordStop()
        ));
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
    wx.showLoading({
      title: "正在识别..."
    })
   
   //上传录音
   wx.uploadFile({
     url: "http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/weChat/mp3",
    filePath: res.tempFilePath,
    name:"file",//后台要绑定的名称
    header: {
      "Content-Type": "multipart/form-data"
    },
    success:function(ress){
      console.log('上传成功')
      console.log(ress)
      //这里写返回调用接口的逻辑
      if(ress.data.length>50){
        that.setData({
          isSuccess:true,
          isUploadSucceed:true,
          textSucceedBaidu:"对不起，我没听清楚",
          textSucceedList:""
        })
        wx.hideLoading()
        return
      }
      that.setData({
        isSuccess:true,
        isUploadSucceed:true
      })
      that.getResult(ress.data);
      
    },
    fail: function(res){

      console.log(res);
      wx.hideLoading()
      wx.showToast({
        title:'语音识别失败',
        icon:"none"
      }) 
    },
    complete:function(res){
      if(!that.data.isUploadSucceed){
        console.log(res);
        wx.hideLoading()
        wx.showToast({
          title:'语音识别失败',
          icon:"none"
        }) 
      }
    
    }
   
  })
  })
},
  /*
  *调用垃圾分类接口
  */
  getResult:function(word){

    var that=this;
    if(word == ""|| word=="输入有误,请重新输入")
    {
      wx.hideLoading()
      that.setData({
        textSucceedBaidu:"对不起，我没听清楚",
        textSucceedList:""
      })
      return
    }
    that.setData({
      textSucceedBaidu:'"'+word+'"'
    })
  
    
    wx.request({
      url: 'https://api.tianapi.com/txapi/lajifenlei/index?key=b5bdaa3c32ad0071d14a9129e7ff8f15&word='+word+'&num=1',
      success:function(res){
        console.log(res);
        wx.hideLoading()
        if(res.data.code==250){
            that.setData({
             textSucceedList:"尚未无垃圾分类信息"
            })
            that.wordYun();
        }
        else if(res.data.code==200){
          if(res.data.newslist==null)
          {
            that.setData({
            textSucceedList:"尚未无垃圾分类信息"
           })
           that.wordYun();
          }
          var listWord = that.translate(res.data.newslist[0].type)
          
        that.setData({
          textSucceedBaidu: '"'+ res.data.newslist[0].name +'"',
          textSucceedList:listWord
         })
         that.wordYun();

        }
        else{
          that.setData({
            textSucceedBaidu:"网络开小差啦",
            textSucceedList:""
          })
          that.wordYun();
        }
      },
      fail:function(res){
        console.log(res) 
        wx.hideLoading()
        wx.showToast({
          title:'识别失败',
          icon:"none",
        }) 
      }
    })
  },
   /**
   * 将垃圾分类的结果翻译成文字
   */
  translate:function(number){
    switch(number){
      case 0:return '是可回收垃圾'
      case 1:return '是有害垃圾'
      case 2:return '是厨余(湿)垃圾'
      case 3:return '是其他垃圾'
    }
  }
})