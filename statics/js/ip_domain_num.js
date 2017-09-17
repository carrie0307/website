$(document).ready(function(){

    function data_deal(data1)
    {
        dataSet = data1['data'];
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#ip-domain-table').DataTable({
            destroy: true,
            searching: false,
            //每页显示n条数据
            pageLength: 100,
            //data: dataSet,
            data:dataSet,
            columns: [{
                "data": null //此列不绑定数据源，用来显示序号
            },
            {
                "data": "ip"
            },
            {
                "data": "category"
            },
            {
                "data": "geo"
            },
            {
                "data": "domains"
            }
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {
            "targets": [2],
            "data": "category",
            "render": function(data, type, full) {
                var category = data + "类地址";
                return category;
                }
            },
            {
            "targets": [4],
            "data": "domains",
            "render": function(data, type, full) {

                var domain_data="";
                for(var i=0;i<data.length;i++)
                {
                    domain_data = domain_data + data[i] + '\n'
	            }

                return "<a title='"+domain_data+"' href=''>"+data.length+"</a>";

                }
            },
            {
            "targets": [4],
            "data": "geo",
            "render": function(data, type, full) {

                var geo_data="";
                for(var i=0;i<data.length;i++)
                {
                    geo_data = geo_data + data[i] + '\n'
	            }

                //return geo_data;
                return data[0];
                }
            },
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
       url:"/ip_domain_num_off",
       cache:false,
       success:function(data1){
           data_deal(data1);
       },
       error:function(){
           alert("error!");
       },
   });


});
