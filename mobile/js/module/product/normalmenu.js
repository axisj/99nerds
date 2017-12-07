/**
 * 카테고리 리스트 상품 정렬
 */
var aUrl = location.href.split('?');
var sQueryString = aUrl[1];

/**
 * 파라미터가 있을경우에만 처리
 */
$(document).ready(function(){
    if (sQueryString && sQueryString.indexOf('sort_method') > -1) {
        for (var i=0; i<$('#selArray option').length; i++) {
            if ($('#selArray option:eq('+i+')').val().indexOf(sQueryString) > -1) {
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
    location.href = url+'?'+sQueryString;
}