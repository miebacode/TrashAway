// pages/index/index.js
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
    data: {
      token:"",
      img:"",
      isMaskWindowShow: false,
      maskWindowList: [],
      selectIndex: -1,
      openId:'',
      recordList:[],
    },
  getToken:function(){
    var that=this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=IaPnlG2iLXQOMGokgVrnWHbI&client_secret=9oLn41p5G4pBqzEwNjx5jiDMVEEHQibD', //服务器地址
      method: 'post',// OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        // token = res.data.access_token;
        that.setData({ //======不能直接写this.setDate======
          token: res.data.access_token, //在相应的wxml页面显示接收到的数据
        });
        // console.log(token)
      }
    })
  },
  getImageResult:function(e1,e2){
    let token=e1;
    let img=e2;
    var that = this;
    let url = "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token="+token;                
    wx.request({
    url: url,
      // filePath: res.tempFilePaths[0],
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:"post",
      data: {
        'image': img,
        'baike_num':0
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          maskWindowList:res.data.result
        });
        that.showMaskWindow();
      },
      fail: function (res) {
        wx.hideLoading();
        console.log('失败'+res);
        wx.showModal({
          title: '温馨提示',
          content: 'Sorry 小程序离家出走了',
          showCancel: false
        })
      }
      
    })

  },
  uploads: function () {
    var that = this;
    wx.showActionSheet({

      itemList: ['相册', '拍照'],

      success: function (res) {

        console.log(res);
        let tap=res.tapIndex;
    that.getToken();
    var token='';
    var img=""
    if(tap===0){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
          wx.showLoading({
            title: "努力分析中...",
            mask: true
          }),
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0], //选择图片返回的相对路径            
              encoding: "base64",//这个是很重要的            
              success: res => { //成功的回调             //返回base64格式            
              console.log('data:image/png;base64,' + res.data)  
              img=res.data;    
              token=that.data.token;  
              that.getImageResult(token,img);        
      }
    })
      }
    })
  }else if(tap===1){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
          wx.showLoading({
            title: "努力分析中...",
            mask: true
          }),
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0], //选择图片返回的相对路径            
              encoding: "base64",//这个是很重要的            
              success: res => { //成功的回调             //返回base64格式            
              console.log('data:image/png;base64,' + res.data)  
              img=res.data;    
              token=that.data.token;  
              that.getImageResult(token,img);        
      }
    })
      }
    })
  }
  }

})
  },
  //弹窗区域点击事件

  clickTap: function (e) {
  },

  //切换选择项事件

  maskWindowTableSelect: function (e) {

    var index = e.currentTarget.dataset.windowIndex;

    this.setData({

      selectIndex: e.currentTarget.dataset.windowIndex,

    })

  },

  //弹框以外区域点击

  maskWindowBgClick: function (e) {

    this.dismissMaskWindow();

  },

  maskWindowOk: function (e) {

    var index = this.data.selectIndex;

    var text;

    if (index >= 0 && index < 6) {

      text = this.data.maskWindowList[index].keyword;

    }  else {

      text = "";

    }
    this.dismissMaskWindow();
    wx.navigateTo({
      url: '../word/word?data=' +[text],
    })
  },

  // 显示蒙版弹窗

  showMaskWindow: function () {

    this.setData({

      isMaskWindowShow: true,

      selectIndex: -1,
    })

  },

  // 隐藏蒙版窗体

  dismissMaskWindow: function () {

    this.setData({

      isMaskWindowShow: false,

      selectIndex: -1,
})

  } ,
  turnclassfy:function(){
    // wx.navigateTo({
    //   url: '../trashClass/trashClass',
    // })
    // wx.navigateToMiniProgram({
    //   appId: 'wxa6f6e1cd54e2f6d7',
    //   envVersion: 'develop',
    //   success(res){
    //     console.log(res);
    //   }
    // })
    return new Promise((resolve, reject) => {
      wx.navigateToMiniProgram({
        appId: 'wxa6f6e1cd54e2f6d7',
        path: '',
        extraData: {},
        envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log("跳转成功了。。。");
        }
      })
    })
  },
  focus:function(){
    wx.navigateTo({
      url: '../word/word'
    })
  },
  addUser:function(e){
    var that=this
    var openId=e;
    wx.request({
    url: 'http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/user/add',
    method:'post',
    header: {// 设置请求的 header
      'content-type': 'application/json'
    },
    data:{
      "openId":openId
    },
    success(res){
      console.log(res);
      that.getUserId(openId)
    }
  })
  },
  getUserId:function(e){
    var that=this;
    wx.request({
      url: 'http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/user/findUser',
      method:'post',
      header: {// 设置请求的 header
        'content-type': 'application/json'
      },
      data:{
        "openId":e
      },
      success(res){
      console.log(res);
        if(res.data.data==-1){
        that.addUser(e)
        console.log("增加用户")
        }else{
        let userId=res.data.data;
        wx.setStorageSync('userid', userId)
        console.log(userId);
        that.getRecord(userId);
        }

      }
      
    })
  },
  getRecord:function(e){
    var that=this
    wx.request({
      url: 'http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/record/list',
      method:'post',
      header: {// 设置请求的 header
        'content-type': 'application/json'
      },
      data:{
        "userId":e
      },
      success(res){
        console.log(res)
        that.setData({
          recordList:res.data.data
        })
      }
    })
  },
  getOpenId:function(){
    var that=this
    wx.getStorage({
      key: 'openId',
      success(res){
        console.log(res)
        that.setData({
          openId:res.data
        })
      },
      fail(res){
        wx.showLoading({
          title: '登录中'
        })
        wx.login({
          success: function (res) {
            let code=res.code;
            wx.request({
              url: 'http://120.26.187.5:8888/qiandaobao-0.0.1-SNAPSHOT/weChat/login',
              method:'post',
              data:{
                code:code
              },
              success:function(res){
                console.log(res);
                let openId=res.data.data.openid
                that.setData({
                  openId:openId
                })
                console.log(openId);
                  // obj.openid = res.data.data.openid;
                  wx.setStorageSync('openId', openId);//存储openid
                  that.setUserInfoAndNext(res)
                }
              });
            }, 
            fail(res) {
                    console.log('获取用户登录态失败！' + res.errMsg)
                    that.setUserInfoAndNext(res)
                  }
              });
      }
    })
     
},
setUserInfoAndNext(res) {
  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  // 所以此处加入 callback 以防止这种情况
  if (this.userInfoReadyCallback) {
    this.userInfoReadyCallback(res)
  }
  wx.hideLoading()
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that =this;
    that.getOpenId();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    let openId=that.data.openId;
    // that.getUserId(openId);
    wx.getStorage({
      key: 'userid',
      success(res){
        console.log(res);
        let userId=res.data;
        that.getRecord(userId);
      },
      fail(res){
        that.getUserId(openId)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})