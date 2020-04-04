// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultlist:[],
    inputVal:"",
    result:{
    },
    userId:'',
    isMaskShow: false,
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  search:function(){
    var that=this;
    that.setData({
      resultlist:null
    })
    var inputVal=that.data.inputVal;
    wx.request({
      url: 'https://api.tianapi.com/txapi/lajifenlei/index?key=8ed19838f42ff06874fc72cecf57494b&word='+inputVal,
      success:function(res){
        if(res.data.code==250){
          wx.showToast({
            title: '该垃圾还没有被分类',
          })
        }else{
          console.log(res);
        that.setData({
          resultlist:res.data.newslist
         });
        }
      }
    })
  },
  addRecord:function(e){
    var that=this
    let result=e;
    wx.getStorage({
      key: 'userId',
      success(res){
        let userId=res.data;
        let trashName=result.name;
        let trashType=result.type;
        wx.request({
          url: 'http://127.0.0.1:8010/record/add',
          method:'POST',
          header: {// 设置请求的 header
            'content-type': 'application/json'
          },
          data:{
            "userId":userId,
            "trashName":trashName,
            "trashType":trashType
          },
          success(res){
            console.log(res)
          }
        })
      }
    })
    
  },
  getDetail:function(e){
    var that=this;
     let result=e.currentTarget.dataset.item;
     console.log(result);
     that.setData({
       result:result
     })
     that.addRecord(that.data.result)
     that.showMask();
  },
  Okbtn:function(){
     var that=this;
     that.dismissMask();
  },
  cancel:function(){
    wx.navigateBack({
      
    })
  },
  // 显示蒙版弹窗
  showMask: function () {

    this.setData({
      isMaskShow: true,
    })

  },
  //关闭蒙版弹窗
  dismissMask: function () {

    this.setData({

      isMaskShow: false,

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let text = options.data;
    if(text!=null){
    that.setData({
      inputVal:text
    })
     //微信、百度等小程序参考代码，和 Jquery发送ajax请求是一样的
     wx.request({
      url: 'https://api.tianapi.com/txapi/lajifenlei/index?key=8ed19838f42ff06874fc72cecf57494b&word='+text,
      success: function (res) {
        if (res.data.code == 200) {
          // that.setData({
          //   content: res.data.newslist[0].content
          // })
          console.log(res);
          let list=res.data.newslist;
          that.setData({
            resultlist:list
          })
         
        } else {
          wx.showToast({
            title: '该垃圾还没有被列入分类',
          });
        }
      },
      fail: function (err) {
        // console.log(err)
        wx.showToast({
          title: ''+err,
        })
      }
    })
  }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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