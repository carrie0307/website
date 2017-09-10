$(document).ready(function() {

    //请求数据
    var dataSet=[];//统计表中的数据
    $.ajax({
        type:"get",
        url:"/ip_change_situation_off",
        cache:false,
        success:function(data1){
            data = data1['data'];
            ///alert('successs');

            dataSet=data;

        },
        error:function(){
            alert("error!");
        },

    });

    alert('successs');/*这里很奇怪，如果不写一个alert，dataSet数据传不下去;*/

    var t = $('#ip-table').DataTable({
        /*
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
        */

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
