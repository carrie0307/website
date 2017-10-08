$(document).ready(function(){

    var option = {
    title : {
        text: '域名整体ip数量比例统计',
    },
    tooltip : {
        trigger: 'axis',
        formatter : function (params) {
            var gamble_data = params[0].seriesName + "</br>ip数量： " + params[0].name + "</br>数量占比：" + params[0].value + "%</br>"
            var porno_data = params[1].seriesName + "</br>ip数量： " + params[1].name + "</br>数量占比：" + params[1].value + "%"
            return gamble_data + porno_data
       }
    },
    legend: {
        data:['赌博类','色情类']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data: ['0','1','2','3~10','11~15','>15'],
            axisLabel : {
               formatter: '{value} 个 ip'
           }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
               formatter: '{value} %'
           }
        }
    ],
    series : [
        {
            name:'赌博类',
            type:'bar',
            data:[],
        },
        {
            name:'色情类',
            type:'bar',
            data:[],


        }
    ]
  };

    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('ip-percent'));
    myChart.setOption(option);


    $.ajax({
      type:"get",
      url:"/ip_percent_off",
      cache:false,
      success:function(data1){

          option.series[0].data=data1['Gamble'];
          option.series[1].data=data1['Porno'];
          myChart.setOption(option);
      },
      error:function(){
          alert("error!");
      },
  });


});
