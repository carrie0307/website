$(document).ready(function () {

    var len, data
    //首页信息
    $.get('/off', function (data1, ststus) {
        len = data1['length'];
        data = data1['data'];

    });

});
