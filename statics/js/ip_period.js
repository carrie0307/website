$(document).ready(function(){

    function data_deal(data1)
    {
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#ip-period-table').DataTable({
            destroy: true,
            searching: false,
            //每页显示n条数据
            pageLength: 20,
            //data: dataSet,
            data:data1['rows'],
            columns: [{
                "data": null //此列不绑定数据源，用来显示序号
            },
            {
                "data": "ip"
            },
            {
                "data": "begin"
            },
            {
                "data": "end"
            },
            {
                "data": "period"
            }
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {"targets": 4},
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


    $.ajax({
       type:"get",
       url:"/iplive_off",
       cache:false,
       success:function(data1){
           data_deal(data1);

       },
       error:function(){
           alert("error!");
       },
   });

});
