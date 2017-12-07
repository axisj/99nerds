// 상품상세 탭 이벤트
$('#tabProduct a').click(function(e){
    var oTarget = $(this).attr('href');
    $(this).parent('li').addClass('selected').siblings().removeClass('selected');

    $('#tabProduct a').each(function(){
        var oSiblings = $(this).attr('href');
        if (oTarget != oSiblings) {
            $(oSiblings).hide();
        } else {
            $(oTarget).show();
        }
    });
    removePagingArea(oTarget);

    e.preventDefault();
});

// 해당 게시판 읽기권한 없으면 페이징 삭제
function removePagingArea(oTarget)
{
    if ($(oTarget).length < 1 && (oTarget != '#prdReview' || oTarget != '#prdQna')) return;

    if ($(oTarget).css('display') == 'block') {
        if (oTarget == '#prdReview') {
            //var record = $('#prdReview .xans-record-:first', '.xans-product-review');
            var record = $('.xans-record-:first', '.xans-product-review');
            if (record.length < 1 || record.is(':not(:visible)')) {
                $('.xans-product-reviewpaging').remove();
             }
         } else if (oTarget == '#prdQnA') {
             //var record = $('#prdQnA .xans-record-:first', 'xans-product-qna');
             var record = $('.xans-record-:first', '.xans-product-qna');
             if (record.length < 1 || record.is(':not(:visible)')) {
                 $('.xans-product-qnapaging').remove();
             }
         }
     }
}

$(document).ready(function() {
    // 장바구니, 관심상품, 구매버튼 클론들 액션처리
    $('#actionCartClone, #actionWishClone, #actionBuyClone, #actionWishSoldoutClone').unbind().bind('click', function() {
        try {
            var id = $(this).attr('id').replace(/Clone/g, '');
            if (typeof(id) !== 'undefined') $('#' + id).trigger('click');
            else return false;
        } catch(e) {
            return false;
        }
    });

    // 상품상세설명 없을때 원본보기 삭제
    if ($('#prdDetailContent').text() == "") $('#prdDetailBtn').remove();
});