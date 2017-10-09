var option_select;
$(document).ready(function(){

    function data_deal(data1, domain_type)
    {
        dataSet = data1[domain_type]
        //dataSet=data1['row']; //这里其实是列表了
        var t = $('#special-domain-table').DataTable({
            destroy: true,
            searching: false,
            //每页显示n条数据
            pageLength: 20,
            //data: dataSet,
            data:dataSet,
            // temp_dict = {'domain': item['domain'], 'opers':{}, 'geos':{}, 'sectors':0, 'ips':[]}
            columns: [{
                "data": null //此列不绑定数据源，用来显示序号
            },
            {
                "data": "domain"
            },
            {
                "data": "ips"
            },
            {
                "data": "opers"
            },
            {
                "data": "geos"
            },
            {
                "data": "sectors"
            }
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

                return "<a title='"+ip_data+"' href=''>"+data.length+"</a>";

                }
            },
            {
            "targets": [3],
            "data": "opers",
            "render": function(data, type, full) {

                var oper_data="";
                var length=0;
                for (value in data)
                {
                    oper_data = oper_data + value + ": " + data[value].length + '\n';
                    length = length + 1; //计算oper数量
                }


                return "<a title='"+oper_data+"' href=''>"+length+"</a>";// 也可以不用a标签，用<span>

                }
            },
            {
            "targets": [4],
            "data": "geos",
            "render": function(data, type, full) {

                var geo_data="";
                var length=0;
                for (value in data)
                {
                    geo_data = geo_data + value + ": " + data[value].length + '\n';
                    length = length + 1; //计算oper数量
                }


                return "<a title='"+geo_data+"' href=''>"+length+"</a>";// 也可以不用a标签，用<span>


                }
            },
            {"targets": 5},
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



    var response_data;

    $.ajax({
       type:"post",
       url:"/special_domain",
       cache:false,
       success:function(data1){

           response_data = data1;
           data_deal(data1,"Gamble"); //默认显示赌博类域名数据
       },
       error:function(){
           alert("error!");
       },
   });

   option_select=function(param){

        $('#type-button').text = param;
        var type_dict = {"Gamble":"赌博", "Porno":"色情", "all":"全部"}
        document.getElementById("type-button").innerHTML=type_dict[param];
        data_deal(response_data,param);
    }

});
option_select();
