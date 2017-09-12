$(document).ready(function() {

    var myChart = echarts.init(document.getElementById('ip-pie'));

    //echarts初始化
    var option = {
    title : {
        text: 'ip变化频率统计',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['ip变化次数','ip不变次数']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[]
        }
            ]
    };
    myChart.setOption(option);


    var dataSet=[];//统计表中的数据
    var change_times;
    var visit_times;


    // 对请求所的数据进行echarts和datatables的设置
    //定义成函数，方便调用
    function data_deal(data1)
    {
        change_times=data1['frequency']['change_times'];
        visit_times=data1['frequency']['visit_times'];
        dataSet=data1['data']; //这里其实是列表了

        //加载统计图数据
        option.series[0]['data'][0]={value:change_times, name:'ip变化次数'}
        option.series[0]['data'][1]={value:visit_times-change_times, name:'ip不变次数'}
        myChart.setOption(option);


        //表格内容
        var t = $('#ip-table').DataTable({
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
                "data": "time"
            },
            {
                "data": "time_gap"
            },
            {
                "data": "ip"
            },
            {
                "data": "ip_geo"
            },
            {
                "data": "update_ip"
            },
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {
            "targets": [3],
            "data": "ip",
            "render": function(data, type, full) {
                //给表格内容加上了链接,通过a标签的title显示详细信息（这里支持\n),用a标签内容显示实际表格的内容，这里注意"+data+"写法，且此处支持</br>换行
                //return "<a title='"+data+"' href='/update?t_unid=" + data + "'>"+data+"</a>";// 也可以不用a标签，用<span>
                //如果用的是span，页面不会显示出超链接的样子，颜色不变
                var ip_num=data['num'];
                var ips=data["ips"];
                return "<a title='"+ips+"' href=''>"+ip_num+"</a>";// 也可以不用a标签，用<span>
                }
            },
            {
            "targets": [4],
            "data": "ip_geo",
            "render": function(data, type, full) {
                //给表格内容加上了链接,通过a标签的title显示详细信息（这里支持\n),用a标签内容显示实际表格的内容，这里注意"+data+"写法，且此处支持</br>换行
                //return "<a title='"+data+"' href='/update?t_unid=" + data + "'>"+data+"</a>";// 也可以不用a标签，用<span>
                //如果用的是span，页面不会显示出超链接的样子，颜色不变
                var geo=data['geo'];
                var detail="";
                for (value in data['geo_detail'])
                {
                    detail = detail + value + ':' + data['geo_detail'][value].toString() + '\n'
                }
                return "<a title='"+detail+"' href=''>"+geo+"</a>";// 也可以不用a标签，用<span>
                }
            },
            {
            "targets": [5],
            "data": "update_ip",
            "render": function(data, type, full) {
                var num=data['num']; //ip数量
                var ips=data['ips']; //具体ip
                //return "<a title='"+ips+"' href=''>"+num+"</a>";// 也可以不用a标签，用<span>
                return "<a title='"+ips+"' href=''>"+num+"</a>";// 也可以不用a标签，用<span>
                }
            },
            {"targets": 5},
        ]

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

    //请求数据
    $.ajax({
        type:"get",
        url:"/ip_change_situation_off",
        cache:false,
        success:function(data1){

            data_deal(data1);

        },
        error:function(){
            alert("error!");
        },
    });


    /*
    //弹出一个页面层
    $('column-4').hover(function(){
      layer.open({
      type: 1,
      area: ['600px', '360px'],
      shadeClose: true, //点击遮罩关闭
      content: '\<\div style="padding:20px;">自定义内容\<\/div>'
      });


    });
    */


    //搜索按钮功能
    $("#search-btn").click(function(event){
      event.preventDefault();
      alert(111);

      var wd=$("#search-blank").val();

      $.ajax({
          type:"post",
          url:"/ip_change_situation_off",
          data:{'domain':wd},
          cache:false,
          success:function(data1){
              alert("success");
              data_deal(data1);

          },
          error:function(){
              alert("error!");
          },

      });

    });


});
