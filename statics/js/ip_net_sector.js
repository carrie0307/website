$(document).ready(function(){

    function data_deal(data1)
    {
        dataSet = data1['domain_general']
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#ip-netsector-table').DataTable({
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
                "data": "sector"
            },
            {
                "data": "category"
            },
            {
                "data": "ips"
            }
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {
            "targets": [3],
            "data": "ip",
            "render": function(data, type, full) {

                var ip_data="";
                for(var i=0;i<data.length;i++)
                {
                    ip_data = ip_data + data[i] + '\n'
	            }

                return "<a title='"+ip_data+"' href=''>"+data.length+"</a>";// 也可以不用a标签，用<span>
                //return data.length
                }
            },
            {"targets": 3},
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
       url:"/ip_net_sector_off",
       cache:false,
       success:function(data1){

           data_deal(data1);
       },
       error:function(){
           alert("error!");
       },
   });


});
