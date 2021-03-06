var TableInit = function () {
    alert(111);
   var oTableInit = new Object();
   //初始化Table
   oTableInit.Init = function () {
    $('#tb_departments').bootstrapTable({
     url: '/Active/ActivityS',   //请求后台的URL（*）
     method: 'post',      //请求方式（*）
     toolbar: '#toolbar',    //工具按钮用哪个容器
     striped: true,      //是否显示行间隔色
     cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
     pagination: true,     //是否显示分页（*）
     sortable: false,      //是否启用排序
     sortOrder: "asc",     //排序方式
     queryParams: oTableInit.queryParams,//传递参数（*）
     sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
     pageNumber: 1,      //初始化加载第一页，默认第一页
     pageSize: 10,      //每页的记录行数（*）
     pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
     search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
     strictSearch: true,
     showColumns: true,     //是否显示所有的列
     showRefresh: true,     //是否显示刷新按钮
     minimumCountColumns: 2,    //最少允许的列数
     clickToSelect: true,    //是否启用点击选中行
     //height: 500,      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
     uniqueId: "ActivityGuid",      //每一行的唯一标识，一般为主键列
     showToggle: true,     //是否显示详细视图和列表视图的切换按钮
     cardView: false,     //是否显示详细视图
     detailView: false,     //是否显示父子表
     columns: [{
      checkbox: true
     },
     {
      field: 'ActivityGuid',
      title: '活动报名主键'
     },
     {
      field: 'Name',
      title: '活动名称'
     }, {
      field: 'Introduction',
      title: '活动简介'
     }, {
      field: 'StartDateTime',
      title: '活动开始时间'
     }, {
      field: 'EndDateTime',
      title: '活动结束时间'
     },
     {
      field: 'TotalPlaces',
      title: '活动总名额'
     },
     {
      field: 'ActivityType',
      title: '活动类型'
     },
     {
      field: 'AccountGuid',
      title: '操作人'
     },
     {
      field: 'isLine',
      title: '是否上线'
     },
     {
      field: 'isMail',
      title: '是否邮寄'
     },
     ]
    });
   };

   //得到查询的参数
   oTableInit.queryParams = function (params) {
    var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
     limit: params.limit, //页面大小
     offset: params.offset, //页码
     departmentname: "aa",
     statu: "true",
     search: params.search
    };
    return temp;
   };
   return oTableInit;
  };

  var ButtonInit = function () {
   var oInit = new Object();
   var postdata = {};

   oInit.Init = function () {
    //初始化页面上面的按钮事件
   };
   return oInit;
  };
