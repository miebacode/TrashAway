// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */

    data: {

      dataList: [

      //   {

      //     goods_id:1,

      //     goods_title:'商品标题1',

      //     goods_img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      //     goods_xiaoliang:'0',

      //     goods_price:'60'

      // }, {

      //     goods_id:1,

      //     goods_title:'商品标题2',

      //     goods_img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      //     goods_xiaoliang:'0',

      //     goods_price:'70'

      // }, {

      //     goods_id: 1,

      //     goods_title: '商品标题3',

      //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      //     goods_xiaoliang: '0',

      //     goods_price: '80'

      // }, {

      //     goods_id: 1,

      //     goods_title: '商品标题4',

      //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      //     goods_xiaoliang: '0',

      //     goods_price: '90'

      // }, {

      //     goods_id: 1,

      //     goods_title: '商品标题5',

      //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',

      //     goods_xiaoliang: '0',

      //     goods_price: '110'

      // }

      ],
      pics:[],
      isShow:true,
    },
  /**上传图片 */
  uploadImage: function () {
    let that = this;
    let pics = that.data.pics;
    wx.chooseImage({
      count: 3 - pics.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let imgSrc = res.tempFilePaths;
        pics.push(imgSrc);
        if (pics.length >= 3) {
          that.setData({
            isShow: false
          })
        }
        that.setData({
          pics: pics
        })
      },
    })

  },

  turnclassfy:function(){
    wx.navigateTo({
      url: '../trashClass/trashClass',
    })
  },

  getResponse:function(){
    wx.request({
      url: ' http://www.baidu.com',
      // data: ({
      //   key:""
      // }),
      success(res) {
        // this.setData({
        //   response:res.data
        // }
        // )
        console.log(res.data)
      },fail(res){
        // this.setData({
        //   response: "请求失败"
        // }
        // )
        console.log(res.data)
      }
    }
    )
    // wx.showToast({
    //   title: '点击了请求按钮',
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getResponse();
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