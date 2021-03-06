// pages/trashClass/trashClass.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tabbar
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    scrollLeft: 0,
    trashTypes:[{
      id:1,
      name:"厨余垃圾",
      images:"/images/chuyu.png",
      explain:"湿垃圾又称为厨余垃圾、有机垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。",
      request:"纯流质的食物垃圾如牛奶等应直接倒入下水口\有包装的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的垃圾容器",
      classfication:"包括丢弃不用的菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头、动物内脏、鱼鳞、树叶、杂草、食物残渣、菜根、菜叶，动物蹄、角、瓜皮、果屑、蛋壳、鱼鳞、毛发、植物枝干、树叶、杂草、动物尸体、牲畜粪便等。",
    },
    {
      id: 2,
      name: "其他垃圾" ,
      images: "/images/other.png",
      explain: "其他垃圾也称为干垃圾，指的是危害较小，但无再次利用价值，如建筑垃圾类，生活垃圾类等，一般采取填埋、焚烧、卫生分解等方法，部分还可以使用生物解决，如放蚯蚓等",
      request: "投放前尽量沥干水分\n难以识别的垃圾投放到干垃圾容器当中",
      classfication: "包括砖瓦陶瓷、渣土、卫生间废纸、瓷器碎片等难以回收的废弃物",
    },{
      id: 3,
      name: "可回收垃圾",
      images: "/images/recycle.png",
      explain: "可回收垃圾是指适宜回收循环使用和资源利用的废物",
      request: "尽量保持清洁干燥，避免污染\n立体包装物请清空内容物,清洁后压扁后投放\n废纸应保持平整\n废玻璃制品及带尖锐角的物品，应包裹后投放",
      classfication: "主要包括废纸、塑料、玻璃、金属和纺织物五大类生活垃圾。\n废纸主要包括：报纸、杂志、图书、各种包装纸、办公用纸、纸盒等，但是纸巾和卫生用纸由于水溶性太强不可回收\n塑料主要包括：各种塑料袋、塑料包装物和餐具、牙刷、杯子、矿泉水瓶、塑料玩具、塑料文具、塑料生活用品、洗发液瓶、洗手液瓶、洗衣液瓶、洗洁精瓶\n玻璃主要包括：玻璃饮料瓶、玻璃酒瓶、坏玻璃杯、碎玻璃窗、废玻璃板、镜片、镜子等，根据回收工艺，玻璃分为无色玻璃，绿色玻璃，棕色玻璃\n金属主要包括:易拉罐、金属罐头盒、装饰物、铝箔、铁片、铁钉、铁管、废铁丝、旧钢丝球、铜导线等，按照回收材料分类：铁类，非铁类(一般指有色金属)\n纺织物主要包括：废弃衣服、裤子、袜子、毛巾、书包、布鞋、床单、被褥、毛绒玩具等",
    },{
      id: 4,
      name: "有害垃圾",
      images: "/images/harmful.png",
      explain: "有害垃圾指废电池、废灯管、废药品、废油漆及其容器等对人体健康或者自然环境造成直接或者潜在危害的生活废弃物",
      request: "杀虫剂等压力罐装容器，应排空内容物后投放\n投放时应注意轻放\n易破损的连带包装或包裹后轻纺\n如果易挥发，请密封后投放",
      classfication: "包括废电池、废荧光灯管、废灯泡、废水银温度计、废油漆桶、过期药品等",
    }]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /*** 获取系统信息*/
    wx.getSystemInfo({
       success: function (res){ 
         that.setData({
            winWidth: res.windowWidth,
             winHeight: res.windowHeight 
             }); 
             } 
             });
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

  },

  /*** 滑动切换tab*/
  bindChange: function (e) {
    var that = this;
     that.setData({ 
       currentTab: e.detail.current 
       });
       // 内容与tabbar的联动//这里的 2 75 是根据顶部tabbar的个数来决定的，我定义的是5个，2是索引，也就是说超过三页才会改变
       if (e.detail.current > 2)
        {
          var a = e.detail.currentvar 
          var query = wx.createSelectorQuery()
          query.select('.scrollBox').boundingClientRect(function (res) {
            that.setData({scrollLeft: (a - 2) * 75})})
            query.selectViewport().scrollOffset()
            query.exec(function (res) {})} 
            else {
              var a = e.detail.current
              this.setData({scrollLeft: 0})}
               },
 /*** 点击tab切换*/
  switchNav: function (e) {
        var that = this;console.log(e.target)
        if (this.data.currentTab === e.target.dataset.current) 
            {return false;} 
        else {
            that.setData({currentTab: e.target.dataset.current})}},
  
})