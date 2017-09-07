/*
$(document).ready(function(){
    alert(111);




       $.ajax({
            type:"get",
            url:"/off",
            cache:false,
            success:function(data1){
                //data是所请求的 URL的网页内容
                var length=data1['length'];
                document.write(length);
                alert(length);

                var data=data1['data'];
                for (value in data){
			        document.write(value);
                    document.write(data[value]['change_times'],data[value]['visit_times'],data[value]['frequency'])
	            }

            },
            error:function(){
                alert("error!");
            },
        });

});

*/

$(document).ready(function(){
    initTable("#dataTable");
});

//自定义ajax

function ajaxRequest(){
    //访问服务器获取所需要的数据
    //比如使用$.ajax获得请求某个url获得数据
    $.ajax({
        type:"get",
        url:"/off",
        cache:false,
        success:function(data1){

            //data是所请求的 URL的网页内容
            //var length=data1['total'];
            //document.write(length);

            alert(data1["total"]);
            return data1["rows"];
        },
        error:function(){
            alert("error!");
        },

    });
}

//自定义参数
function postQueryParams(params) {
    params.cname = $("#search").val();
    return params;
}

//初始化
function initTable(tableId){
    $(tableId).bootstrapTable({
        classes : "table table-bordered table-hover table-striped",//加载的样式
        //ajax : "ajaxRequest",//自定义ajax
        method: 'get',
        url: '/off',
        smartDisplay:false,
        //data: ajaxRequest
        pagination : true,//开启分页
        sidePagination : "server",//使用服务器端分页
        pageSize : 5,//每页大小
        pageList : [20, 40, 60, 80],//可以选择每页大小
        sortable: true, //是否启用排序
        sortOrder: "change_times",
        search : true,//不开启搜索文本框
        queryParams : "postQueryParams",//自定义参数
        columns: [
                    {
                        field: 'domain',
                        title:'域名'
                    },
                    {
                        field: 'visit_times',
                        title: 'IP变化次数'
                    },
                    {
                        field: 'change_times',
                        title: '访问次数',
                    },
                    {
                        field:'frequency',
                        title: '变化频率'
                    }
                ]
    });
}

//查询时，先销毁，然后再初始化
$("#btnSearch").click(function(){
    $("#dataTable").bootstrapTable('destroy');
    initTable("dataTable");
});
