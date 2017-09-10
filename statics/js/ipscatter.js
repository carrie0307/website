var myChart = echarts.init(document.getElementById('ip-scatter'));
// 指定图表的配置项和数据
option = {
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
                interval:'auto',
                rotate:30,//旋转角度，为0表示水平
            }
        }
    ],
    yAxis : [
        {
            type : 'category',
            scale:true,
            data:[],
            axisLabel : {
                //formatter: '{value} kg'
                interval:3,
            }
        }
    ],
    series : []

};

// 使用刚指定的配置项和数据显示图表。


$.ajax({
    type:"get",
    url:"/ip_scatter_off",
    cache:false,
    success:function(data1){

        alert("success");
        real_data = data1["rows"];
        var category_name = new Array(); //以每次访问时间作为x轴的category
        var ini_ip_array = new Array(); // 原始的IP列表
        var ip_array = new Array(); // 去重后的IP列表,作为Axis

        var j=0;
        var i = 0;

        var real_series=[];
        var xy=[]; //每次访问日期下实际对应的x.y轴数据

        for(value in real_data)
        {
            for(i=0;i<real_data[value].length;i++)
            {
                xy.push([value,real_data[value][i]]);//实际的数据，x轴是日期，y周是ip对应的index（数字化）
                //xy.push([real_data[value][i],value]);//实际的数据，x轴是日期，y周是ip对应的index（数字化）
            }
            real_series.push({name:value, type:'scatter',data:xy});
            xy=[];

    		category_name[j]=value; //获取访问日期列表
            ini_ip_array.push.apply(ini_ip_array, real_data[value]); //获取原始ip列表
            j = j + 1;
	    }
        category_name=category_name.sort();//按照时间进行排序


        //对ip进行去重，得到ip_array
        for(i=0;i<ini_ip_array.length;i++)
        {
            if (ip_array.indexOf(ini_ip_array[i]) == -1){
                ip_array.push(ini_ip_array[i]);
            }

        }


        option.xAxis[0].data=category_name;
        option.yAxis[0].data=ip_array;
        option.series=real_series;

        myChart.setOption(option);

    },
    error:function(){
        alert("error!");
    },

});

myChart.setOption(option);// 初次加载图表(无数据)
