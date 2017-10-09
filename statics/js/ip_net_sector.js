/*
function option_select(param){
    alert(param);
}
*/
var option_select;


$(document).ready(function(){


    option_select=function(param){

        $('#type-button').text = param;
        var type_dict = {"Gamble":"赌博", "Porno":"色情", "all":"全部"}
        document.getElementById("type-button").innerHTML=type_dict[param];

        $.ajax({
           type:"post",
           url:"/ip_net_sector",
           data:{'domain_type':param},
           cache:false,
           success:function(data1){
               data_deal(data1,domain_type);
           },
           error:function(){
               alert("error!");
           },
       });
    }

    test=function(){
        alert('test!');
    }

    function data_deal(data1, domain_type)
    {
        dataSet = data1['domain_general']
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#ip-netsector-table').DataTable({
            destroy: true,
            searching: false,
            //每页显示n条数据
            pageLength: 20,
            //data: dataSet,
            data:dataSet,
            columns: [{
                "data": null //此列不绑定数据源，用来显示序号
            },
            {
                "data": "category"
            },
            {
                "data": "ips"
            },
            {
                "data": "domain"
            },
            {
                "data": "geo"
            }
        ],
        //"columnDefs":可以对各列内容进行处理，从而显示想显示的内容
        columnDefs: [
            {
            "targets": [1],
            "data": "category",
            "render": function(data, type, full) {
                var category = data + "类地址";
                return category;
                }
            },
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
                //return data.length
                }
            },
            {
            "targets": [3],
            "data": "domain",
            "render": function(data, type, full) {

                var domain_data="";
                var domain_num;
                if (domain_type != "all")
                {
                    for(var i=0;i<data.length;i++)
                    {
                        domain_data = domain_data + data[i] + '\n'
    	            }
                    return "<a title='"+domain_data+"' href=''>"+data.length+"</a>";
                }
                else {
                    domain_num = data[0].length + data[1].length;
                    domain_data = "赌博： " + data[0].length + "\n" + "色情: " + data[1].length + "\n";
                    return "<a title='"+domain_data+"' href=''>"+domain_num+"</a>";
                }


                }
            },
            {
            "targets": [4],
            "data": "geo",
            "render": function(data, type, full) {

                var geo_data="";
                for(var i=0;i<data.length;i++)
                {
                        geo_data = geo_data + data[i] + '\n';
	            }

                return "<a title='"+geo_data+"' href=''>"+data.length+"</a>";
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


    var domain_type="Gamble"; //默认显示赌博类域名数据

    $.ajax({
       type:"post",
       url:"/ip_net_sector",
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

option_select();
