 var myChart = echarts.init(document.getElementById('main'));
option = {
    title : {
        text: 'IP变动频率统计',
        subtext: 'From ExcelHome',
        sublink: 'http://e.weibo.com/1341556070/AizJXrAEa'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params){ //这里控制显示当鼠标指到图上后方框的显示内容
            return params[0].name + '<br/>'
                   + params[0].seriesName + ' : ' + params[0].value + '<br/>'
                   + params[1].seriesName + ' : ' + (params[1].value);
        }
    },
    legend: {
        selectedMode:false,
        data:['IP变动次数', 'IP不变次数']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            //data : ['Cosco','CMA','APL','OOCL','Wanhai','Zim']
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            boundaryGap: [0, 0.1]
        }
    ],
    series : [
        {
            name:'IP变动次数',
            type:'bar',
            stack: 'sum',
            barCategoryGap: '50%',
            itemStyle: {
                normal: {
                    color: 'tomato',
                    barBorderColor: 'tomato',
                    barBorderWidth: 3,
                    barBorderRadius:0,
                    label : {
                        show: true, position: 'insideTop'
                    }
                }
            },
            //data:[260, 200, 220, 120, 100, 80]
            data:[]
        },
        {
            name:'IP不变次数',
            type:'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#FAEBD7',
                    barBorderColor: 'tomato',
                    barBorderWidth: 0,
                    barBorderRadius:0,
                    label : {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
                                if (option.xAxis[0].data[i] == params.name) {
                                    return option.series[0].data[i] + params.value;
                                }
                            }
                        },
                        textStyle: {
                            color: 'tomato'
                        }
                    }
                }
            },
            //data:[40, 80, 50, 80,80, 70]
            data:[]
        }
    ]
};

myChart.setOption(option);

$.ajax({
    type:"get",
    url:"/off",
    cache:false,
    success:function(data1){

        //data是所请求的 URL的网页内容
        //var length=data1['total'];
        //document.write(length);
        var data = data1["rows"]; //实际的数据
        var category_name = new Array(); //获取域名名称
        var change_times = new Array();
        var interval_times = new Array();

        for(var i=0;i<data.length;i++)
        {
		category_name[i]=data[i]['domain'];
	    }

        for(i=0;i<data.length;i++)
        {

        change_times[i]=data[i]['change_times'];
	    }

        for(i=0;i<data.length;i++)
        {
        interval_times[i]=data[i]['visit_times']-data[i]['change_times'];
	    }

       myChart.setOption({
       xAxis: {
           data: category_name
        },
       series: [{
           // 根据名字对应到相应的系列
           name: 'IP变动次数',
           data: change_times
       },
       {
           // 根据名字对应到相应的系列
           name: 'IP不变次数',
           data: interval_times
       }

    ]
   });

    },
    error:function(){
        alert("error!");
    },

});
