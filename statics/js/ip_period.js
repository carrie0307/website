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
        url: '/ip_off',
        smartDisplay:false,
        //data: ajaxRequest
        pagination : true,//开启分页
        sidePagination : "server",//使用服务器端分页
        pageSize : 5,//每页大小
        pageList : [20, 40, 60, 80],//可以选择每页大小
        sortable: true, //是否启用排序
        sortOrder: "period",
        search : true,//不开启搜索文本框
        queryParams : "postQueryParams",//自定义参数
        columns: [
                    {
                        field: 'ip',
                        title:'IP'
                    },
                    {
                        field: 'begin',
                        title: '计时起点'
                    },
                    {
                        field: 'end',
                        title: '计时终点',
                    },
                    {
                        field:'period',
                        title: '时长'
                    }
                ]
    });
}

//查询时，先销毁，然后再初始化
$("#btnSearch").click(function(){
    $("#dataTable").bootstrapTable('destroy');
    initTable("dataTable");
});
