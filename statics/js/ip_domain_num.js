$(document).ready(function(){

    function data_deal(data1, domain_type)
    {
        dataSet = data1['data'];
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#ip-domain-table').DataTable({
            destroy: true,
            searching: false,
            pageLength: 15,
            data:dataSet,
            bProcessing: true,
            bFilter: true,
            select: {
            style: 'multi'
            },
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
                var domain_num;
                if (domain_type != "all")
                {

                    for(var i=0;i<data.length;i++)
                    {
                        domain_data = domain_data + data[i] + '\n';
    	            }
                    return "<a title='"+domain_data+"' href=''>"+data.length+"</a>";
                }
                else
                {
                    if (data[0].length!=0 && data[1].length != 0)
                    {
                        domain_data = "赌博： " + data[0].length + "  色情: " + data[1].length;
                        return domain_data;
                    }
                    else if(data[0].length != 0)
                    {   return "赌博： " + data[0].length; }
                    else
                    {   return domain_data = "色情: " + data[1].length;}

                }
                }
            },
            {
            "targets": [4],
            "data": "geo",
            "render": function(data, type, full) {
                return data;
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

    var domain_type="Gamble"; //默认显示赌博类域名数据

    $.ajax({
       type:"post",
       url:"/ip_domain_num",
       data:{'domain_type':domain_type},
       cache:false,
       success:function(data1){
           data_deal(data1,'Gamble');
       },
       error:function(){
           alert("error!");
       },
   });


    $('#bili').change(function(){
    domain_type = $("#bili").find("option:selected").val();

    $.ajax({
       type:"post",
       url:"/ip_domain_num",
       data:{'domain_type':domain_type},
       cache:false,
       success:function(data1){
           data_deal(data1,domain_type);
       },
       error:function(){
           alert("error!");
       },
   });

    });



    /*
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
   */

});
