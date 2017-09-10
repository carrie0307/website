$(document).ready(function() {

    var myChart = echarts.init(document.getElementById('ip-pie'));
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
            data:[
            //    {value:5, name:'ip变化次数'},
            //    {value:3, name:'ip不变次数'},
                ]
        }
            ]
    };
    myChart.setOption(option);


    var dataSet=[];//统计表中的数据
    var change_times;
    var visit_times;
    //请求数据
    $.ajax({
        type:"get",
        url:"/ip_change_situation_off",
        cache:false,
        success:function(data1){
            ///alert('successs');
            change_times=data1['frequency']['change_times'];
            visit_times=data1['frequency']['visit_times'];
            dataSet=data1['data'];

            //加载统计图数据
            option.series[0]['data'][0]={value:change_times, name:'ip变化次数'}
            option.series[0]['data'][1]={value:visit_times-change_times, name:'ip不变次数'}
            myChart.setOption(option);

            //表格内容
            var t = $('#ip-table').DataTable({
                //每页显示n条数据
                pageLength: 10,
                data: dataSet,
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
                    "data": "ip_num"
                },
                {
                    "data": "ip_geo"
                },
                {
                    "data": "update_ip"
                },
            ],
            "columnDefs": [{"targets": 5}]

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



        //});
        },
        error:function(){
            alert("error!");
        },
    });

});


/*
    alert('successs');这里很奇怪，如果不写一个alert，dataSet数据传不下去;
    //表格内容
    var t = $('#ip-table').DataTable({
        ajax: {//datatable默认为get方法请求
            //指定数据源
            url: "http://www.gbtags.com/gb/networks/uploads/a7bdea3c-feaf-4bb5-a3bd-f6184c19ec09/data.txt"
            //数据模式
                {
                    "data": [
                        {
                            "id": 1,
                            "url": "http://www.gbtags.com/gb/index.htm",
                            "title": "Online Program knowledge share and study platform"
                        },
                        {
                            "id": 2,
                            "url": "http://www.gbtags.com/gb/listcodereplay.htm",
                            "title": "Share Code Gbtags"
                        },
                    ]
                }
        },

        //每页显示n条数据
        pageLength: 10,
        data: dataSet,
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
            "data": "ip_num"
        },
        {
            "data": "ip_geo"
        },
        {
            "data": "new_ip"
        },
        {
            "data": "delete_ip"
        }
    ],
        "columnDefs": [{
            // "visible": false,
            //"targets": 0
        },
        {
            //指定列数
            "targets": 6
        }]

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

});
*/
