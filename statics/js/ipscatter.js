// 指定图表的配置项和数据
var option = {
    title : {
        text: 'IP变化情况统计',
        //subtext: '抽样调查来自: Heinz  2003'
    },
    tooltip : {
       trigger: 'axis',
       showDelay : 0,
       formatter : function (params) {
           return params.value
        },
       axisPointer:{
          // show: true,
           type : 'cross',
           lineStyle: {
               type : 'dashed',
               width : 1
           }
       }
   },

    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataZoom : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    xAxis : [
        {
            type : 'category',
            scale:true,
            data:[],
            axisLabel:{
                interval:1,
                rotate:20,//旋转角度，为0表示水平
            }
        }
    ],
    yAxis : [
        {
            type : 'category',
            scale:true,
            data:[],
            axisLabel : {
                interval:3,
            }
        }
    ],
    series : [],

};
//myChart.setOption(option);// 初次加载图表(无数据)


function deal_data(real_data)
{
    /*
        由于数据较多，因此在这里以30次变化的数据作为一组，绘制在一张图内;
        每次动态创建一个div，绘制新的散点图
    */
    var Series = []; // 每次图中实际的数据，{name：当次insert_time， type：catter，data： [当次insert_time对应的所有ip记录]}
    var dates = []; // 每组（一张图）中的30个insert_time
    var i,j;
    var k = 30; //每30次的数据作为一组
    var div; // 每次新建的div
    var mychart; // 每次echart初始化的变量
    var cell = document.getElementById("main_content"); // 所有的div都创建到id为main_content的div下
    for(i=0;i<real_data['date'].length;) //对所有的insert_time遍历
    {

        div = document.createElement("div"); // 创建新的div
        div.id = "div" + i;
        div.style.cssText="width:1500px;height:400px; margin-top:50px;" //设置css内容
        cell.appendChild(div);
        mychart = echarts.init(document.getElementById(div.id)); //echart初始化


        dates =real_data['date'].slice(i,k); //截取30个insert_time为一组
        Series = [];

        for(j=0;j<dates.length;j++)
        {
            //real_data['data'][dates[j]]： 该insert_time对应的所有ip的列表
            Series.push({name:dates[j], type:'scatter',data:real_data['data'][dates[j]]});
        }

        option.xAxis[0].data=dates;
        option.yAxis[0].data=real_data['ips']; //纵轴ip始终时所有ip
        option.series=Series;
        mychart.setOption(option);

        i = k;
        k = k + 30; //每30次的数据作为一组


    }


}



// 使用刚指定的配置项和数据显示图表。
$.ajax({
    type:"get",
    url:"/ip_scatter_off",
    cache:false,
    success:function(data1){

        //alert("success");
        deal_data(data1);

    },
    error:function(){
        alert("error!");
    },

});


//搜索按钮功能
$("#search-btn").click(function(event){

  event.preventDefault();
  var wd=$("#search-blank").val();

  $.ajax({
      type:"post",
      url:"/ip_scatter_off",
      data:{'domain':wd},
      cache:false,
      success:function(data1){

          deal_data(data1);

      },
      error:function(){
          alert("error!");
      },

  });

});
