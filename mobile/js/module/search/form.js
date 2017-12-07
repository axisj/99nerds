/**
 * 카테고리 리스트 상품 정렬
 */
var aUrl = location.href.split('?');

$(document).ready(function(){
    if (aUrl[1].indexOf('sort_method') > -1) {
        for (var i=0; i<$('#selArray option').length; i++) {
            if ($('#selArray option:eq('+i+')').val().indexOf(aUrl[1]) > -1) {
                $('#selArray option:eq('+i+')').attr("selected", true);
            }
        }
    }
});

$('#selArray').change(function() {
    if ($('#selArray').val()) {
        location.href=$('#selArray').val();
    }
});

function goThumg(url) {
    location.href = url+'?'+aUrl[1];
}

$('#order_by').change(function() {
    var aUrl = location.href.split('?');
    if ($(this).find('option:selected').val()) {
        if (aUrl[1].indexOf('order_by') == -1) {
            location.href = location.href+'&order_by='+$(this).find('option:selected').val();
        } else {
            aParam = aUrl[1].split('&');
            for(var x in aParam) {
                if (aParam[x].indexOf('order_by') > -1) {
                    aParam[x] = 'order_by='+$(this).find('option:selected').val();
                }
            }
            location.href = location.href+'?'+aParam.join('&');
        }
    }
});