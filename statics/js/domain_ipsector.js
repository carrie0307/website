var option_select;
$(document).ready(function(){


    //表格相关处理
    function data_deal(data1, domain_type)
    {
        dataSet = data1[domain_type];

        var t = $('#domain-ip-netsector-table').DataTable({
            destroy: true,
            searching: false,
            //每页显示n条数据
            pageLength: 10,
            //data: dataSet,
            data:dataSet,
            columns: [{
                "data": null //此列不绑定数据源，用来显示序号
            },
            {
                "data": "domain"
            },
            {
                "data": "ips"
            },
            {
                "data": "sectors"
            }
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {
            "targets": [2],
            "data": "ips",
            "render": function(data, type, full) {

                var ip_data="";
                for(var i=0;i<data.length;i++)
                {
                    ip_data = ip_data + data[i] + '\n'
	            }

                return "<a title='"+ip_data+"' href=''>"+data.length+"</a>";// 也可以不用a标签，用<span>
                }
            },
            {"targets": 2},
        ],

        });

        //前台添加序号
        t.on('order.dt search.dt',
        function() {
            t.column(0, {
                "search": 'applied',
                "order": 'applied'
            }).nodes().each(function(cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
    }

    //选项框内容发生变化时，表根内容同样变化
    option_select=function(param){

        $('#type-button').text = param;
        var type_dict = {"Gamble":"赌博", "Porno":"色情", "all":"全部"}
        document.getElementById("type-button").innerHTML=type_dict[param];

        data_deal(response_data,param)

    }


    var option = {
    title : {
        text: '域名整体网段数量比例统计',
    },
    tooltip : {
        trigger: 'axis',
        formatter : function (params) {
            var gamble_data = params[0].seriesName + "</br>网段数量： " + params[0].name + "</br>数量占比：" + params[0].value + "%</br>"
            var porno_data = params[1].seriesName + "</br>网段数量： " + params[1].name + "</br>数量占比：" + params[1].value + "%"
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
            data: ['0', '1', '2', '3~5', '6~10', '11~15', '16~20', '21~25', '大于25 '],
            axisLabel : {
               formatter: '{value} 个 网段'
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


    var myChart = echarts.init(document.getElementById('domain-ip-netsector-percent'));//柱状图初始化
    myChart.setOption(option);

    //表格内初始显示赌博类域名数据
    var domain_type="Gamble"; //默认显示赌博类域名数据
    var response_data; // 获取到的全部数据
    $.ajax({
     type:"post",
     url:"/domain_ip_sector",
     //data:{'domain_type':domain_type},
     cache:false,
     success:function(data1){
         response_data=data1; //为select标签内容变化做准备

         //能放在这里执行的尽量放在这里执行

         data_deal(data1,domain_type); //填充表格内容
         // 填充柱状图数据
         option.series[0].data=data1['bar-data']['Gamble'];
         option.series[1].data=data1['bar-data']['Porno'];
        myChart.setOption(option);
     },
     error:function(){
         alert("error!");
     },
    });

    /*
    https://segmentfault.com/q/1010000000334467
    这里会报错说response_data未定义，原因是加载时先执行了这里，后执行的ajax部分，因此response_data没有数据
    option.series[0].data=response_data['bar-data']['Gamble'];
    option.series[1].data=response_data['bar-data']['Porno'];
    myChart.setOption(option);
    */
});

option_select();
