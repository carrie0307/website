$(document).ready(function(){

    function data_deal(data1, domain_type)
    {
        dataSet = data1[domain_type]["Broad"];

        var t = $('#broad-table').DataTable({
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
                "data": "country"
            },
            {
                "data": "ips"
            },
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

    var option = {
        title : {
            text: '非法域名ip全国地理位置统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item'
        },
        dataRange: {
            min: 0,
            max: 200,
            x: 'left',
            y: 'bottom',
            text:['高','低'],           // 文本，默认为数值文本
            calculable : true
        },
        toolbox: {
            show: true,
            orient : 'vertical',
            x: 'right',
            y: 'center',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series : [
            {
                name: 'province_num',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[]
            },

        ]
    };


    var myChart = echarts.init(document.getElementById('province-map'));//柱状图初始化
    myChart.setOption(option);






    //表格内初始显示赌博类域名数据
    var domain_type="Gamble"; //默认显示赌博类域名数据
    var response_data; // 获取到的全部数据
    $.ajax({
     type:"post",
     url:"/province_spread",
     cache:false,
     success:function(data1){
        response_data = data1;

        option.series[0].data=data1[domain_type]["Home"];
        myChart.setOption(option);

        data_deal(data1, domain_type);
     },
     error:function(){
         alert("error!");
     },
    });




   //选项框内容发生变化时，表根内容同样变化
    $('#bili').change(function(){
    domain_type = $("#bili").find("option:selected").val();

        option.series[0].data=response_data[domain_type]["Home"];

        myChart.setOption(option);

        data_deal(response_data,domain_type);    //当选项变化时，重新填充表格数据

    });



});
